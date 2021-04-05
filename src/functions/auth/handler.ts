import { verifyToken } from '@services/authorization';
import {
  APIGatewayTokenAuthorizerEvent,
  CustomAuthorizerResult,
} from 'aws-lambda';
import 'source-map-support/register';

export const main = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    console.log('called authorizer');
    const jwtToken = await verifyToken(event.authorizationToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    };
  } catch (e) {
    console.log('error', e);
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }
};
