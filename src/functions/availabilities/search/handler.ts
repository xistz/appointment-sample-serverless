import {
  formatJSONResponse,
  ValidatedEventQueryAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUser, isClient } from '@libs/Jwt';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';
import {
  searchAvailabilitiesByDate,
  searchAvailabilitiesByTime,
} from '@services/availability';
import 'source-map-support/register';
import schema from './schema';

const logger = createLogger('getAvailabilitiesFunction');

const handler: ValidatedEventQueryAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const user = getUser(event.headers.Authorization);
  const { from, to, at } = event.queryStringParameters;

  if (!isClient(user)) {
    return formatJSONResponse(
      {
        message: `user is not a client`,
      },
      403
    );
  }

  logger.info(`getting availabilities for client ${from} and ${to}`);

  let data;

  if (from && to) {
    data = await searchAvailabilitiesByDate(from, to, user.id);
  } else {
    data = await searchAvailabilitiesByTime(at);
  }

  return formatJSONResponse({ data });
};

export const main = middyfy(handler);
