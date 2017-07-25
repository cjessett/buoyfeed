import { FETCH_POSTS, FETCH_BUOYS_SUCCESS, FETCH_POSTS_ERROR, INVALIDATE_FETCH_POSTS, FAVORITE } from './../actions/buoys'

export const initialState = {
  didInvalidate: false,
  isFetching: false,
  hasFetched: false,
  hasError: false,
  error: null,
  collection: [] // do not mutate these
}

export default (state = initialState, { type, payload, meta, id }) => {
  switch (type) {
    case FETCH_POSTS:
     return {
       ...state,
       didInvalidate: false,
       isFetching: true,
       hasFetched: false,
       hasError: false,
       error: null,
     }
    case FETCH_POSTS_ERROR:
    case FETCH_BUOYS_SUCCESS:
      return { ...state, collection: payload }
    case INVALIDATE_FETCH_POSTS:
      return state
    case FAVORITE:
      return {
        ...state,
        collection: state.collection.map(b => (
          b['_id'] === id ? { ...b, isFavorite: !b.isFavorite } : b
        )),
      }
    default:
      return state
  }
}
