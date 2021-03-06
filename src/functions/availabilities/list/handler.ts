import {
  formatJSONResponse,
  ValidatedEventQueryAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUser, isFP } from '@libs/Jwt';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';
import { getAvailabilities } from '@services/availability';
import 'source-map-support/register';
import schema from './schema';

const logger = createLogger('getAvailabilitiesFunction');

const handler: ValidatedEventQueryAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
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

  logger.info(
    `getting availabilities for financial planner between ${from} and ${to}`
  );

  const availabilities = await getAvailabilities(user.id, from, to);

  return formatJSONResponse({ data: availabilities });
};

export const main = middyfy(handler);
