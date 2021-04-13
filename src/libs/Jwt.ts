import { decode, JwtHeader } from 'jsonwebtoken';

/**
 * Interface representing a JWT token
 */
export interface Jwt {
  header: JwtHeader;
  payload: JwtPayload;
}

/**
 * A payload of a JWT token
 */
export interface JwtPayload {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
  [key: string]: string | number | string[];
}

export interface User {
  id: string;
  roles: string[];
}

/**
 * Parse authorization header and return user object
 * @param authorizationHeader authorization header to parse
 * @returns a user object containing the user's id and roles
 */
export function getUser(authorizationHeader: string): User {
  const jwtToken = getToken(authorizationHeader);
  const decodedJwt = decode(jwtToken) as JwtPayload;

  return {
    id: decodedJwt.sub,
    roles: decodedJwt[`${process.env.AUTH0_NAMESPACE}/roles`] as string[],
  };
}

export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header');

  const split = authHeader.split(' ');
  const token = split[1];

  return token;
}

export const isFP = (user: User) =>
  user.roles.length === 1 && user.roles[0] === 'financial planner';

export const isClient = (user: User) =>
  user.roles.length === 1 && user.roles[0] === 'client';
