import { updateLocation } from './meta'
import mockStorage from '../../modules/localStorage'

const localStorage = mockStorage().localStorage
const credentials = 'include'
const headers = { Accept: 'application/json', 'content-type': 'application/json' }

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const login = ({ username, password }) => (dispatch, getState, fetchMethod) => {
  const body = JSON.stringify({ username, password })
  return fetchMethod('/auth/login', { method: 'post', body, headers, credentials })
  .then(response => response.json())
  .then(({ id }) => {
    dispatch({ type: LOGIN, payload: { id } })
    dispatch(updateLocation({ url: '/' }))
  })
  .catch(error => console.log(error))
}

export const signup = ({ username, password, passwordConf }) => (dispatch, _, fetchMethod) => {
  const body = JSON.stringify({ username, password, passwordConf })
  return fetchMethod('/auth/signup', { method: 'post', body, headers, credentials: 'include' })
  .then(response => response.json())
  .then(({ id }) => {
    dispatch({ type: LOGIN, payload: { id } })
    dispatch(updateLocation({ url: '/' }))
  })
  .catch(err => console.log(err))
}

export const logout = () => (dispatch, _, fetchMethod) => {
  localStorage.clear()
  dispatch({ type: LOGOUT })
  return fetchMethod('/auth/logout', { credentials })
  .then(() => dispatch(updateLocation({ url: '/' })))
  .catch(err => console.log(err))
}
