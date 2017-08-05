import { Router } from 'express'

export default app => (
  Router().get('/', (req, res) => {
    const { sub: id } = req.user || {}
    const getFavs = id ? app.listFavorites(id) : Promise.resolve([])
    Promise.all([app.getBuoys(), getFavs])
    .then(([buoys, favs]) => res.send({ buoys, favs }))
    .catch((err) => {
      res.status(500).send(err) // handle errors better
    })
  })
)
