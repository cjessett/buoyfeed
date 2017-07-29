import { h, Component } from 'preact' // eslint-disable-line no-unused-vars

/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
export default class Profile extends Component {
  componentWillMount() {
    this.setState({ profile: {} })
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile })
      })
    } else {
      this.setState({ profile: userProfile })
    }
  }

  render(props, state) {
    const { profile } = state
    return (
      <div>
        <h1>{profile.name}</h1>
        <img src={profile.picture} alt="profile" />
        <div><h3>{profile.nickname}</h3></div>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    )
  }
}
