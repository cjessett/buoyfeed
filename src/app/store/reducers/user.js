import { FETCH_BUOYS_SUCCESS, FAVORITE, FAVORITE_ROLLBACK } from './../actions/buoys'
import { LOGIN, LOGOUT } from '../actions/auth'

export const initialState = {
  favorites: [],
  id: '',
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FAVORITE:
    case FAVORITE_ROLLBACK:
      return {
        ...state,
        favorites: state.favorites.find(i => i === payload.buoy) ?
          state.favorites.filter(i => i !== payload.buoy) :
          [...state.favorites, payload.buoy],
      }
    case FETCH_BUOYS_SUCCESS:
      return {
        ...state,
        favorites: payload.favs || state.favorites,
      }
    case LOGIN:
      return { ...state, id: payload.id }
    case LOGOUT:
      return initialState
    default:
      return state
  }
}
