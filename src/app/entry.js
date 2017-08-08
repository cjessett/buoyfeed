import { h, render } from 'preact' // eslint-disable-line no-unused-vars
import 'preact/devtools'
import App from './components/App'
import createStore from './store/createStore'
import { fetchBuoysIfNeeded } from './store/actions/buoys'
import { updateLocation, HIDE_TOGGLE, SHOW_TOGGLE } from './store/actions/meta'
import { getUrl, getHash } from './store/selectors/meta'
import ensurePolyfills from './utils/ensurePolyfills'

const app = document.getElementById('app')

ensurePolyfills(() => {
  let ts
  const el = document.getElementById('toggle')
  const store = createStore(window.__STATE__, window.fetch)

  window.addEventListener('popstate', (e) => {
    const url = window.location.pathname + window.location.search
    const hash = window.location.hash
    store.dispatch(updateLocation({ url, hash }))
  })
  document.addEventListener('touchstart', (e) => {
    ts = e.touches[0].clientY
  }, { passive: true })
  document.addEventListener('touchmove', (e) => {
    const te = e.changedTouches[0].clientY
    if (ts > te) {
      store.dispatch({ type: HIDE_TOGGLE })
    } else {
      store.dispatch({ type: SHOW_TOGGLE })
    }
  }, { passive: true })

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
