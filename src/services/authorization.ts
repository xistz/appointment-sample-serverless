import { getToken, Jwt, JwtPayload } from '@libs/Jwt';
import { decode, verify, VerifyOptions } from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import 'source-map-support/register';
import { promisify } from 'util';

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;
const client = jwksClient({
  jwksUri: jwksUrl,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

export async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt;

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  const verifyOptions: VerifyOptions = {
    algorithms: ['RS256'],
    audience: [
      process.env.AUTH0_AUDIENCE as string,
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
    ],
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  };

  const getSigningKey = promisify(client.getSigningKey);
  const key = await getSigningKey(jwt.header.kid);
  const signingKey = key.getPublicKey();
  const verifiedToken = verify(token, signingKey, verifyOptions) as JwtPayload;

  return verifiedToken;
}
