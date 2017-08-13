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
  this.Feed = FeedModel({ connection: this.connections.db, url: this.config.url })
  this.User = UserModel({ connection: this.connections.db })
  this.emit('ready')
}

App.prototype.onLost = function () {
  console.log('app lost')
  this.emit('lost')
}

// Feed
App.prototype.updateFeed = function () {
  this.Feed.pullFeed()
}

App.prototype.getBuoys = function () {
  return this.Feed.listBuoys()
}

// User
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
