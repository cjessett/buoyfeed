import { h, render } from 'preact' // eslint-disable-line no-unused-vars
import 'preact/devtools'
import App from './components/App'
import createStore from './store/createStore'
import { fetchBuoysIfNeeded } from './store/ducks/buoys'
import { updateLocation, getUrl } from './store/ducks/meta'
import ensurePolyfills from './utils/ensurePolyfills'

const app = document.getElementById('app')

ensurePolyfills(() => {
  const store = createStore(window.__STATE__, window.fetch)

  window.addEventListener('popstate', (e) => {
    const url = window.location.pathname + window.location.search
    store.dispatch(updateLocation(url))
  }, { passive: true })

  store.subscribe(() => {
    const url = getUrl(store.getState())
    if (window.location.pathname + window.location.search !== url) {
      window.history.pushState({}, '', url)
    }
  })
  store.dispatch(updateLocation(window.location.pathname + window.location.search))
  store.dispatch(fetchBuoysIfNeeded())
  render(<App store={store} />, app, app.lastChild)
})
