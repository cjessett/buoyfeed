import { h, Component } from 'preact'
import p from 'preact-redux'

import { signup } from '../store/ducks/user'

const { connect } = p

class Signup extends Component {
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
    const field = id => document.getElementById(id).value.trim()
    const { username = field('username'), password = field('password'), passwordConf = field('passwordConf') } = this.state
    if (!username || !password) return this.setState({ err: 'All fields required.' })
    if (password !== passwordConf) return this.setState({ err: 'Passwords must match' })
    return this.props.signup(this.state)
      .then(() => this.setState({ err: '' }))
  }

  render({ error }, { err }) {
    return (
      <div className="Auth">
        <form className="mx-auto" onSubmit={this.handleSubmit}>
          <h3>Sign up</h3>
          <div>
            <label htmlFor="username">Username</label><br />
            <input required id="username" onInput={this.handleChange} />
          </div>
          <div>
            <label htmlFor="password">Password</label><br />
            <input required id="password" type="password" onInput={this.handleChange} />
          </div>
          <div>
            <label htmlFor="passwordConf">Confirm Password</label><br />
            <input required id="passwordConf" type="password" onInput={this.handleChange} />
          </div>
          <button type="submit">Sign up</button>
          <div className="error">{err || error}</div>
        </form>
      </div>
    )
  }
}

export default connect(state => ({ error: state.user.error.signup }), { signup })(Signup)
