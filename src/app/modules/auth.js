import auth0 from 'auth0-js'
import history from './history'
import mockStorage from './localStorage'

const localStorage = mockStorage().localStorage

export default function () {
  const auth = new auth0.WebAuth({
    domain: 'process.env.AUTH0_DOMAIN',
    clientID: 'process.env.CLIENT_ID',
    redirectUri: 'process.env.REDIRECT_URI',
    audience: 'https://process.env.AUTH0_DOMAIN/userinfo',
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
    },

    logout() {
      // Clear access token and ID token from local storage
      localStorage.clear()
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
