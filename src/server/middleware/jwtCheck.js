import jwt from 'express-jwt'
import jwks from 'jwks-rsa'

export default (credentialsRequired = true) => jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  credentialsRequired,
  // Validate the audience and the issuer.
  aud: process.env.AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
})
