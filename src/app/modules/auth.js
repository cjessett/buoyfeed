import auth0 from 'auth0-js'
import history from './history'
import mockStorage from './localStorage'

const localStorage = mockStorage().localStorage

export default function () {
  // this.handleAuthentication = this.handleAuthentication.bind(this)
  // this.getProfile = this.getProfile.bind(this)
  const auth = new auth0.WebAuth({
    domain: 'cjessett.auth0.com',
    clientID: 'K4rtV9xGOOgcBoqYtq7P35351ygdZTei',
    redirectUri: 'process.env.REDIRECT_URI',
    audience: 'https://cjessett.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid',
  })
  return {
    login() {
      auth.authorize()
    },

    handleAuthentication() {
      return new Promise((resolve, reject) => {
        auth.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult)
            resolve(authResult)
          } else if (err) {
            console.log(err)
            reject(err)
          }
        })
      })
    },

    setSession(authResult) {
      // Set the time that the access token will expire at
      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
      localStorage.setItem('access_token', authResult.accessToken)
      localStorage.setItem('id_token', authResult.idToken)
      localStorage.setItem('expires_at', expiresAt)
      // navigate to the home route
      // history.replace('/')
    },

    logout() {
      // Clear access token and ID token from local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('id_token')
      localStorage.removeItem('expires_at')
      // navigate to the home route
      history.replace('/')
    },

    isAuthenticated() {
      // Check whether the current time is past the access token's expiry time
      const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
      return new Date().getTime() < expiresAt
    },

    getProfile(cb) {
      const accessToken = localStorage.getItem('access_token')
      auth.client.userInfo(accessToken, (err, profile) => {
        if (err) return cb(err)
        return cb(null, profile)
      })
    },
  }
}
