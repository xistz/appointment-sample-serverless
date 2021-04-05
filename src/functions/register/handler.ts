import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { getUser, User } from '@libs/Jwt';
import { middyfy } from '@libs/lambda';
import { registerUser } from '@services/user';
import 'source-map-support/register';
import schema from './schema';

const register: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const user = getUser(event.headers.Authorization);
  const { role } = event.body;

  console.info('role', role);
  console.info('user', user);

  if (!isNewUser(user)) {
    return formatJSONResponse(
      {
        message: `user has already registered as a ${user.roles[0]}`,
      },
      400
    );
  }

  await registerUser(user.id, role);

  return formatJSONResponse({
    message: `registered as a ${role}`,
  });
};

export const main = middyfy(register);

const isNewUser = (user: User) => user.roles.length === 0;
