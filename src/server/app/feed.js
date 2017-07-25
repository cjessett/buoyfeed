import { parseString } from 'xml2js'
import fetch from 'node-fetch'
import mongoose, { Schema } from 'mongoose'

mongoose.Promise = global.Promise

export default function createFeed({ connection, url }) {
  const feedSchema = new Schema({
    title: String,
    pubDate: String,
    description: String,
    url: { type: String, index: true, unique: true, default: url },
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
    pullFeed() {
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
        const [N, W] = item['georss:point'][0].split(' ')
        return {
          id: guid[0]._,
          pubDate: pubDate[0],
          title: title[0],
          data: descriptionToData(description[0]),
          link: link[0],
          coordinates: { N, W },
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

      function fetchFeed() {
        console.log('fetching feed')
        return fetch(url).then(res => res.text())
      }

      function saveFeed(data) {
        const { title, description, pubDate } = data
        console.log('saving feed', { title, description, pubDate })
        return Feed.findOneAndUpdate({ url }, data, { upsert: true }, () => Promise.resolve())
      }

      return fetchFeed()
        .then(parseFeed)
        .then(saveFeed)
        .catch(err => console.log(err))
    },

    listBuoys() {
      return this.findOne({ url: this().url })
        .exec()
        .then(feed => feed && feed.items)
    },
  }

  return connection.model('Feed', feedSchema)
}
