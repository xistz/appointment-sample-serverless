import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        authorizer: 'auth',
        method: 'delete',
        path: 'appointments/{id}',
        cors: true,
        request: {
          parameters: {
            paths: {
              id: true,
            },
          },
        },
      },
    },
  ],
  iamRoleStatementsName: 'deleteAppointment-role',
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:UpdateItem'],
      Resource:
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.AVAILABILITIES_TABLE}',
    },
  ],
};
