import {
  formatJSONResponse,
  ValidatedEventQueryAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUser, User } from '@libs/Jwt';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';
import { listAvailabilities } from '@services/availability';
import 'source-map-support/register';
import schema from './schema';

const logger = createLogger('getAvailabilitiesFunction');

const getAvailabilities: ValidatedEventQueryAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const user = getUser(event.headers.Authorization);
  const { from, to } = event.queryStringParameters;

  if (!isFP(user)) {
    return formatJSONResponse(
      {
        message: `user is not a financial planner`,
      },
      403
    );
  }

  logger.info(`getting availabilities for financial planner`);

  const availabilities = await listAvailabilities(user.id, from, to);

  return formatJSONResponse({ data: availabilities });
};

export const main = middyfy(getAvailabilities);

const isFP = (user: User) =>
  user.roles.length === 1 && user.roles[0] === 'financial planner';