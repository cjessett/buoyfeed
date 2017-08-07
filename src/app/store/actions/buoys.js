import { getShouldFetchBuoys, getBuoys } from '../selectors/buoys'
import { getToken } from '../selectors/meta'

export const FETCH_BUOYS = 'api/FETCH_BUOYS'
export const FETCH_BUOYS_SUCCESS = 'api/FETCH_BUOYS_SUCCESS'
export const FETCH_BUOYS_ERROR = 'api/FETCH_BUOYS_ERROR'
export const INVALIDATE_FETCH_BUOYS = 'api/INVALIDATE_FETCH_BUOYS'
export const FAVORITE = 'FAVORITE'
export const FETCH_FAVORITES = 'FETCH_FAVORITES'

const checkStatus = (response) => {
  if (!response.ok) { // status in the range 200-299 or not
    return Promise.reject(new Error(response.statusText || 'Status not OK'))
  }
  return response
}

const parseJSON = response => response.json()

const startAction = type => ({ type })
const successAction = (type, json) => ({ type, payload: json })
const errorAction = (type, error) => ({ type, payload: error, error: true })

export const fetchBuoys = () => (dispatch, getState, fetchMethod) => {
  const token = getToken(getState())
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  dispatch(startAction(FETCH_BUOYS))
  return fetchMethod('/buoys', { headers })
  .then(checkStatus)
  .then(parseJSON)
  .then(({ buoys, favs }) => dispatch(successAction(FETCH_BUOYS_SUCCESS, { buoys, favs })))
  .catch(error => dispatch(errorAction(FETCH_BUOYS_ERROR, error)))
}

export const fetchFavorites = () => (dispatch, getState, fetchMethod) => {
  const token = getToken(getState())
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  dispatch(startAction(FETCH_FAVORITES))
  return fetchMethod('/favorites', { headers })
}

export const fetchBuoysIfNeeded = () => (dispatch, getState) => {
  const state = getState()
  return getShouldFetchBuoys(state) ? dispatch(fetchBuoys()) : Promise.resolve(getBuoys(state))
}

export const favorite = buoy => (dispatch, getState, fetchMethod) => {
  const { auth } = getState()
  if (!auth.isAuthenticated()) return auth.login()
  const method = getState().user.favorites.includes(buoy) ? 'delete' : 'post'
  const token = getToken(getState())
  const headers = {
    Authorization: token ? `Bearer ${token}` : '',
    Accept: 'application/json',
    'content-type': 'application/json',
  }
  dispatch(startAction(FAVORITE))
  return fetchMethod('/favorites', { method, body: JSON.stringify({ buoy }), headers })
  .then(checkStatus)
  .then(() => dispatch({ id: buoy, type: FAVORITE }))
  .catch(err => dispatch(errorAction(FAVORITE, err)))
}

export const fetchInitialState = query => dispatch => Promise.all([
  query.then(buoys => dispatch(successAction(FETCH_BUOYS_SUCCESS, { buoys }))),
])
