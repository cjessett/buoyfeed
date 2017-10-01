const scrollTo = (x, y) => {
  try {
    return window.scrollTo(x, y) // eslint-disable-line
  } catch (err) {
    return undefined
  }
}

// actionTypes
const UPDATE_LOCATION = 'meta/UPDATE_LOCATION'

// selectors
export const getUrl = state => state.meta.url
export const getPathname = state => state.meta.url.split('?')[0]
export const updateLocation = url => (dispatch, getState) => {
  if (getPathname(getState()) === url) scrollTo(0, 0)
  dispatch({ type: UPDATE_LOCATION, payload: { url } })
}

// reducers
export const initialState = {
  url: '/',
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_LOCATION:
      return { ...state, ...payload }
    default:
      return state
  }
}
