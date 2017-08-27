import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

mongoose.Promise = global.Promise

export default function CreateUser({ connection }) {
  const userSchema = new Schema({
    favorites: { type: [String], default: [] },
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
  })

  userSchema.statics = {
    authenticate({ username, password }) {
      return this.findOne({ username })
        .exec()
        .then((user) => {
          return bcrypt.compare(password, user.password)
          .then(res => (res ? user : Promise.reject('bad creds')))
        })
    },

    listFavorites(_id) {
      return this.findOne({ _id })
        .exec()
        .then(user => (user ? user.favorites : []))
    },

    addFavorite(_id, buoy) {
      return this.findOneAndUpdate({ _id }, { $addToSet: { favorites: buoy } }, { upsert: true })
        .exec()
    },

    removeFavorite(_id, buoy) {
      return this.findOneAndUpdate({ _id }, { $pull: { favorites: buoy } })
        .exec()
    },
  }

  userSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      return next()
    })
  })

  return connection.model('User', userSchema)
}
