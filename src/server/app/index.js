import { EventEmitter } from 'events'
import util from 'util'
import connections from './connections'
import FeedModel from './feed'
import { TEN_MINUTES } from '../constants'

function App(config) {
  EventEmitter.call(this)

  this.config = config
  this.connections = connections(config.mongoUrl)
  this.connections.once('ready', this.onConnected.bind(this))
  this.connections.once('lost', this.onLost.bind(this))
}

util.inherits(App, EventEmitter)

App.prototype.onConnected = function () {
  this.Feed = FeedModel({ connection: this.connections.db, url: this.config.url })
  console.log('app ready')
  this.emit('ready')
}

App.prototype.onLost = function () {
  console.log('app lost')
  this.emit('lost')
}

App.prototype.watchFeed = function (url) {
  this.Feed.pullFeed(url)
  setInterval(() => this.Feed.pullFeed(url), TEN_MINUTES)
}

App.prototype.getBuoys = function () {
  return this.Feed.listBuoys()
}

export default function (config) {
  return new App(config)
}
