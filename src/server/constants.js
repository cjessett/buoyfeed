import { user, password, host, port, db } from './mongoConfig'

const MONGODB_URL = `${user}:${password}@${host}:${port}/${db}`
const FEED_URL = 'http://www.ndbc.noaa.gov/rss/ndbc_obs_search.php?lat=40N&lon=73W&radius=100'

export {
  FEED_URL,
  MONGODB_URL,
}
