import axios from 'axios'
import { updateLocation } from './meta'
import { FETCH_BUOYS_SUCCESS, FAVORITE, FAVORITE_ROLLBACK } from './buoys'
import mockStorage from '../../modules/localStorage'

const localStorage = mockStorage().localStorage

const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'

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

// selectors
export const getFavs = state => state.user.favorites

// reducer
export const initialState = {
  favorites: [],
  id: '',
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
      return { ...state, id: payload.id }
    case LOGOUT:
      return initialState
    default:
      return state
  }
}
