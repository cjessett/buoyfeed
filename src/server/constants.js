const FEED_URL = 'http://www.ndbc.noaa.gov/rss/ndbc_obs_search.php?lat=40N&lon=73W&radius=100'
const MONGODB_URL = process.env.NODE_ENV ? process.env.MONGO_URL : 'mongodb://localhost:27017'

export {
  FEED_URL,
  MONGODB_URL,
}
