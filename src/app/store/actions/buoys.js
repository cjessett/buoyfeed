import { getShouldFetchBuoys, getBuoys } from '../selectors/buoys'
import { getToken } from '../selectors/meta'

export const FETCH_BUOYS = 'api/FETCH_BUOYS'
export const FETCH_BUOYS_SUCCESS = 'api/FETCH_BUOYS_SUCCESS'
export const FETCH_BUOYS_ERROR = 'api/FETCH_BUOYS_ERROR'
export const INVALIDATE_FETCH_BUOYS = 'api/INVALIDATE_FETCH_BUOYS'
export const FAVORITE = 'FAVORITE'
export const FETCH_FAVORITES = 'FETCH_FAVORITES'
export const TOGGLE_FILTER = 'TOGGLE_FILTER'
export const FAVORITE_ROLLBACK = 'FAVORITE_ROLLBACK'

const buildHeaders = token => (
  {
    Authorization: token ? `Bearer ${token}` : '',
    Accept: 'application/json',
    'content-type': 'application/json',
  }
)

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

export const fetchBuoysIfNeeded = () => (dispatch, getState) => {
  const state = getState()
  return getShouldFetchBuoys(state) ? dispatch(fetchBuoys()) : Promise.resolve(getBuoys(state))
}

export const fav = (buoy, method, headers) => ({
  type: FAVORITE,
  payload: { buoy },
  meta: {
    offline: {
      effect: { method, headers, url: '/favorites', body: JSON.stringify({ buoy }) },
      commit: { type: 'COMMITTING' },
      rollback: { type: FAVORITE_ROLLBACK, meta: { buoy } },
    },
  },
})

export const offlineFav = buoy => (dispatch, getState) => {
  const { auth, user: { favorites } } = getState()
  if (!auth.isAuthenticated()) return auth.login()
  const method = favorites.includes(buoy) ? 'DELETE' : 'POST'
  const headers = buildHeaders(getToken(getState()))
  return dispatch(fav(buoy, method, headers))
}

export const fetchInitialState = query => dispatch => Promise.all([
  query.then(buoys => dispatch(successAction(FETCH_BUOYS_SUCCESS, { buoys }))),
])

export const toggleFilter = () => dispatch => dispatch({ type: TOGGLE_FILTER })
