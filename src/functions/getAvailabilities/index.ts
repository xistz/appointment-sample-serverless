import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        authorizer: 'auth',
        method: 'get',
        path: 'availabilities',
        cors: true,
        request: {
          // schemas: {
          //   'application/json': schema,
          // },
          parameters: {
            querystrings: {
              from: true,
              to: true,
            },
          },
        },
      },
    },
  ],
};
