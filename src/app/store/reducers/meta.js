import { UPDATE_LOCATION, SET_TOKEN, REMOVE_TOKEN } from './../actions/meta'

export const initialState = {
  url: '/',
  hash: '',
  token: '',
}

export default (state = initialState, { type, payload, token }) => {
  switch (type) {
    case SET_TOKEN:
      return { ...state, token }
    case REMOVE_TOKEN:
      return { ...state, token: '' }
    case UPDATE_LOCATION:
      return { ...state, ...payload }
    default:
      return state
  }
}
