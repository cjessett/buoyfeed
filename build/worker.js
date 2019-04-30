'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var events = require('events');
var util = _interopDefault(require('util'));
var mongoose = require('mongoose');
var mongoose__default = _interopDefault(mongoose);
var xml2js = require('xml2js');
var axios = _interopDefault(require('axios'));
var bcrypt = _interopDefault(require('bcrypt'));

function Connector(ref) {
  var this$1 = this;
  var host = ref.host;
  var database = ref.database;
  var port = ref.port;
  var user = ref.user;
  var password = ref.password;

  events.EventEmitter.call(this);

  var uri = "mongodb://" + user + ":" + password + "@" + host + ":" + port + "/" + database;
  var opts = { keepAlive: 1, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false };
  this.db = mongoose__default.createConnection(uri, opts)
  .on('connected', function () {
    console.log({ type: 'info', msg: 'connected', service: 'mongodb', uri: uri });
    this$1.emit('ready');
  })
  .on('error', function (err) {
    console.log({ type: 'error', msg: err, service: 'mongodb' });
  })
  .on('close', function () {
    console.log({ type: 'error', msg: 'closed', service: 'mongodb' });
  })
  .on('disconnected', function () {
    console.log({ type: 'error', msg: 'disconnected', service: 'mongodb' });
    this$1.emit('lost');
  });
}

util.inherits(Connector, events.EventEmitter);

var connections = function (mongoUrl) {
  return new Connector(mongoUrl)
};

var FEED_URL = 'http://www.ndbc.noaa.gov/rss/ndbc_obs_search.php';

mongoose__default.Promise = global.Promise;

function createFeed(ref) {
  var connection = ref.connection;

  var feedSchema = new mongoose.Schema({
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
  });

  feedSchema.statics = {
    pullFeed: function pullFeed(coords) {
      var Feed = this;

      function descriptionToData(description) {
        var gimmeKey = function (mess) { return mess.replace('<strong>', '').replace(':', ''); };
        var gimmeVal = function (mess) { return mess.replace('<br />', '').trim(); };
        var camelize = function (text) { return ("" + (text.charAt(0).toLowerCase()) + (text.slice(1))).replace(/ /g, ''); };
        var decode = function (text) { return text.replace(/&#(\d+);/g, function (_, d) { return String.fromCharCode(d); }); };
        return description
          .trim()
          .split('\n')
          .map(function (t) { return t.trim(); })
          .map(function (f) { return f.split('</strong>'); })
          .map(function (p) { return ([gimmeKey(p[0]), gimmeVal(p[1])]); })
          .reduce(function (acc, pair, i) {
            var data = i ? ( obj = {}, obj[camelize(pair[0])] = decode(pair[1]), obj ) : { pubDate: pair[0] };
            var obj;
            return Object.assign({}, acc, data)
          }, {})
      }

      function getItemProps(item) {
        var pubDate = item.pubDate;
        var title = item.title;
        var description = item.description;
        var link = item.link;
        var guid = item.guid;
        var ref = item['georss:point'][0].split(' ');
        var lat = ref[0];
        var lon = ref[1];
        return {
          guid: guid[0]._.split('-')[1],
          pubDate: pubDate[0],
          title: title[0],
          data: descriptionToData(description[0]),
          link: link[0],
          coordinates: { lat: lat, lon: lon },
        }
      }

      function parseFeed(xml) {
        console.log('parsing feed');
        return new Promise(function (resolve, reject) { return (
          xml2js.parseString(xml, function (error, result) {
            if (error) {
              console.log(error);
              return reject(error)
            }

            var feed = result.rss.channel[0];
            return resolve({
              title: feed.title[0],
              pubDate: feed.pubDate[0],
              description: feed.description[0],
              items: feed.item.map(getItemProps),
            })
          })
        ); })
      }

      function fetchFeed(ref) {
        var lat = ref.lat;
        var lon = ref.lon;

        console.log(("Fetching buoys within 100 mi of " + lat + ", " + lon));
        var params = { lat: lat, lon: lon, radius: 100 };
        return axios(FEED_URL, { params: params }).then(function (res) { return res.data; })
      }

      function saveFeed(data) {
        return new Promise(function (resolve, reject) {
          var lat = coords.lat;
          var lon = coords.lon;
          var title = data.title;
          var description = data.description;
          var pubDate = data.pubDate;
          var items = data.items;
          if (!items.length) { reject('no_items'); }

          console.log('saving feed', { title: title, description: description, pubDate: pubDate });
          var cb = function (err, feed) { return (err ? reject(err) : resolve(feed)); };
          Feed.findOneAndUpdate({ lat: lat, lon: lon }, data, { upsert: true }, cb);
        })
      }

      return fetchFeed(coords)
        .then(parseFeed)
        .then(saveFeed)
        .catch(function (err) { return console.log(err); })
    },
  };

  return connection.model('Feed', feedSchema)
}

mongoose__default.Promise = global.Promise;

function CreateUser(ref) {
  var connection = ref.connection;

  var userSchema = new mongoose.Schema({
    favorites: { type: [String], default: [] },
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
  });

  userSchema.statics = {
    authenticate: function authenticate(ref) {
      var username = ref.username;
      var password = ref.password;

      return this.findOne({ username: username })
        .exec()
        .then(function (user) {
          return bcrypt.compare(password, user.password)
          .then(function (res) { return (res ? user : Promise.reject('bad creds')); })
        })
    },

    listFavorites: function listFavorites(_id) {
      return this.findOne({ _id: _id })
        .exec()
        .then(function (user) { return (user ? user.favorites : []); })
    },

    addFavorite: function addFavorite(_id, buoy) {
      return this.findOneAndUpdate({ _id: _id }, { $addToSet: { favorites: buoy } }, { upsert: true })
        .exec()
    },

    removeFavorite: function removeFavorite(_id, buoy) {
      return this.findOneAndUpdate({ _id: _id }, { $pull: { favorites: buoy } })
        .exec()
    },
  };

  userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) { return next(err) }
      user.password = hash;
      return next()
    });
  });

  return connection.model('User', userSchema)
}

