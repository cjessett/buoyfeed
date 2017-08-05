import { h, Component } from 'preact' // eslint-disable-line no-unused-vars

/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
export default class Profile extends Component {
  constructor() {
    super()
    this.state = { profile: {}, err: '' }
  }

  componentDidMount() {
    const { getProfile, login } = this.props.auth
    getProfile((err, profile) => {
      if (err) {
        return this.setState({ err })
      }
      return this.setState({ profile })
    })
  }

  render(props, state) {
    const { profile } = state
    return (
      <div>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    )
  }
}
