const app = require('./src/server/app')
const { MONGODB_URL, FEED_URL } = require('./src/server/constants')

const instance = app({ mongoUrl: MONGODB_URL, url: FEED_URL })

instance.updateFeed()
