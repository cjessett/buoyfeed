import { FETCH_BUOYS_SUCCESS, FAVORITE } from './../actions/buoys'

export const initialState = {
  favorites: [],
}

export default (state = initialState, { type, payload, id }) => {
  switch (type) {
    case FAVORITE:
      return {
        ...state,
        favorites: state.favorites.find(i => i === id) ?
          state.favorites.filter(i => i !== id) : [...state.favorites, id],
      }
    case FETCH_BUOYS_SUCCESS:
      return {
        ...state,
        favorites: payload.favs,
      }
    default:
      return state
  }
}
