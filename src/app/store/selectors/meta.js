// todo: optimize selectors
// import { createSelector } from 'reselect'
export const getUrl = state => state.meta.url
export const getPathname = state => state.meta.url.split('?')[0]
export const getHash = state => state.meta.hash
export const getToken = state => state.meta.token
