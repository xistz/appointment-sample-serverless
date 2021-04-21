# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

This application allows financial planners and clients to make appointments to discuss financial planning. Financial planners can indicate their availability and view appointments. Clients can make and view appointments.

It is inspired by [Calendly](https://calendly.com/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.16.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas
- `services` - containing service layer code

```shell
.
├── src
│   ├── databases               # Database layer
│   │   └── availabilities.ts   # Availabilities dynamodb store
│   │
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── appointments
│   │   │   ├── create
│   │   │   │   ├── handler.ts  # `createAppointment` lambda source code
│   │   │   │   ├── index.ts    # `createAppointment` lambda Serverless configuration
│   │   │   │   └── schema.ts   # `createAppointment` lambda input event JSON-Schema
│   │   │   ├── delete
│   │   │   │   ├── handler.ts  # `deleteAppointment` lambda source code
│   │   │   │   ├── index.ts    # `deleteAppointment` lambda Serverless configuration
│   │   │   │   └── schema.ts   # `deleteAppointment` lambda input event JSON-Schema
│   │   │   ├── list
│   │   │   │   ├── handler.ts  # `listAppointments` lambda source code
│   │   │   │   ├── index.ts    # `listAppointments` lambda Serverless configuration
│   │   │   │   └── schema.ts   # `listAppointments` lambda input event JSON-Schema
│   │   │   └── index.ts        # appointments lambda Serverless configuration
│   │   ├── auth
│   │   │   ├── handler.ts      # `auth` lambda source code
│   │   │   └── index.ts        # `auth` lambda Serverless configuration
│   │   ├── availabilities
│   │   │   ├── create
│   │   │   │   ├── handler.ts  # `createAvailability` lambda source code
│   │   │   │   ├── index.ts    # `createAvailability` lambda Serverless configuration
│   │   │   │   └── schema.ts   # `createAvailability` lambda input event JSON-Schema
│   │   │   ├── delete
│   │   │   │   ├── handler.ts  # `deleteAvailability` lambda source code
│   │   │   │   ├── index.ts    # `deleteAvailability` lambda Serverless configuration
│   │   │   │   └── schema.ts   # `deleteAvailability` lambda input event JSON-Schema
│   │   │   ├── list
│   │   │   │   ├── handler.ts  # `listAvailabilities` lambda source code
│   │   │   │   ├── index.ts    # `listAvailabilities` lambda Serverless configuration
│   │   │   │   └── schema.ts   # `listAvailabilities` lambda input event JSON-Schema
│   │   │   ├── search
│   │   │   │   ├── handler.ts  # `searchAvailabilities` lambda source code
│   │   │   │   ├── index.ts    # `searchAvailabilities` lambda Serverless configuration
│   │   │   │   └── schema.ts   # `searchAvailabilities` lambda input event JSON-Schema
│   │   │   └── index.ts        # availabilities lambda Serverless configuration
│   │   └── register
│   │       ├── handler.ts      # `register` lambda source code
│   │       ├── index.ts        # `register` lambda Serverless configuration
│   │       └── schema.ts       # `register` lambda input event JSON-Schema
│   │
│   ├── libs                    # Lambda shared code
│   │   └── apiGateway.ts       # API Gateway specific helpers
│   │   └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│   │   └── Jwt.ts              # Jwt helpers
│   │   └── lambda.ts           # Lambda middleware
│   │   └── lambda.ts           # Logging middleware
│   │
│   ├── models
│   │   └── appointment.ts      # appointment models
│   │   └── availability.ts     # availability models
│   │   └── user.ts             # user model
│   │
│   └── services                # Service layer
│       └── appointment.ts      # Appointment service
│       └── authorization.ts    # Authorization service
│       └── availability.ts     # Availability service
│       └── user.ts             # User service
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`
