import { h } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'
import { getPathname } from '../store/ducks/meta'
import { showFavorites, hideFavorites } from '../store/ducks/buoys'
import Header from './Header'
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import FourOhFour from './FourOhFour'

const { Provider, connect } = PreactRedux

const mapStateToProps = state => ({ pathname: getPathname(state) })

const Content = connect(mapStateToProps, { showFavorites, hideFavorites })(({ pathname }) => {
  if (pathname === '/') return <Home />
  else if (pathname === '/favorites') return <Home favs />
  else if (pathname === '/login') return <Login />
  else if (pathname === '/signup') return <Signup />
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
