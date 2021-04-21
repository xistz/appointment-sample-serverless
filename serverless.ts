import auth from '@functions/auth';
import {
  createAvailability,
  deleteAvailability,
  listAvailabilities,
  searchAvailabilities,
} from '@functions/availabilities';
import {
  createAppointment,
  deleteAppointment,
  listAppointments,
} from '@functions/appointments';
import register from '@functions/register';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'appointment-sample-serverless',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-iam-roles-per-function'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-northeast-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      AUTH0_DOMAIN: '${env:AUTH0_DOMAIN}',
      AUTH0_AUDIENCE: '${env:AUTH0_AUDIENCE}',
      AUTH0_NAMESPACE: '${env:AUTH0_NAMESPACE}',
      AUTH0_CLIENT_ID: '${env:AUTH0_CLIENT_ID}',
      AUTH0_CLIENT_SECRET: '${env:AUTH0_CLIENT_SECRET}',
      AVAILABILITIES_TABLE: 'Availabilities-${self:provider.stage}',
      AVAILABILITIES_FP_ID_FROM_INDEX: 'AvailabilitiesFpIdFromIndex',
      AVAILABILITIES_CLIENT_ID_FROM_INDEX: 'AvailabilitiesClientIdFromIndex',
      AVAILABILITIES_FROM_INDEX: 'AvailabilitiesAvailableFromIndex',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    register,
    auth,
    createAvailability,
    deleteAvailability,
    listAvailabilities,
    searchAvailabilities,
    createAppointment,
    deleteAppointment,
    listAppointments,
  },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Methods':
              "'GET,OPTIONS,POST'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      availabilitiesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'fpId',
              AttributeType: 'S',
            },
            { AttributeName: 'from', AttributeType: 'S' },
            { AttributeName: 'clientId', AttributeType: 'S' },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          TableName: '${self:provider.environment.AVAILABILITIES_TABLE}',
          BillingMode: 'PAY_PER_REQUEST',
          GlobalSecondaryIndexes: [
            {
              IndexName:
                '${self:provider.environment.AVAILABILITIES_FP_ID_FROM_INDEX}',
              KeySchema: [
                {
                  AttributeName: 'fpId',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'from',
                  KeyType: 'RANGE',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
            {
              IndexName:
                '${self:provider.environment.AVAILABILITIES_CLIENT_ID_FROM_INDEX}',
              KeySchema: [
                {
                  AttributeName: 'clientId',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'from',
                  KeyType: 'RANGE',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
            {
              IndexName:
                '${self:provider.environment.AVAILABILITIES_FROM_INDEX}',
              KeySchema: [
                {
                  AttributeName: 'from',
                  KeyType: 'HASH',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
