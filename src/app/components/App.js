import { h } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux' // introduces 2.9kb on gzipped bundle, todo: barf, fix
import { setToken, updateLocation } from '../store/actions/meta'
import { getPathname, getHash } from './../store/selectors/meta'
import Header from './Header'
import Home from './Home'
import FourOhFour from './FourOhFour'
import history from '../modules/history'

const { Provider, connect } = PreactRedux

const Content = connect(
  state => ({
    pathname: getPathname(state),
    hash: getHash(state),
    auth: state.auth,
  }),
  { setToken, updateLocation }
)((props) => { // todo: make routing more robust
  if (props.pathname === '/') {
    if (/access_token|id_token|error/.test(props.hash)) {
      props.auth.handleAuthentication()
      .then(({ idToken }) => props.setToken(idToken))
      .then(() => history.replace('/'))
    }
    return <Home />
  } else {
    return <FourOhFour />
  }
})

export default ({ store }) => (
  <Provider store={store}>
    <div>
      <Header />
      <Content />
    </div>
  </Provider>
)
