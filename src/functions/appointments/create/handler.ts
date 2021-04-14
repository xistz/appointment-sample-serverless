import {
  formatJSONResponse,
  ValidatedEventBodyAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUser, isClient } from '@libs/Jwt';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';
import { createAppointment } from '@services/appointment';
import 'source-map-support/register';
import schema from './schema';

const logger = createLogger('createAppointmentFunction');

const handler: ValidatedEventBodyAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const user = getUser(event.headers.Authorization);
  const { availability_id } = event.body;

  if (!isClient(user)) {
    return formatJSONResponse(
      {
        message: `user is not a client`,
      },
      403
    );
  }

  logger.info(`creating appointment for availability ${availability_id}`);

  await createAppointment(user.id, availability_id);

  return formatJSONResponse({ message: 'created appointment' }, 201);
};

export const main = middyfy(handler);
