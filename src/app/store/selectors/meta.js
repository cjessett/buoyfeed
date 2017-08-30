export const getUrl = state => state.meta.url
export const getPathname = state => state.meta.url.split('?')[0]
