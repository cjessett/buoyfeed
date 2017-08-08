import { UPDATE_LOCATION, SET_TOKEN, REMOVE_TOKEN, HIDE_TOGGLE, SHOW_TOGGLE } from './../actions/meta'

export const initialState = {
  url: '/',
  hash: '',
  token: '',
  toggleDisplay: 'initial',
}

export default (state = initialState, { type, payload, token }) => {
  switch (type) {
    case SET_TOKEN:
      return { ...state, token }
    case REMOVE_TOKEN:
      return { ...state, token: '' }
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
