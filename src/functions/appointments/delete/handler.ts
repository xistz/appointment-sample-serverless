import {
  formatJSONResponse,
  ValidatedEventPathAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUser } from '@libs/Jwt';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';
import { deleteAppointment } from '@services/appointment';
import 'source-map-support/register';
import schema from './schema';

const logger = createLogger('deleteAppointmentFunction');

const handler: ValidatedEventPathAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const user = getUser(event.headers.Authorization);
  const { id } = event.pathParameters;

  logger.info(`deleting appointment`);

  await deleteAppointment(id, user.id);

  return formatJSONResponse({ message: 'deleted appointment' });
};

export const main = middyfy(handler);
