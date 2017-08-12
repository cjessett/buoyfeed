import { FETCH_BUOYS_SUCCESS, FAVORITE, FAVORITE_ROLLBACK } from './../actions/buoys'

export const initialState = {
  favorites: [],
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
    default:
      return state
  }
}
