import {
  formatJSONResponse,
  ValidatedEventPathAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUser, isFP } from '@libs/Jwt';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';
import { deleteAvailability } from '@services/availability';
import 'source-map-support/register';
import schema from './schema';

const logger = createLogger('deleteAvailabilityFunction');

const handler: ValidatedEventPathAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const user = getUser(event.headers.Authorization);
  const { id } = event.pathParameters;

  if (!isFP(user)) {
    return formatJSONResponse(
      {
        message: `user is not a financial planner`,
      },
      403
    );
  }

  logger.info(`deleting availability for financial planner`);

  await deleteAvailability(id, user.id);

  return formatJSONResponse({ data: { id } });
};

export const main = middyfy(handler);
