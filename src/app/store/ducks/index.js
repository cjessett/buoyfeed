import { combineReducers } from 'redux'
import meta from './meta'
import buoys from './buoys'
import user from './user'

export default combineReducers({
  meta,
  buoys,
  user,
})
