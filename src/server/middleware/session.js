import session from 'express-session'
import redis from 'connect-redis'

const RedisStore = redis(session)

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT
const secret = process.env.SESSION_SECRET || 'waves'
const isProd = process.env.NODE_ENV === 'production'

const store = isProd ? new RedisStore({ host, port }) : undefined

export default () => session({ secret, store, resave: false, saveUninitialized: true })
