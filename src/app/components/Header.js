import { h } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'
import { updateLocation } from './../store/ducks/meta'
import { logout } from '../store/ducks/user'
import Link from './Link'

const { connect } = PreactRedux

const Header = ({ _updateLocation, _logout, isAuthenticated }) => (
  <header className="Header">
    <h1>
      <Link className="item" href="/" onClick={() => _updateLocation('/')}>Buoy Feed</Link>
    </h1>
    <nav>
    {isAuthenticated ?
      <Link className="item" href="/logout" onClick={() => _logout()}>Logout</Link> :
      <span>
        <Link className="item" href="/login" onClick={() => _updateLocation('/login')}>Login</Link>
        <Link className="item" href="/login" onClick={() => _updateLocation('/signup')}>Sign Up</Link>
      </span>}
    </nav>
  </header>
)

export default connect(
  state => ({ meta: state.meta, isAuthenticated: !!state.user.id }),
  { _updateLocation: updateLocation, _logout: logout }
)(Header)
