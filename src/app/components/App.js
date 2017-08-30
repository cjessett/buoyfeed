import { h } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux' // introduces 2.9kb on gzipped bundle, todo: barf, fix
import { updateLocation } from '../store/ducks/meta'
import { getPathname } from './../store/ducks/meta'
import Header from './Header'
import Home from './Home'
import Auth from './Auth'
import FourOhFour from './FourOhFour'
// import history from '../modules/history'

const { Provider, connect } = PreactRedux

/* eslint-disable */
const Content = connect(
  state => ({ pathname: getPathname(state) }),
  { updateLocation }
)((props) => { // todo: make routing more robust
  if (props.pathname === '/') return <Home />
  else if (/signup|login/.test(props.pathname)) return <Auth />
  return <FourOhFour />
})

export default ({ store }) => (
  <Provider store={store}>
    <div>
      <Header />
      <Content />
    </div>
  </Provider>
)
