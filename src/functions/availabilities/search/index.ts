import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        authorizer: 'auth',
        method: 'get',
        path: 'availabilities/search',
        cors: true,
        request: {
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
  iamRoleStatementsName: 'searchAvailabilities-role',
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:Query'],
      Resource:
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.AVAILABILITIES_TABLE}/index/${self:provider.environment.AVAILABILITIES_FP_ID_FROM_INDEX}',
    },
  ],
};
