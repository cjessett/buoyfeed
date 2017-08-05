import mongoose, { Schema } from 'mongoose'

mongoose.Promise = global.Promise

export default function CreateUser({ connection }) {
  const userSchema = new Schema({
    name: String,
    password: String,
    id: { type: String, index: true, unique: true },
    favorites: { type: [String], default: [] },
  })

  userSchema.statics = {
    listFavorites(id) {
      return this.findOne({ id })
        .exec()
        .then(user => (user ? user.favorites : []))
    },

    addFavorite(id, buoy) {
      return this.findOneAndUpdate({ id }, { $addToSet: { favorites: buoy } }, { upsert: true })
        .exec()
    },

    removeFavorite(id, buoy) {
      return this.findOneAndUpdate({ id }, { $pull: { favorites: buoy } })
        .exec()
    },
  }

  return connection.model('User', userSchema)
}
