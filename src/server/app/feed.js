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
    items: [{ pubDate: String, title: String, description: String, link: String, guid: String }],
  })

  feedSchema.statics = {
    pullFeed() {
      const Feed = this
      function getItemProps(item) {
        const { pubDate, title, description, link, guid } = item
        const [N, W] = item['georss:point'][0].split(' ')
        return {
          id: guid[0]._,
          pubDate: pubDate[0],
          title: title[0],
          description: description[0],
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
