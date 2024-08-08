# Phong's Boilerplate for Backend Apps

# TODO
- [ ] switch to hono, uses standard js api, can run anywhere (maybe?)
- [ ] add multi-row insert example
- [ ] bring over gql from cedar, replace current gql
- [ ] remove axios, use built in `fetch` from node
- [ ] Look into docker layer caching to improve build speed
- [ ] Add a logger lib to add timestamps
- [ ] Add pagination example
- [ ] Add login with google example and middleware for role auth
- [ ] Figure out error logs in production, with build and minification, hard to see which line it broke on
- [ ] Middleware to print incoming requests?
- [ ] Add testing framework and unit test

# Stack
- TypeScript
- ESLint + Prettier
- Absolute imports
- Express.js
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- Cloud secrets config override (AWS SSM Parameter Store)
- [ESBuild](https://esbuild.github.io/)
- Docker (~24MB image size on AWS ECR)
- CircleCI
- [PNPM](https://pnpm.io/) (mostly for Docker, you can use whatever)


# File Structure
```
.
├── README.md
├── package.json, pnpm-lock.yaml, esbuild.mjs
├── .gitignore, .eslintrc.js, tsconfig.json, vite.config.ts
├── .env*
├── scripts/ -- For non-source scripts
├── src/
│   ├── index.ts - entry point
│   ├── app.ts - express app
│   ├── config.ts - global config with cloud override
│   ├── db/
│   │   ├── migrations/ -- auto-generated by Drizzle
|   |   |   └── meta/ -- Drizzle journal, commit this
│   │   ├── schema/ -- Drizzle takes these and auto-generates migrations
│   │   └── index.ts - DB connection and migration function
│   ├── api/
│   │   └── route/
│   │       ├── index.ts - route path definitions
│   │       └── controller.ts - route handlers
│   ├── types/
│   │   └── index.ts - all types here unless domain-specific (i.e. DB) or app gets large
│   ├── lib
│   │   └── domain.ts - i.e. utils, user, auth, etc.
│   └── services
│       └── domain.ts - i.e. openai, pinecone, google, etc.
└── Dockerfile, .dockerignore, docker-compose.yaml
```

# Setup

## Node
Set up your `.env` based on `.env.example` then:

```
pnpm i
pnpm migrate:generate
pnpm dev
```

# Debugging

## VSCode
Debug with this `launch.json`
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug",
      "request": "launch",
      "type": "node-terminal"
      "command": "pnpm dev",
    }
  ]
}
```

## CLI
TBD

# Details

## Database

We're using [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) because they're a lightweight wrapper on top of SQL. They abstract away a lot of boilerplate connecting Typescript to SQL without getting in your way and they don't compromise on technical decisions by trying to support other languages (unlike a certain other popular ORM).

### Migrations

The thing about Schema-first Typescript ORMs is that most of them require the migrations to happen at the application level to reduce risks associate d with schema drift (time between the DB schema changing and application code chainging) and because the library doesn't know your compilation strategy. You can probably pull it out into its own `.ts` script and import the `config`, but the build steps will have to change a bit.

Specific to Drizzle though, we need to commit the `meta` metadata folder. They haven't documented why but they've confirmed to do this on Discord. In a multi-dev project, you can run the `pnpm migrate:check` command to see if your migrations are in sync.

On build, ESBuild will copy migrations over to the output folder at `./migrations`. The `~/db/index.ts` is set up to look for a migrations folder at `__dirname/migrations`, so for both local dev and production, it will work. If you move the `migrationToLatest` function somwehere else or decide to modify the migration folder path, you'll also need to modify the copy path in `esbuild.mjs`.

I have yet to confirm, but Drizzle *should* have a lock at the DB level on a migration, so multiple instances of the services shouldn't conflict.


# Deployment

## Docker
Set up your `.env.docker` based on `.env.example`, you'll have to use `host.docker.internal` for the DB host instead of `localhost`, then:

```
docker build -t ts-api .
docker-compose up -d
```

If the docker container spins up, you're good and you can use whatever deployment mechanism you want.


## CircleCI

The repo uses CircleCI because it has a free tier and it's widely accepted. You can swap this out with whatever you want, like GitHub Actions.

### Architecture

Depending on where you're deploying, you'll need to update the `architecture` variable. The current config builds for linux/arm64.

## Environment Variables
TBD:
  - Cloud secrets, pull from AWS SSM Parameter Store

# Resources
- [Reducing Docker image size #1](https://odino.org/minimal-docker-run-your-nodejs-app-in-25mb-of-an-image/)
- [Reducing Docker image size #2](https://learnk8s.io/blog/smaller-docker-images)




# Raw Notes (organize later)
Considerations

Constraints: keep to ECS->EC2 because we went for the savings plan and already on EC2
Others:
- Keep it simple, as little pieces as possible
- Not serverless because we need to support built-in cron jobs 




Looked at ECS but wasn't an easy way to host containers in a single cluster and traffic through via domains.
- Common setup is ALB/NLB, but will cost more money
- 


# CI/CD
- Using https://containrrr.dev/watchtower/arguments/ to update containers, it will poll every few minutes (configurable) and update containers if there is a new image available. CircleCI will handle the building


# Secrets & Environment Variables
- ECS has a direct integration with Secrets Manger or SSM
- SSM is free for storage and costs money for retrieval, but it's a negligible amount
- Secrets Manager costs $0.40 per secret per month, and 0.05 per 10,000 API calls... so fuckkk that


Watch tower
- new env vars on child containers?
- new containers after watchtower spawned?



## New projects
If a new project is created, what is needed to be done to get this up? Can it be IaC'd? how much manual work and steps?



TODO
1. Figure out how to get env vars into container, work with AWS SSM at run time, not build time (build time is bad practice)
2. Choose a registry
3. Deploy the container on EC2
4. Deploy watch tower
