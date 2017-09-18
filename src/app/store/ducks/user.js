import axios from 'axios'
import { updateLocation } from './meta'
import { FETCH_BUOYS_SUCCESS, FAVORITE, FAVORITE_ROLLBACK } from './buoys'
import mockStorage from '../../modules/localStorage'

const { localStorage } = mockStorage()

const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const ERROR = 'auth/ERROR'

export const login = ({ username, password }) => dispatch => (
  axios.post('/auth/login', { username, password })
  .then(({ data: { id } }) => {
    dispatch({ type: LOGIN, payload: { id } })
    dispatch(updateLocation('/'))
  })
  .catch((err) => {
    const msg = err.response ? err.response.data : 'Something went wrong'
    dispatch({ type: ERROR, payload: { login: msg } })
  })
)

export const signup = ({ username, password, passwordConf }) => dispatch => (
  axios.post('/auth/signup', { username, password, passwordConf })
  .then(({ data: { id } }) => {
    dispatch({ type: LOGIN, payload: { id } })
    dispatch(updateLocation('/'))
  })
  .catch((err) => {
    const msg = err.response ? err.response.data : 'Something went wrong'
    dispatch({ type: ERROR, payload: { signup: msg } })
  })
)

export const logout = () => (dispatch) => {
  localStorage.clear()
  dispatch({ type: LOGOUT })
  return axios('/auth/logout', { withCredentials: true })
  .then(() => dispatch(updateLocation('/')))
  .catch((err) => {
    const msg = err.response ? err.response.data : 'Something went wrong'
    dispatch({ type: ERROR, payload: { logout: msg } })
  })
}

// selectors
export const getFavs = state => state.user.favorites

// reducer
export const initialState = {
  favorites: [],
  id: '',
  error: { login: '', signup: '', logout: '' },
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FAVORITE:
    case FAVORITE_ROLLBACK:
      return {
        ...state,
        favorites: state.favorites.find(i => i === payload.buoy) ?
          state.favorites.filter(i => i !== payload.buoy) :
          [...state.favorites, payload.buoy],
      }
    case FETCH_BUOYS_SUCCESS:
      return {
        ...state,
        favorites: payload.favs || state.favorites,
      }
    case LOGIN:
      return { ...state, id: payload.id, error: '' }
    case LOGOUT:
      return initialState
    case ERROR:
      return { ...state, error: { ...state.error, ...payload } }
    default:
      return state
  }
}
