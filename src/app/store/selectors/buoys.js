export const getBuoys = state => state.buoys.collection
export const getFavorites = state => state.user.favorites
export const getHasFetchedBuoys = state => state.buoys.hasFetched
export const getShouldFetchBuoys = state => state.buoys.collection.length === 0
