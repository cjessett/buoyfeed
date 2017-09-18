import { h } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux' // introduces 2.9kb on gzipped bundle, todo: barf, fix
import { updateLocation, getPathname } from '../store/ducks/meta'
import Header from './Header'
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import FourOhFour from './FourOhFour'
// import history from '../modules/history'

const { Provider, connect } = PreactRedux

const mapStateToProps = state => ({ pathname: getPathname(state) })

/* eslint-disable */
const Content = connect(mapStateToProps, { updateLocation })((props) => { // todo: make routing more robust
  if (props.pathname === '/') return <Home />
  else if (props.pathname === '/signup') return <Signup />
  else if (props.pathname === '/login') return <Login />
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
