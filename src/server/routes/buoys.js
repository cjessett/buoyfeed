import { Router } from 'express'

export default (app) => {
  function getBuoys(req, res) {
    const { user } = req.session
    console.log(user, 'user')
    const getFavs = user ? app.listFavorites(user) : Promise.resolve([])

    Promise.all([app.getBuoys(), getFavs])
    .then(([buoys, favs]) => res.send({ buoys, favs }))
    .catch((err) => {
      res.status(500).send(err) // handle errors better
    })
  }

  return Router()
    .get('/', getBuoys)
}
