import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { registerUser } from 'src/service/user';

import schema from './schema';

interface User {
  id: string;
  role: string[];
}

const register: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const user = {
    id: 'dummy',
    role: [],
  };
  const { role } = event.body;

  if (!isNewUser(user)) {
    return formatJSONResponse(
      {
        message: `user has already registered as a ${user.role[0]}`,
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

function isNewUser(user: User) {
  if (user.role.length !== 0) return false;
  return true;
}
