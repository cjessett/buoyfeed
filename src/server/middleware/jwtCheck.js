import jwt from 'express-jwt'
import jwks from 'jwks-rsa'

export default (credentialsRequired = true) => jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    jwksUri: process.env.JWKS_URI,
  }),
  credentialsRequired,
  // Validate the audience and the issuer.
  aud: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ['RS256'],
})
