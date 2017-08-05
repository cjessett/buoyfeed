import createHistory from 'history/createBrowserHistory'

const history = typeof window === 'undefined' ? {} : createHistory({ forceRefresh: true })

export default history
