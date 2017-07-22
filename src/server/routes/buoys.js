import { Router } from 'express'

export default app => (
  Router().get('/', (req, res) => {
    app.getBuoys()
    .then(buoys => res.send(buoys))
    .catch((err) => {
      res.status(500).send(err) // handle errors better
    })
  })
)
