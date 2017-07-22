require('dotenv').config()

import web from './web'
import app from './app'
import { MONGODB_URL, FEED_URL } from './constants'

console.log(MONGODB_URL)
require('source-map-support').install()

const instance = app({ mongoUrl: MONGODB_URL, url: FEED_URL })

function createServer() {
  instance.updateFeed()
  setInterval(() => instance.updateFeed(), 60 * 10 * 1000)
  const webInstance = web(instance)

  const server = webInstance.listen(process.env.PORT || 8080, () => {
    console.log(`[server] app on http://localhost:${server.address().port} - ${webInstance.settings.env}`)
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