function App(config) {
  events.EventEmitter.call(this);

  this.config = config;
  this.connections = connections(config.mongoConfig);
  this.connections.once('ready', this.onConnected.bind(this));
  this.connections.once('lost', this.onLost.bind(this));
}

util.inherits(App, events.EventEmitter);

// Connections
App.prototype.onConnected = function () {
  this.Feed = createFeed({ connection: this.connections.db });
  this.User = CreateUser({ connection: this.connections.db });
  this.emit('ready');
};

App.prototype.onLost = function () {
  console.log('app lost');
  this.emit('lost');
};

// Feed
App.prototype.createFeed = function (ref) {
  var this$1 = this;
  var lat = ref.lat;
  var lon = ref.lon;

  this.Feed.find({ lat: lat, lon: lon })
    .exec()
    .then(function (feed) {
      if (!feed.length) { return this$1.Feed.pullFeed({ lat: lat, lon: lon }) }
      return feed
    });
};

App.prototype.updateFeeds = function () {
  var this$1 = this;

  this.Feed.find({}, 'lat lon')
    .exec()
    .then(function (feeds) {
      // We create the default feed if none exists
      if (!feeds.length) { return this$1.createFeed({ lat: '40N', lon: '73W' }) }
      return feeds.forEach(function (f) { return this$1.Feed.pullFeed(f); })
    })
    .catch(function (err) { return console.log(err); });
};

App.prototype.getFeed = function (coords) {
  return this.Feed.findOne(coords, 'description items')
    .exec()
    .then(function (feed) {
      if (!feed) { return Promise.reject('not_found') }
      return feed
    })
};

// User
App.prototype.createUser = function (creds) {
  return this.User.create(creds)
};

App.prototype.authenticate = function (creds) {
  return this.User.authenticate(creds)
};

App.prototype.listFavorites = function (id) {
  return this.User.listFavorites(id)
};

App.prototype.addFavorite = function (id, buoy) {
  return this.User.addFavorite(id, buoy)
};

App.prototype.removeFavorite = function (id, buoy) {
  return this.User.removeFavorite(id, buoy)
};

var app = function (config) {
  return new App(config)
};

require('dotenv').load();

var mongoConfig = {
  user: process.env.MONGO_USER || '',
  password: process.env.MONGO_PASSWORD || '',
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || '27017',
  database: process.env.MONGO_DB || '',
};

require('dotenv').load();
/* eslint-disable import/first */
require('source-map-support').install();

var refreshInterval = process.env.FEED_REFRESH_INTERVAL || 60;
var instance = app({ mongoConfig: mongoConfig, url: FEED_URL });

function start() {
  console.log({ type: 'info', msg: 'starting worker' });

  function shutdown() {
    console.log({ type: 'info', msg: 'shutting down' });
    process.exit();
  }

  if (process.env.NODE_ENV === 'production') { process.send('ready'); }
  instance.on('lost', shutdown);
  instance.updateFeeds();
  setInterval(function () { return instance.updateFeeds(); }, refreshInterval * 60 * 1000);

  process.on('SIGTERM', shutdown);
}

instance.on('ready', start);
//# sourceMappingURL=worker.js.map
