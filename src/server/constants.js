const user = process.env.MONGO_USER
const password = process.env.MONGO_PASSWORD
const isProd = process.env.NODE_ENV === 'production'
const mongoUrl = `mongodb://${user}:${password}@ds117093.mlab.com:17093/buoyfeed`
const MONGODB_URL = isProd ? mongoUrl : 'mongodb://localhost:27017'

const FEED_URL = 'http://www.ndbc.noaa.gov/rss/ndbc_obs_search.php?lat=40N&lon=73W&radius=100'

export {
  FEED_URL,
  MONGODB_URL,
}
