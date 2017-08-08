export const UPDATE_LOCATION = 'meta/UPDATE_LOCATION'
export const SET_TOKEN = 'meta/SET_TOKEN'
export const REMOVE_TOKEN = 'meta/REMOVE_TOKEN'
export const HIDE_TOGGLE = 'HIDE_TOGGLE'
export const SHOW_TOGGLE = 'SHOW_TOGGLE'

export const setToken = token => ({ token, type: SET_TOKEN })
export const removeToken = () => ({ type: REMOVE_TOKEN })
export const updateLocation = ({ url, hash }) => ({
  type: UPDATE_LOCATION,
  payload: {
    url,
    hash,
  },
})
