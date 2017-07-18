import { FETCH_POSTS, FETCH_BUOYS_SUCCESS, FETCH_POSTS_ERROR, INVALIDATE_FETCH_POSTS } from './../actions/posts'

export const initialState = {
  didInvalidate: false,
  isFetching: false,
  hasFetched: false,
  hasError: false,
  error: null,
  collection: [] // do not mutate these
}

export default (state = initialState, { type, payload, meta }) => {
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
    default:
      return state
  }
}
