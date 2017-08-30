import axios from 'axios'
import { updateLocation } from './meta'

// actionTypes
const FETCH_BUOYS = 'api/FETCH_BUOYS'
const FETCH_BUOYS_ERROR = 'api/FETCH_BUOYS_ERROR'
const TOGGLE_FILTER = 'TOGGLE_FILTER'
export const FETCH_BUOYS_SUCCESS = 'api/FETCH_BUOYS_SUCCESS'
export const FAVORITE = 'FAVORITE'
export const FAVORITE_ROLLBACK = 'FAVORITE_ROLLBACK'

// selectors
export const getBuoys = state => state.buoys.collection
export const getFavorites = state => state.user.favorites
export const getHasFetchedBuoys = state => state.buoys.hasFetched
export const getShouldFetchBuoys = state => state.buoys.collection.length === 0

// actions
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

// reducer
export const initialState = {
  isFetching: false,
  hasFetched: false,
  hasError: false,
  error: null,
  collection: [],
  onlyFavs: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_BUOYS:
      return {
        ...state,
        isFetching: true,
        hasFetched: false,
        hasError: false,
        error: null,
      }
    case FETCH_BUOYS_ERROR:
      return {
        ...state,
        hasError: true,
        error: payload,
        hasFetched: true,
        isFetching: false,
      }
    case FETCH_BUOYS_SUCCESS:
      return {
        ...state,
        collection: payload.buoys,
        hasFetched: true,
        isFetching: false,
      }
    case TOGGLE_FILTER:
      return { ...state, onlyFavs: !state.onlyFavs }
    default:
      return state
  }
}
