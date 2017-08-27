import { Router } from 'express'

export default (app) => {
  function signup(req, res) {
    const { username, password, passwordConf } = req.body
    const match = password === passwordConf
    if (!match || !username || !password || !passwordConf) res.sendStatus(400)
    const creds = { username, password }
    return app.createUser(creds)
    .then(({ id }) => {
      req.session.user = id
      res.send({ id })
    })
    .catch((err) => {
      console.log(err) // handle errors
      res.status(400).send('bad creds')
    })
  }

  function login(req, res) {
    const { username, password } = req.body
    if (!username || !password) res.sendStatus(400)
    app.authenticate({ username, password })
    .then(({ id }) => {
      req.session.user = id
      console.log('sesh', req.session)
      res.send({ id })
    })
    .catch((err) => {
      console.log(err) // check credentials don't match
      res.status(400).send('bad credentials')
    })
  }

  function logout(req, res) {
    console.log('delete', req.session)
    req.session.destroy(() => res.redirect('/'))
  }

  return Router()
    .post('/signup', signup)
    .post('/login', login)
    .get('/logout', logout)
}
