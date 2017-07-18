import { combineReducers } from 'redux'
import meta from './meta'
import posts from './posts'
import buoys from './buoys'

export default combineReducers({
  meta,
  posts,
  buoys,
})
