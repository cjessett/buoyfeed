import { Router } from 'express'

export default (app) => {
  function addFavorite(req, res) {
    const { user: id } = req.session
    app.addFavorite(id, req.body.buoy)
    .then(() => res.sendStatus(200))
    .catch((err) => {
      res.status(500).send(err) // handle errors better
    })
  }

  function removeFavorite(req, res) {
    const { user: id } = req.session
    app.removeFavorite(id, req.body.buoy)
    .then(() => res.sendStatus(200))
    .catch((err) => {
      res.status(500).send(err) // handle errors better
    })
  }

  return Router()
    .post('/', addFavorite)
    .delete('/', removeFavorite)
}
