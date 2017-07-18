import web from './web'
import app from './app'
import { MONGODB_URL, FEED_URL } from './constants'

require('source-map-support').install()

const instance = app({ mongoUrl: MONGODB_URL, url: FEED_URL })

function createServer() {
  instance.watchFeed()

  const server = web.listen(process.env.PORT || 8080, () => {
    console.log(`[server] app on http://localhost:${server.address().port} - ${web.settings.env}`)
  })

  function shutdown() {
    server.close(() => process.exit(0))
  }

  process.on('SIGTERM', () => {
    instance
      .removeListener('lost', () => process.exit(0))
      .on('lost', shutdown)
  })
}

instance.on('ready', createServer)
