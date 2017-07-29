import { combineReducers } from 'redux'
import meta from './meta'
import buoys from './buoys'

export default combineReducers({
  meta,
  buoys,
})
