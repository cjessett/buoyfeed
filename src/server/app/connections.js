import mongoose from 'mongoose'
import { EventEmitter } from 'events'
import util from 'util'

function Connector(mongoUrl) {
  EventEmitter.call(this)

  this.db = mongoose.createConnection(mongoUrl)
  .on('connected', () => {
    console.log({ type: 'info', msg: 'connected', service: 'mongodb' })
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
