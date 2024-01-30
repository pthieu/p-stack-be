module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
    jasmine: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {},
  },
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended', // Make sure this is always the last element in the array.
  ],
  plugins: ['@typescript-eslint'],
  ignorePatterns: '**/dist/*.js',
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-debugger': 'warn',
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
      },
    ],
    'import/newline-after-import': [2],
    'import/no-named-as-default': 'off',
    'import/no-anonymous-default-export': 'off',
    'linebreak-style': ['error', 'unix'],
    'no-console': 'off',
    quotes: [2, 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'prettier/prettier': [
      'error',
      {
        parser: 'typescript',
        arrowParens: 'always',
        bracketSpacing: true,
        bracketSameLine: false,
        printWidth: 80,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
      },
      {
        usePrettierrc: false,
      },
    ],
  },
};
