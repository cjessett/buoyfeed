import http from 'http'
import throng from 'throng'

import app from './app'
import { FEED_URL } from './constants'
import mongoConfig from './mongoConfig'

require('dotenv').config()

require('source-map-support').install()

http.globalAgent.maxSockets = Infinity

function start() {
  const instance = app({ mongoConfig, url: FEED_URL })
  const refreshInterval = process.env.FEED_REFRESH_INTERVAL || 20

  console.log({ type: 'info', msg: 'starting worker' })

  function shutdown() {
    console.log({ type: 'info', msg: 'shutting down' })
    process.exit()
  }

  function beginWork() {
    if (process.env.NODE_ENV === 'production') process.send('ready')
    instance.on('lost', shutdown)
    instance.updateFeed()
    setInterval(() => instance.updateFeed(), refreshInterval * 60 * 1000)
  }

  instance.on('ready', beginWork)
  process.on('SIGTERM', shutdown)
}

throng({ workers: 1, start })
