import { h } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux' // introduces 2.9kb on gzipped bundle, todo: barf, fix
import { setToken, removeToken } from '../store/actions/meta'
import { getPathname, getHash } from './../store/selectors/meta'
import Header from './Header'
import Home from './Home'
import Profile from './Profile'
import FourOhFour from './FourOhFour'
import Auth from '../modules/auth'
import history from '../modules/history'

const { Provider, connect } = PreactRedux
const auth = new Auth({ setToken, removeToken })

const Content = connect(
  state => ({
    pathname: getPathname(state),
    hash: getHash(state)
  }),
  { setToken }
)((props) => { // todo: make routing more robust
  if (props.pathname === '/profile') {
    return auth.isAuthenticated() ? <Profile auth={auth} /> : <Home />
  } else if (props.pathname === '/') {
    if (/access_token|id_token|error/.test(props.hash)) {
      auth.handleAuthentication()
      .then(({ accessToken }) => props.setToken(accessToken))
      .then(() => history.push('/', { hash: '' }))
    }
    return <Home />
  } else {
    return <FourOhFour />
  }
})

export default ({ store }) => (
  <Provider store={store}>
    <div>
      <Header auth={auth} />
      <Content />
    </div>
  </Provider>
)
