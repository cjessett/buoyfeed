import { getShouldFetchBuoys, getBuoys } from './../selectors/buoys'

export const FETCH_BUOYS = 'api/FETCH_BUOYS'
export const FETCH_BUOYS_SUCCESS = 'api/FETCH_BUOYS_SUCCESS'
export const FETCH_BUOYS_ERROR = 'api/FETCH_BUOYS_ERROR'
export const INVALIDATE_FETCH_BUOYS = 'api/INVALIDATE_FETCH_BUOYS'
export const FAVORITE = 'FAVORITE'

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

export const fetchBuoys = query => (dispatch, _, fetchMethod) => {
  dispatch(startAction(FETCH_BUOYS))
  return query || fetchMethod('/buoys')
  .then(checkStatus)
  .then(parseJSON)
  .then(buoys => dispatch(successAction(FETCH_BUOYS_SUCCESS, buoys)))
  .catch(error => dispatch(errorAction(FETCH_BUOYS_ERROR, error)))
}

export const fetchBuoysIfNeeded = () => (dispatch, getState) => {
  const state = getState()
  return getShouldFetchBuoys(state) ? dispatch(fetchBuoys()) : Promise.resolve(getBuoys(state))
}

export const favorite = id => ({ id, type: FAVORITE })
