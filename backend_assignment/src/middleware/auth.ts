// src/middleware/auth.ts

import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';


const domain = process.env.AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE;

if (!domain || !audience) {
  throw new Error('Missing AUTH0_DOMAIN or AUTH0_AUDIENCE in .env');
}

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ['RS256'],
});
