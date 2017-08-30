require('dotenv').load()
/* eslint-disable import/first */
import web from './web'
import app from './app'
import { FEED_URL } from './constants'
import mongoConfig from './mongoConfig'

require('source-map-support').install()

const instance = app({ mongoConfig, url: FEED_URL })

function createServer() {
  const webInstance = web(instance)

  if (process.env.NODE_ENV !== 'production') {
    const refreshInterval = process.env.REFRESH_INTERVAL || 20
    instance.updateFeed()
    setInterval(() => instance.updateFeed(), refreshInterval * 60 * 1000)
  }

  const server = webInstance.listen(process.env.PORT || 8080, () => {
    if (process.env.NODE_ENV === 'production') process.send('ready')
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
