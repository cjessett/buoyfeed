// actionTypes
const UPDATE_LOCATION = 'meta/UPDATE_LOCATION'
export const HIDE_TOGGLE = 'HIDE_TOGGLE'
export const SHOW_TOGGLE = 'SHOW_TOGGLE'

// selectors
export const updateLocation = url => ({ type: UPDATE_LOCATION, payload: { url } })
export const getUrl = state => state.meta.url
export const getPathname = state => state.meta.url.split('?')[0]


// reducers
export const initialState = {
  url: '/',
  toggleDisplay: 'initial',
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_LOCATION:
      return { ...state, ...payload }
    case HIDE_TOGGLE:
      return { ...state, toggleDisplay: 'none' }
    case SHOW_TOGGLE:
      return { ...state, toggleDisplay: 'initial' }
    default:
      return state
  }
}
