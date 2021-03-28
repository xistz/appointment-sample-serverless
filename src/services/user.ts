import { ManagementClient, GetUsersData, ObjectWithId, RolesData } from 'auth0';

const auth0 = new ManagementClient({
  domain: `${process.env.AUTH0_DOMAIN}`,
  clientId: `${process.env.AUTH0_CLIENT_ID}`,
  clientSecret: `${process.env.AUTH0_CLIENT_SECRET}`,
});

async function getRoleId(role: string) {
  const results = await auth0.getRoles();

  const filtered = results.filter((result) => result.name === role);

  return filtered[0].id;
}

export async function registerUser(userId: string, role: string) {
  const roleId = await getRoleId(role);

  const params: ObjectWithId = {
    id: userId,
  };
  const data: RolesData = {
    roles: [roleId],
  };

  await auth0.assignRolestoUser(params, data);
}

export async function getUsers(userIds: string[]) {
  const params: GetUsersData = {
    search_engine: 'v3',
    q: `user_id:(${userIds.join(' OR ')})`,
    fields: 'user_id,name,picture',
  };
  const users = await auth0.getUsers(params);

  const results = users.reduce((result, user) => {
    const { name, picture, user_id: userId } = user;
    result[userId] = {
      userId,
      name,
      picture,
    };

    return result;
  }, {});

  return results;
}
