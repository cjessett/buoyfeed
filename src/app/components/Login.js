import { h, Component } from 'preact'
import p from 'preact-redux'

import { login } from '../store/ducks/user'

const { connect } = p

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = { err: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange({ target: { id, value } }) {
    this.setState({ [id]: value.trim() })
  }

  handleSubmit(e) {
    e.preventDefault()
    // hack for chrome autocomplete bug
    const field = id => document.getElementById(id).value.trim()
    const { username = field('username'), password = field('password') } = this.state
    if (!username || !password) return this.setState({ err: 'All fields required.' })
    return this.props.login({ username, password })
      .then(() => this.setState({ err: '' }))
  }

  render({ error }, { err }) {
    return (
      <div className="Auth">
        <form className="mx-auto" onSubmit={this.handleSubmit}>
          <h3>Log in</h3>
          <div class="error">{err || error}</div>
          <div>
            <label htmlFor="username">Username</label><br />
            <input required id="username" onInput={this.handleChange} />
          </div>
          <div>
            <label htmlFor="password">Password</label><br />
            <input required id="password" type="password" onInput={this.handleChange} />
          </div>
          <button type="submit">Log in</button>
        </form>
      </div>
    )
  }
}

export default connect(state => ({ error: state.user.error.login }), { login })(Login)
