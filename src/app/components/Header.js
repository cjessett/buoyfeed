import { h } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'
import { updateLocation, getPathname } from './../store/ducks/meta'
import { logout } from '../store/ducks/user'
import Link from './Link'

const { connect } = PreactRedux

const Header = ({ _updateLocation, _logout, isAuthenticated, pathname }) => {
  const goTo = path => () => _updateLocation(path)
  const activeClass = path => (path === pathname ? 'active' : '')
  return (
    <header className="Header">
      <nav>
        <Link className={`item ${activeClass('/')}`} href="/" onClick={goTo('/')}>
          <i className="material-icons">home</i>
        </Link>
        <Link className={`item ${activeClass('/favorites')}`} href="/favorites" onClick={goTo('/favorites')}>
          <i className="material-icons">star</i>
        </Link>
        {isAuthenticated ?
          <Link className="item" href="/logout" onClick={() => _logout()}>Logout</Link> :
          <span className="item" style={{ display: 'flex' }}>
            <Link className={`item ${activeClass('/login')}`} href="/login" onClick={goTo('/login')}>Login</Link>
            <Link className={`item ${activeClass('/signup')}`} href="/signup" onClick={goTo('/signup')}>Sign Up</Link>
          </span>}
      </nav>
    </header>
  )
}

export default connect(
  state => ({ pathname: getPathname(state), isAuthenticated: !!state.user.id }),
  { _updateLocation: updateLocation, _logout: logout }
)(Header)
