import express from 'express'
import shrinkRay from 'shrink-ray'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { serveStatic, cacheControl, strictTransportSecurity, session } from './middleware'
import { root, buoys, favorites, auth } from './routes'


export default (app) => {
  // likely our proxy will handle compression, cache-control, etc. these are healthy defaults
  const web = express()
  web.disable('x-powered-by')
  web.use(shrinkRay())
  web.use(strictTransportSecurity())
  web.use(serveStatic()) // immutable static content
  web.use(cacheControl()) // cache control for the rest
  web.use(bodyParser.json())
  web.use(bodyParser.urlencoded({ extended: true }))
  web.use(morgan('dev'))
  web.use(session)
  web.use('/auth', auth(app))
  web.use('/favorites', favorites(app))
  web.use('/buoys', buoys(app))
  web.use('/*', root(app)) // everything else

  return web
}
