import { h } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'
import { updateLocation } from './../store/actions/meta'
import Link from './Link'

const { connect } = PreactRedux

const Header = ({ _updateLocation, auth }) => (
  <header className="Header">
    <h1>
      <Link className="item" href="/" onClick={() => _updateLocation('/')}>Buoy Feed</Link>
    </h1>
    <nav>
      <Link className="item" href="/" onClick={() => _updateLocation('/')}>Home</Link>
      {auth.isAuthenticated() &&
        <Link className="item" href="/profile" onClick={() => _updateLocation('/profile')}>
          Profile
        </Link>}
      {auth.isAuthenticated() ?
        <Link className="item" href="#" onClick={() => auth.logout()}>Logout</Link> :
        <Link className="item" href="#" onClick={() => auth.login()}>Login</Link>
      }
    </nav>
  </header>
)

export default connect(
  state => ({ meta: state.meta, auth: state.auth }),
  dispatch => ({ _updateLocation: url => dispatch(updateLocation({ url })) })
)(Header)
