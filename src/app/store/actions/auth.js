import axios from 'axios'
import { updateLocation } from './meta'
import mockStorage from '../../modules/localStorage'

const localStorage = mockStorage().localStorage

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const login = ({ username, password }) => dispatch => (
  axios.post('/auth/login', { username, password })
  .then(({ data: { id } }) => {
    dispatch({ type: LOGIN, payload: { id } })
    dispatch(updateLocation('/'))
  })
  .catch(error => console.log(error))
)

export const signup = ({ username, password, passwordConf }) => dispatch => (
  axios.post('/auth/signup', { username, password, passwordConf })
  .then(({ data: { id } }) => {
    dispatch({ type: LOGIN, payload: { id } })
    dispatch(updateLocation('/'))
  })
  .catch(err => console.log(err))
)

export const logout = () => (dispatch) => {
  localStorage.clear()
  dispatch({ type: LOGOUT })
  return axios('/auth/logout', { withCredentials: true })
  .then(() => dispatch(updateLocation('/')))
  .catch(err => console.log(err))
}
