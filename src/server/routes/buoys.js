import { Router } from 'express'

import validCoords from '../helpers'

export default (app) => {
  function getBuoys(req, res) {
    const { lat, lon } = req.query
    if (!validCoords({ lat, lon })) return res.status(422).send('Invalid coordinates')

    const { user } = req.session
    const getFavs = user ? app.listFavorites(user) : Promise.resolve([])

    return Promise.all([app.getFeed(req.query), getFavs])
      .then(([feed, favs]) => res.send({ feed, favs }))
      .catch((err) => {
        if (err === 'not_found') return res.status(404).send(err)
        console.log(err)
        return res.status(500).send('something went wrong')
      })
  }

  return Router()
    .get('/', getBuoys)
}
