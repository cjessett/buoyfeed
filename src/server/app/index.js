import { EventEmitter } from 'events'
import util from 'util'
import connections from './connections'
import FeedModel from './feed'
import UserModel from './user'

function App(config) {
  EventEmitter.call(this)

  this.config = config
  this.connections = connections(config.mongoConfig)
  this.connections.once('ready', this.onConnected.bind(this))
  this.connections.once('lost', this.onLost.bind(this))
}

util.inherits(App, EventEmitter)

// Connections
App.prototype.onConnected = function () {
  this.Feed = FeedModel({ connection: this.connections.db })
  this.User = UserModel({ connection: this.connections.db })
  this.emit('ready')
}

App.prototype.onLost = function () {
  console.log('app lost')
  this.emit('lost')
}

// Feed
App.prototype.createFeed = function ({ lat, lon }) {
  this.Feed.find({ lat, lon })
    .exec()
    .then((feed) => {
      if (!feed.length) return this.Feed.pullFeed({ lat, lon })
      return feed
    })
}

App.prototype.updateFeeds = function () {
  this.Feed.find({}, 'lat lon')
    .exec()
    .then((feeds) => {
      // We create the default feed if none exists
      if (!feeds.length) return this.createFeed({ lat: '40N', lon: '73W' })
      return feeds.forEach(f => this.Feed.pullFeed(f))
    })
    .catch(err => console.log(err))
}

App.prototype.getFeed = function (coords) {
  return this.Feed.findOne(coords, 'description items')
    .exec()
    .then((feed) => {
      if (!feed) return Promise.reject('not_found')
      return feed
    })
}

// User
App.prototype.createUser = function (creds) {
  return this.User.create(creds)
}

App.prototype.authenticate = function (creds) {
  return this.User.authenticate(creds)
}

App.prototype.listFavorites = function (id) {
  return this.User.listFavorites(id)
}

App.prototype.addFavorite = function (id, buoy) {
  return this.User.addFavorite(id, buoy)
}

App.prototype.removeFavorite = function (id, buoy) {
  return this.User.removeFavorite(id, buoy)
}

export default function (config) {
  return new App(config)
}
