import { parseString } from 'xml2js'
import axios from 'axios'
import mongoose, { Schema } from 'mongoose'

import { FEED_URL } from '../constants'

mongoose.Promise = global.Promise

export default function createFeed({ connection }) {
  const feedSchema = new Schema({
    title: String,
    pubDate: String,
    description: String,
    lat: String,
    lon: String,
    items: [{
      pubDate: String,
      title: String,
      description: String,
      link: String,
      guid: String,
      data: {
        pubDate: String,
        location: String,
        windDirection: String,
        windSpeed: String,
        windGust: String,
        significantWaveHeight: String,
        dominantWavePeriod: String,
        averagePeriod: String,
        meanWaveDirection: String,
        atmosphericPressure: String,
        pressureTendency: String,
        airTemperature: String,
        waterTemperature: String,
      },
    }],
  })

  feedSchema.statics = {
    pullFeed(coords) {
      const Feed = this

      function descriptionToData(description) {
        const gimmeKey = mess => mess.replace('<strong>', '').replace(':', '')
        const gimmeVal = mess => mess.replace('<br />', '').trim()
        const camelize = text => `${text.charAt(0).toLowerCase()}${text.slice(1)}`.replace(/ /g, '')
        const decode = text => text.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d))
        return description
          .trim()
          .split('\n')
          .map(t => t.trim())
          .map(f => f.split('</strong>'))
          .map(p => ([gimmeKey(p[0]), gimmeVal(p[1])]))
          .reduce((acc, pair, i) => {
            const data = i ? { [camelize(pair[0])]: decode(pair[1]) } : { pubDate: pair[0] }
            return Object.assign({}, acc, data)
          }, {})
      }

      function getItemProps(item) {
        const { pubDate, title, description, link, guid } = item
        const [lat, lon] = item['georss:point'][0].split(' ')
        return {
          guid: guid[0]._.split('-')[1],
          pubDate: pubDate[0],
          title: title[0],
          data: descriptionToData(description[0]),
          link: link[0],
          coordinates: { lat, lon },
        }
      }

      function parseFeed(xml) {
        console.log('parsing feed')
        return new Promise((resolve, reject) => (
          parseString(xml, (error, result) => {
            if (error) {
              console.log(error)
              return reject(error)
            }

            const feed = result.rss.channel[0]
            return resolve({
              title: feed.title[0],
              pubDate: feed.pubDate[0],
              description: feed.description[0],
              items: feed.item.map(getItemProps),
            })
          })
        ))
      }

      function fetchFeed({ lat, lon }) {
        console.log(`Fetching buoys within 100 mi of ${lat}, ${lon}`)
        const params = { lat, lon, radius: 100 }
        return axios(FEED_URL, { params }).then(res => res.data)
      }

      function saveFeed(data) {
        return new Promise((resolve, reject) => {
          const { lat, lon } = coords
          const { title, description, pubDate, items } = data
          if (!items.length) reject('no_items')

          console.log('saving feed', { title, description, pubDate })
          const cb = (err, feed) => (err ? reject(err) : resolve(feed))
          Feed.findOneAndUpdate({ lat, lon }, data, { upsert: true }, cb)
        })
      }

      return fetchFeed(coords)
        .then(parseFeed)
        .then(saveFeed)
        .catch(err => console.log(err))
    },
  }

  return connection.model('Feed', feedSchema)
}
