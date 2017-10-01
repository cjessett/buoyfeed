require('dotenv').load()
/* eslint-disable import/first */
import app from './app'
import { FEED_URL } from './constants'
import mongoConfig from './mongoConfig'

require('source-map-support').install()

const refreshInterval = process.env.FEED_REFRESH_INTERVAL || 60
const instance = app({ mongoConfig, url: FEED_URL })

function start() {
  console.log({ type: 'info', msg: 'starting worker' })

  function shutdown() {
    console.log({ type: 'info', msg: 'shutting down' })
    process.exit()
  }

  if (process.env.NODE_ENV === 'production') process.send('ready')
  instance.on('lost', shutdown)
  instance.updateFeed()
  setInterval(() => instance.updateFeed(), refreshInterval * 60 * 1000)

  process.on('SIGTERM', shutdown)
}

instance.on('ready', start)
