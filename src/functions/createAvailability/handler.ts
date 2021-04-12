import {
  formatJSONResponse,
  ValidatedEventBodyAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUser, isFP } from '@libs/Jwt';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';
import { createAvailability } from '@services/availability';
import 'source-map-support/register';
import schema from './schema';

const logger = createLogger('createAvailabilityFunction');

const handler: ValidatedEventBodyAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const user = getUser(event.headers.Authorization);
  const { from } = event.body;

  if (!isFP(user)) {
    return formatJSONResponse(
      {
        message: `user is not a financial planner`,
      },
      403
    );
  }

  logger.info(`creating availability for financial planner at ${from}`);

  const id = await createAvailability(user.id, from);

  return formatJSONResponse({ id });
};

export const main = middyfy(handler);
