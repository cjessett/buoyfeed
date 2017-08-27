import { h, Component } from 'preact'
import p from 'preact-redux'

import { login, signup } from '../store/actions/auth'

const { connect } = p

class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = { mode: 'login', username: '', password: '', passwordConf: '', err: false }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    // hack for autofill bug. maybe preact?
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    this.setState({ username, password })
  }

  handleToggle(e) {
    e.preventDefault()
    this.setState({ mode: e.target.id })
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value })
  }

  handleSubmit(e) {
    e.preventDefault()
    return this.state.mode === 'login' ?
      this.props.login(this.state) :
      this.props.signup(this.state)
  }

  render(_, { mode }) {
    const activeStyles = bool => ({ textDecoration: bool ? 'underline' : 'none' })
    return (
      <div className="Auth">
        <div className="flex mx-auto">
          <h4 className="mode left" id="signup" onClick={this.handleToggle}>Signup</h4>
          <h4 className="mode right" id="login" onClick={this.handleToggle}>Login</h4>
        </div>
        <form className="mx-auto" onSubmit={e => this.handleSubmit(e)}>
          <h3>{mode === 'signup' ? 'Sign up' : 'Log in'}</h3>
          <label htmlFor="username">username</label>
          <input required id="username" name="username" onChange={this.handleChange} />

          <label htmlFor="password">password</label>
          <input required id="password" name="password" type="password" onInput={this.handleChange} />

          {mode === 'signup' &&
            <span><label>confirm password</label>
            <input required id="passwordConf" name="passwordConf" type="password" onInput={this.handleChange} /></span>}

          <button type="submit">
            {mode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
        </form>
      </div>
    )
  }
}

export default connect(null, { login, signup })(Auth)
