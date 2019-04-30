import mongoose from 'mongoose'
import { EventEmitter } from 'events'
import util from 'util'

function Connector({ host, database, port, user, password }) {
  EventEmitter.call(this)

  const uri = `mongodb://${user}:${password}@${host}:${port}/${database}`
  const opts = { keepAlive: 1, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false };
  this.db = mongoose.createConnection(uri, opts)
  .on('connected', () => {
    console.log({ type: 'info', msg: 'connected', service: 'mongodb', uri })
    this.emit('ready')
  })
  .on('error', (err) => {
    console.log({ type: 'error', msg: err, service: 'mongodb' })
  })
  .on('close', () => {
    console.log({ type: 'error', msg: 'closed', service: 'mongodb' })
  })
  .on('disconnected', () => {
    console.log({ type: 'error', msg: 'disconnected', service: 'mongodb' })
    this.emit('lost')
  })
}

util.inherits(Connector, EventEmitter)

export default function (mongoUrl) {
  return new Connector(mongoUrl)
}
