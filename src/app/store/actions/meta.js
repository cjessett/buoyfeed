import { getUrl, getHash } from './../selectors/meta'

export const UPDATE_LOCATION = 'meta/UPDATE_LOCATION'
export const SET_TOKEN = 'meta/SET_TOKEN'
export const REMOVE_TOKEN = 'meta/REMOVE_TOKEN'

export const setToken = token => ({ token, type: SET_TOKEN })
export const removeToken = () => ({ type: REMOVE_TOKEN })
export const updateLocation = ({ url, hash }) => (dispatch, getState) => {
  if (url === getUrl(getState()) && getHash(getState())) {
    return
  }
  dispatch({
    type: UPDATE_LOCATION,
    payload: {
      url,
      hash,
    },
  })
}
