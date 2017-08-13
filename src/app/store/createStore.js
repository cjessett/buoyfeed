import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { offline } from 'redux-offline'
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction'
import defaultConfig from 'redux-offline/lib/defaults'
import persistStore from 'redux-offline/lib/defaults/persist'

import rootReducer from './reducers/rootReducer'
import IS_CLIENT from '../utils/isClient'

// we pass fetch so that we can use global on window, node-fetch on server
export default (initialState, fetchMethod) => {
  const config = Object.assign({}, defaultConfig, {
    persist: (store) => { if (typeof self === 'object') persistStore(store) },
  })
  const enhancer = compose(
      applyMiddleware(thunk.withExtraArgument(fetchMethod)),
      IS_CLIENT && window.__REDUX_DEVTOOLS_EXTENSION__ ? devToolsEnhancer() : f => f,
      offline(config)
  )
  return createStore(rootReducer, initialState, enhancer)
}
