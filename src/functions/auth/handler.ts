import { createLogger } from '@libs/logger';
import { verifyToken } from '@services/authorization';
import {
  APIGatewayTokenAuthorizerEvent,
  CustomAuthorizerResult,
} from 'aws-lambda';
import 'source-map-support/register';

const logger = createLogger('authFunction');

export const main = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('authorizing user');
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info('user authorized', jwtToken.sub);

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
    logger.error('failed to authorized user', e);
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
