import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { offline } from 'redux-offline'
import axios from 'axios'
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction'
import defaultConfig from 'redux-offline/lib/defaults'
import persistStore from 'redux-offline/lib/defaults/persist'

import rootReducer from './ducks'
import IS_CLIENT from '../utils/isClient'

export default () => {
  const config = Object.assign({}, defaultConfig, {
    effect: effectConfig => axios(effectConfig),
    persist: (store) => { if (typeof self === 'object') persistStore(store, { blacklist: ['meta', 'buoys'] }) },
  })
  const enhancer = compose(
      applyMiddleware(thunk),
      IS_CLIENT ? devToolsEnhancer() : f => f,
      offline(config)
  )
  return createStore(rootReducer, enhancer)
}
