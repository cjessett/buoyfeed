import { combineReducers } from 'redux'
import meta from './meta'
import buoys from './buoys'
import user from './user'
import createAuth from '../../modules/auth'

const auth = createAuth()

export default combineReducers({
  meta,
  buoys,
  user,
  auth: () => auth,
})
