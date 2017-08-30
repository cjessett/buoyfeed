import axios from 'axios'
import { getShouldFetchBuoys, getBuoys } from '../selectors/buoys'
import { updateLocation } from './meta'

export const FETCH_BUOYS = 'api/FETCH_BUOYS'
export const FETCH_BUOYS_SUCCESS = 'api/FETCH_BUOYS_SUCCESS'
export const FETCH_BUOYS_ERROR = 'api/FETCH_BUOYS_ERROR'
export const FAVORITE = 'FAVORITE'
export const TOGGLE_FILTER = 'TOGGLE_FILTER'
export const FAVORITE_ROLLBACK = 'FAVORITE_ROLLBACK'

const startAction = type => ({ type })
const successAction = (type, json) => ({ type, payload: json })
const errorAction = (type, error) => ({ type, payload: error, error: true })

export const fetchBuoys = () => (dispatch) => {
  dispatch(startAction(FETCH_BUOYS))
  return axios('/buoys')
  .then(res => res.data)
  .then(({ buoys, favs }) => dispatch(successAction(FETCH_BUOYS_SUCCESS, { buoys, favs })))
  .catch(error => dispatch(errorAction(FETCH_BUOYS_ERROR, error)))
}

export const fetchBuoysIfNeeded = () => (dispatch, getState) => {
  const state = getState()
  return getShouldFetchBuoys(state) ? dispatch(fetchBuoys()) : Promise.resolve(getBuoys(state))
}

export const fav = (buoy, effect) => ({
  type: FAVORITE,
  payload: { buoy },
  meta: {
    offline: {
      effect,
      commit: { type: 'COMMITTING' },
      rollback: { type: FAVORITE_ROLLBACK, meta: { buoy } },
    },
  },
})

export const offlineFav = buoy => (dispatch, getState) => {
  const { user: { favorites, id } } = getState()
  if (!id) return dispatch(updateLocation('/login'))
  const method = favorites.includes(buoy) ? 'delete' : 'post'
  const effect = { method, data: { buoy }, withCredentials: true, url: '/favorites' }
  return dispatch(fav(buoy, effect))
}

export const fetchInitialState = query => dispatch => Promise.all([
  query.then(buoys => dispatch(successAction(FETCH_BUOYS_SUCCESS, { buoys }))),
])

export const toggleFilter = () => ({ type: TOGGLE_FILTER })
