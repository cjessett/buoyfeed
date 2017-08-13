import { FETCH_BUOYS, FETCH_BUOYS_SUCCESS, FETCH_BUOYS_ERROR, TOGGLE_FILTER } from './../actions/buoys'

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
