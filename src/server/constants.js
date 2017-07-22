const user = process.env.MONGO_USER
const password = process.env.MONGO_PASSWORD
// const isProd = process.env.NODE_ENV === 'production'
const MONGODB_URL = `mongodb://${user}:${password}@ds153652.mlab.com:53652/buoyfeed`
// const  = isProd ? mongoUrl : 'mongodb://localhost:27017'

const FEED_URL = 'http://www.ndbc.noaa.gov/rss/ndbc_obs_search.php?lat=40N&lon=73W&radius=100'

export {
  FEED_URL,
  MONGODB_URL,
}
