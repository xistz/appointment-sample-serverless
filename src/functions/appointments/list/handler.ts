import {
  formatJSONResponse,
  ValidatedEventQueryAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUser, isFP } from '@libs/Jwt';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';
import { listAppointments } from '@services/appointment';
import 'source-map-support/register';
import schema from './schema';

const logger = createLogger('getAppointmentsFunction');

const handler: ValidatedEventQueryAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const user = getUser(event.headers.Authorization);
  const { from, to } = event.queryStringParameters;

  logger.info(`getting appointments between ${from} and ${to}`);

  const appointments = await listAppointments(user.id, isFP(user), from, to);

  return formatJSONResponse({ data: appointments });
};

export const main = middyfy(handler);
