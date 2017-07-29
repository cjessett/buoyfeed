import express from 'express'
import shrinkRay from 'shrink-ray'
import morgan from 'morgan'
import { serveStatic, cacheControl, strictTransportSecurity } from './middleware'
import { root, buoys } from './routes'
import { JWT_SECRET } from './constants'

export default (app) => {
  // likely our proxy will handle compression, cache-control, etc. these are healthy defaults
  const web = express()
  web.disable('x-powered-by')
  web.use(shrinkRay())
  web.use(strictTransportSecurity())
  web.use(serveStatic()) // immutable static content
  web.use(cacheControl()) // cache control for the rest
  web.use(morgan('dev'))
  web.set('secret', JWT_SECRET)
  web.use('/buoys', buoys(app))
  web.use('/*', root(app)) // everything else

  return web
}
