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
          parameters: {
            queryStrings: {
              from: true,
              to: true,
            },
          },
        },
      },
    },
  ],
};
