import { Router } from 'express'

export default (app) => {
  function signup(req, res) {
    const { username, password, passwordConf } = req.body
    const match = password === passwordConf
    if (!match || !username || !password || !passwordConf) return res.sendStatus(422)
    return app.createUser({ username, password })
    .then(({ id }) => {
      req.session.user = id
      res.send({ id })
    })
    .catch(() => res.status(403).send('Username is already taken.'))
  }

  function login(req, res) {
    const { username, password } = req.body
    if (!username || !password) return res.sendStatus(422)
    return app.authenticate({ username, password })
    .then(({ id }) => {
      req.session.user = id
      res.send({ id })
    })
    .catch(() => res.status(403).send('Bad credentials'))
  }

  function logout(req, res) {
    req.session.destroy(() => res.redirect('/'))
  }

  return Router()
    .post('/signup', signup)
    .post('/login', login)
    .get('/logout', logout)
}
