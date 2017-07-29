import { h, render } from 'preact' // eslint-disable-line no-unused-vars
import 'preact/devtools'
import App from './components/App'
import createStore from './store/createStore'
import { fetchBuoysIfNeeded } from './store/actions/buoys'
import { updateLocation } from './store/actions/meta'
import { getUrl, getHash } from './store/selectors/meta'
import ensurePolyfills from './utils/ensurePolyfills'

const app = document.getElementById('app')

ensurePolyfills(() => {
  const store = createStore(window.__STATE__, window.fetch)
  window.addEventListener('popstate', (e) => {
    const url = window.location.pathname + window.location.search
    const hash = window.location.hash
    store.dispatch(updateLocation({ url, hash }))
  })
  store.subscribe(() => {
    const url = getUrl(store.getState())
    const hash = getHash(store.getState())
    if (window.location.pathname + window.location.search !== url) {
      window.history.pushState({}, '', url)
    }
  })
  store.dispatch(updateLocation({
    url: window.location.pathname + window.location.search,
    hash: window.location.hash,
  }))
  store.dispatch(fetchBuoysIfNeeded())
  render(<App store={store} />, app, app.lastChild)
})
