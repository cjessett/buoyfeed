import { FETCH_BUOYS, FETCH_BUOYS_SUCCESS, FETCH_BUOYS_ERROR, INVALIDATE_FETCH_BUOYS, FAVORITE } from './../actions/buoys'

export const initialState = {
  didInvalidate: false,
  isFetching: false,
  hasFetched: false,
  hasError: false,
  error: null,
  collection: [],
}

export default (state = initialState, { type, payload, id }) => {
  switch (type) {
    case FETCH_BUOYS:
      return {
        ...state,
        didInvalidate: false,
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
        didInvalidate: true,
      }
    case FETCH_BUOYS_SUCCESS:
      return {
        ...state,
        collection: payload,
        hasFetched: true,
        isFetching: false,
        didInvalidate: false,
      }
    case INVALIDATE_FETCH_BUOYS:
      return { ...state, didInvalidate: true }
    case FAVORITE:
      return {
        ...state,
        collection: state.collection.map(b => (
          b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
        )),
      }
    default:
      return state
  }
}
