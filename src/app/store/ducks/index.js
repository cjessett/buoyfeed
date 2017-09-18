import { combineReducers } from 'redux'
import meta from './meta'
import buoys from './buoys'
import user from './user'
// import auth from './auth'

export default combineReducers({
  meta,
  buoys,
  user,
})
