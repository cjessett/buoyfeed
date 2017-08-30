import { UPDATE_LOCATION, HIDE_TOGGLE, SHOW_TOGGLE } from './../actions/meta'

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
