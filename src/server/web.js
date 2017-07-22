import express from 'express'
import shrinkRay from 'shrink-ray'
import { serveStatic, cacheControl, strictTransportSecurity } from './middleware'
import { root, buoys } from './routes'

export default (app) => {
  // likely our proxy will handle compression, cache-control, etc. these are healthy defaults
  const web = express()
  web.disable('x-powered-by')
  web.use(shrinkRay())
  web.use(strictTransportSecurity())
  web.use(serveStatic()) // immutable static content
  web.use(cacheControl()) // cache control for the rest
  web.use('/buoys', buoys(app))
  web.use('/*', root(app)) // everything else

  return web
}
