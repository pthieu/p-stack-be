// src/index.ts --bundle --platform=node --outfile=dist/app.js --minify
import { build } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import fs from 'node:fs';
import path from 'path';

const OUT_DIR = 'dist';

await build({
  entryPoints: ['src/index.ts'],
  platform: 'node',
  target: 'esnext',
  format: 'esm',
  bundle: true,
  minify: false,
  outfile: `${OUT_DIR}/app.js`,
  plugins: [
    copy({
      // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
      // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
      resolveFrom: 'cwd',
      assets: {
        from: ['./src/db/migrations/**/*'],
        to: ['./dist/migrations'],
      },
    }),
  ],
  // XXX(Phong): this is a hack to make esbuild work to allow top-level-awaits.
  // Because we want Vite HMR, we need to, export the server, but we need to
  // await migrations to run before we can export the server.
  banner: {
    js: `
        import { createRequire } from 'node:module';
        import * as __path from 'node:path';
        import * as __url from 'node:url';

        globalThis.require = createRequire(import.meta.url);
        globalThis.__filename = __url.fileURLToPath(import.meta.url);
        globalThis.__dirname = __path.dirname(__filename);
        `,
  },
});

const entryPoints = fs
  .readdirSync('src/db/migrations')
  .filter((file) => file.endsWith('.ts'))
  .map((file) => path.join('src/db/migrations', file));

await build({
  entryPoints,
  bundle: true,
  minify: true,
  platform: 'node',
  packages: 'external',
  outdir: `${OUT_DIR}/migrations`,
}).catch(() => process.exit(1));
