import {
  formatJSONResponse,
  ValidatedEventQueryAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUser, isClient } from '@libs/Jwt';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';
import { Availability } from '@models/availability';
import {
  getAvailabilities,
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

  logger.info(
    `getting availabilities for financial planner between ${from} and ${to}`
  );

  let availabilities: Availability[];

  if (from && to) {
    availabilities = await searchAvailabilitiesByDate(from, to, user.id);
  } else {
    availabilities = await searchAvailabilitiesByTime(at);
  }

  return formatJSONResponse({ data: availabilities });
};

export const main = middyfy(handler);
