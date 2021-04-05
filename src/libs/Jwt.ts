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
 * Parse a JWT token and return user's roles
 * @param jwtToken JWT token to parse
 * @returns a user object containing the user's id and roles
 */
export function getUser(jwtToken: string): User {
  const decodedJwt = decode(jwtToken) as JwtPayload;

  return {
    id: decodedJwt.sub,
    roles: decodedJwt[`${process.env.AUTH0_NAMESPACE}/roles`] as string[],
  };
}
