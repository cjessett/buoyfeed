import express from 'express'
import shrinkRay from 'shrink-ray'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { serveStatic, cacheControl, strictTransportSecurity } from './middleware'
import { root, buoys, favorites } from './routes'
import jwtCheck from './middleware/jwtCheck'

export default (app) => {
  // likely our proxy will handle compression, cache-control, etc. these are healthy defaults
  const web = express()
  web.disable('x-powered-by')
  web.use(shrinkRay())
  web.use(strictTransportSecurity())
  web.use(serveStatic()) // immutable static content
  web.use(cacheControl()) // cache control for the rest
  web.use(bodyParser.json())
  web.use(morgan('dev'))
  web.use('/favorites', jwtCheck(), favorites(app))
  web.use('/buoys', jwtCheck(false), buoys(app))
  web.use('/*', root(app)) // everything else

  return web
}
