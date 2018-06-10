'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = require('express');
var express__default = _interopDefault(express);
var shrinkRay = _interopDefault(require('shrink-ray'));
var morgan = _interopDefault(require('morgan'));
var bodyParser = _interopDefault(require('body-parser'));
var session = _interopDefault(require('express-session'));
var redis = _interopDefault(require('connect-redis'));
var preact = require('preact');
var render = _interopDefault(require('preact-render-to-string'));
var fs = require('fs');
var redux = require('redux');
var thunk = _interopDefault(require('redux-thunk'));
var reduxOffline = require('redux-offline');
var axios = _interopDefault(require('axios'));
var reduxDevtoolsExtension_logOnlyInProduction = require('redux-devtools-extension/logOnlyInProduction');
var defaultConfig = _interopDefault(require('redux-offline/lib/defaults'));
var persistStore = _interopDefault(require('redux-offline/lib/defaults/persist'));
var PreactRedux = _interopDefault(require('preact-redux'));
var events = require('events');
var util = _interopDefault(require('util'));
var mongoose = require('mongoose');
var mongoose__default = _interopDefault(mongoose);
var xml2js = require('xml2js');
var bcrypt = _interopDefault(require('bcrypt'));

var cacheControl = function () { return function (req, res, next) {
  res.setHeader('Cache-Control', 'public,max-age=31536000,no-cache'); // lucid
  // res.header('Cache-Control', 'public,max-age=31536000,immutable') // immutable
  // res.header('Cache-Control', 'no-cache,no-store,must-revalidate') // never
  next();
}; };

var strictTransportSecurity = function () { return function (req, res, next) {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
}; };

var setHeaders = function (res, path) {
  if (path.indexOf('sw.js') > -1) {
    res.setHeader('Cache-Control', 'public,max-age=1800,no-cache');
  } else {
    res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');
  }
};

var serveStatic = function () { return express.static('build/public', { setHeaders: setHeaders }); };

var RedisStore = redis(session);

var host = process.env.REDIS_HOST || '127.0.0.1';
var port = process.env.REDIS_PORT || 6379;
var secret = process.env.SESSION_SECRET || 'waves';
var isProd = process.env.NODE_ENV === 'production';

var store = isProd ? new RedisStore({ host: host, port: port }) : undefined;

var session$1 = session({ secret: secret, store: store, resave: false, saveUninitialized: true });

var scrollTo = function (x, y) {
  try {
    return window.scrollTo(x, y) // eslint-disable-line
  } catch (err) {
    return undefined
  }
};

// actionTypes
var UPDATE_LOCATION = 'meta/UPDATE_LOCATION';

// selectors

var getPathname = function (state) { return state.meta.url.split('?')[0]; };
var updateLocation = function (url) { return function (dispatch, getState) {
  if (getPathname(getState()) === url) { scrollTo(0, 0); }
  dispatch({ type: UPDATE_LOCATION, payload: { url: url } });
}; };

// reducers
var initialState = {
  url: '/',
};

var meta = function (state, ref) {
  if ( state === void 0 ) state = initialState;
  var type = ref.type;
  var payload = ref.payload;

  switch (type) {
    case UPDATE_LOCATION:
      return Object.assign({}, state, payload)
    default:
      return state
  }
};

// actionTypes
var FETCH_BUOYS = 'api/FETCH_BUOYS';
var FETCH_BUOYS_ERROR = 'api/FETCH_BUOYS_ERROR';
var FETCH_BUOYS_SUCCESS = 'api/FETCH_BUOYS_SUCCESS';
var FAVORITE = 'FAVORITE';
var FAVORITE_ROLLBACK = 'FAVORITE_ROLLBACK';

// selectors
var getBuoys = function (state) { return state.buoys.collection; };




// actions
var startAction = function (type) { return ({ type: type }); };
var successAction = function (type, json) { return ({ type: type, payload: json }); };
var errorAction = function (type, error) { return ({ type: type, payload: error, error: true }); };

var fetchBuoys = function (params) { return function (dispatch) {
  dispatch(startAction(FETCH_BUOYS));
  return axios('/buoys', { params: params })
  .then(function (res) { return res.data; })
  .then(function (ref) {
    var feed = ref.feed;
    var favs = ref.favs;

    return dispatch(successAction(FETCH_BUOYS_SUCCESS, { feed: feed, favs: favs }));
  })
  .catch(function (error) { return dispatch(errorAction(FETCH_BUOYS_ERROR, error)); })
}; };

var fav = function (buoy, effect) { return ({
  type: FAVORITE,
  payload: { buoy: buoy },
  meta: {
    offline: {
      effect: effect,
      commit: { type: 'COMMITTING' },
      rollback: { type: FAVORITE_ROLLBACK, meta: { buoy: buoy } },
    },
  },
}); };

var offlineFav = function (buoy) { return function (dispatch, getState) {
  var ref = getState();
  var ref_user = ref.user;
  var favorites = ref_user.favorites;
  var id = ref_user.id;
  if (!id) { return dispatch(updateLocation('/login')) }
  var method = favorites.includes(buoy) ? 'delete' : 'post';
  var effect = { method: method, data: { buoy: buoy }, withCredentials: true, url: '/favorites' };
  return dispatch(fav(buoy, effect))
}; };

// reducer
var initialState$1 = {
  isFetching: false,
  hasFetched: false,
  hasError: false,
  error: null,
  collection: [],
  description: '',
};

var buoys = function (state, ref) {
  if ( state === void 0 ) state = initialState$1;
  var type = ref.type;
  var payload = ref.payload;

  switch (type) {
    case FETCH_BUOYS:
      return Object.assign({}, state,
        {isFetching: true,
        hasFetched: false,
        hasError: false,
        error: null})
    case FETCH_BUOYS_ERROR:
      return Object.assign({}, state,
        {hasError: true,
        error: payload,
        hasFetched: true,
        isFetching: false})
    case FETCH_BUOYS_SUCCESS:
      return Object.assign({}, state,
        {collection: payload.feed.items,
        description: payload.feed.description,
        hasFetched: true,
        isFetching: false})
    default:
      return state
  }
};

var mockStorage = function () {
  var _localStorage = typeof localStorage === 'undefined' ? {} : localStorage;

  return {
    localStorage: {
      getItem: function getItem(key) {
        return _localStorage[key] || null
      },
      removeItem: function removeItem(key) {
        delete _localStorage[key];
      },
      setItem: function setItem(key, val) {
        _localStorage[key] = val;
        return undefined
      },
      clear: function clear() {
        Object.keys(_localStorage).forEach(function (key) { return delete _localStorage[key]; });
      },
    },
  }
};

var ref = mockStorage();
var localStorage$1 = ref.localStorage;

var LOGIN = 'LOGIN';
var LOGOUT = 'LOGOUT';
var ERROR = 'auth/ERROR';

// actions
var login = function (ref) {
  var username = ref.username;
  var password = ref.password;

  return function (dispatch) { return (
  axios.post('/auth/login', { username: username, password: password })
  .then(function (ref) {
    var id = ref.data.id;

    dispatch({ type: LOGIN, payload: { id: id } });
    dispatch(updateLocation('/'));
  })
  .catch(function (err) {
    var msg = err.response ? err.response.data : 'Something went wrong';
    dispatch({ type: ERROR, payload: { login: msg } });
  })
); };
};

var signup = function (ref) {
  var username = ref.username;
  var password = ref.password;
  var passwordConf = ref.passwordConf;

  return function (dispatch) { return (
  axios.post('/auth/signup', { username: username, password: password, passwordConf: passwordConf })
  .then(function (ref) {
    var id = ref.data.id;

    dispatch({ type: LOGIN, payload: { id: id } });
    dispatch(updateLocation('/'));
  })
  .catch(function (err) {
    var msg = err.response ? err.response.data : 'Something went wrong';
    dispatch({ type: ERROR, payload: { signup: msg } });
  })
); };
};

var logout = function () { return function (dispatch) {
  localStorage$1.clear();
  dispatch({ type: LOGOUT });
  return axios('/auth/logout', { withCredentials: true })
  .then(function () { return dispatch(updateLocation('/')); })
  .catch(function (err) {
    var msg = err.response ? err.response.data : 'Something went wrong';
    dispatch({ type: ERROR, payload: { logout: msg } });
  })
}; };

// selectors
var getFavs = function (state) { return state.user.favorites; };

// reducer
var initialState$2 = {
  favorites: [],
  id: '',
  error: { login: '', signup: '', logout: '' },
};

var user = function (state, ref) {
  if ( state === void 0 ) state = initialState$2;
  var type = ref.type;
  var payload = ref.payload;

  switch (type) {
    case FAVORITE:
    case FAVORITE_ROLLBACK:
      return Object.assign({}, state,
        {favorites: state.favorites.find(function (i) { return i === payload.buoy; }) ?
          state.favorites.filter(function (i) { return i !== payload.buoy; }) :
          state.favorites.concat( [payload.buoy])})
    case FETCH_BUOYS_SUCCESS:
      return Object.assign({}, state,
        {favorites: payload.favs || state.favorites})
    case LOGIN:
      return Object.assign({}, state, {id: payload.id, error: ''})
    case LOGOUT:
      return initialState$2
    case ERROR:
      return Object.assign({}, state, {error: Object.assign({}, state.error, payload)})
    default:
      return state
  }
};

var rootReducer = redux.combineReducers({
  meta: meta,
  buoys: buoys,
  user: user,
});

var IS_CLIENT = false; // eslint-disable-line

var createStore$1 = function () {
  var config = Object.assign({}, defaultConfig, {
    effect: function (effectConfig) { return axios(effectConfig); },
    persist: function (store) { if (typeof self === 'object') { persistStore(store, { blacklist: ['meta', 'buoys'] }); } },
  });
  var enhancer = redux.compose(
      redux.applyMiddleware(thunk),
      IS_CLIENT ? reduxDevtoolsExtension_logOnlyInProduction.devToolsEnhancer() : function (f) { return f; },
      reduxOffline.offline(config)
  );
  return redux.createStore(rootReducer, enhancer)
};

var Link = function (ref) {
  var href = ref.href;
  var children = ref.children;
  var onClick = ref.onClick;
  var className = ref.className;

  return (
  preact.h( 'a', {
    href: href, className: className, onClick: function (e) {
      if (onClick) { onClick(e); }
      var button = e.button;
      var metaKey = e.metaKey;
      var altKey = e.altKey;
      var ctrlKey = e.ctrlKey;
      var shiftKey = e.shiftKey;
      var defaultPrevented = e.defaultPrevented;
      if (button !== 0 || metaKey || altKey || ctrlKey || shiftKey || defaultPrevented === true) {
        return
      }
      e.preventDefault();
    } }, children)
);
};

var connect$1 = PreactRedux.connect;

var Header = function (ref) {
  var _updateLocation = ref._updateLocation;
  var _logout = ref._logout;
  var isAuthenticated = ref.isAuthenticated;
  var pathname = ref.pathname;

  var goTo = function (path) { return function () { return _updateLocation(path); }; };
  var activeClass = function (path) { return (path === pathname ? 'active' : ''); };
  return (
    preact.h( 'header', { className: "Header" },
      preact.h( 'nav', null,
        preact.h( Link, { className: ("item " + (activeClass('/'))), href: "/", onClick: goTo('/') },
          preact.h( 'i', { className: "material-icons" }, "home")
        ),
        preact.h( Link, { className: ("item " + (activeClass('/favorites'))), href: "/favorites", onClick: goTo('/favorites') },
          preact.h( 'i', { className: "material-icons" }, "star")
        ),
        isAuthenticated ?
          preact.h( Link, { className: "item", href: "/logout", onClick: function () { return _logout(); } }, "Logout") :
          preact.h( 'span', { className: "item", style: { display: 'flex' } },
            preact.h( Link, { className: ("item " + (activeClass('/login'))), href: "/login", onClick: goTo('/login') }, "Login"),
            preact.h( Link, { className: ("item " + (activeClass('/signup'))), href: "/signup", onClick: goTo('/signup') }, "Sign Up")
          )
      )
    )
  )
};

var Header$1 = connect$1(
  function (state) { return ({ pathname: getPathname(state), isAuthenticated: !!state.user.id }); },
  { _updateLocation: updateLocation, _logout: logout }
)(Header);

var Buoy = function (ref) {
  var id = ref.id;
  var title = ref.title;
  var data = ref.data;
  var link = ref.link;
  var isFavorite = ref.isFavorite;
  var handleClick = ref.handleClick;

  var onClick = function () { return handleClick(id); };
  var pubDate = data.pubDate;
  var location = data.location;
  var significantWaveHeight = data.significantWaveHeight;
  var dominantWavePeriod = data.dominantWavePeriod;
  var averagePeriod = data.averagePeriod;
  var meanWaveDirection = data.meanWaveDirection;
  var windDirection = data.windDirection;
  var windSpeed = data.windSpeed;
  var windGust = data.windGust;
  var airTemperature = data.airTemperature;
  var waterTemperature = data.waterTemperature;
  return (
    preact.h( 'div', { className: "mdl-card card", style: { display: 'inherit' } },
      preact.h( 'div', { className: "mdl-card__title" },
        preact.h( 'h2', { className: "mdl-card__title-text", style: { width: '80%' } }, title),
        preact.h( 'button', { className: "mdl-button mdl-button--icon mdl-card__menu", onClick: onClick },
          preact.h( 'i', { className: "material-icons" },
            isFavorite ? 'star' : 'star_border'
          )
        )
      ),
      preact.h( 'p', { className: "mdl-card__supporting-text t1" }, preact.h( 'strong', null, "Last Update: " ), pubDate),
      preact.h( 'p', { className: "mdl-card__supporting-text t1" }, preact.h( 'strong', null, "Location: " ), location),
      preact.h( 'div', { className: "data-wrap" },
        preact.h( 'span', { className: "mdl-card__supporting-text" },
          preact.h( 'h4', { className: "mdl-card__title-text" }, "Waves"),
          preact.h( 'p', null, "Height: ", significantWaveHeight ),
          preact.h( 'p', null, "Dominant Period: ", dominantWavePeriod ),
          preact.h( 'p', null, "Average Period: ", averagePeriod ),
          preact.h( 'p', null, "Direction: ", meanWaveDirection )
        ),
        preact.h( 'span', { className: "mdl-card__supporting-text" },
          preact.h( 'h4', { className: "mdl-card__title-text" }, "Wind"),
          preact.h( 'p', null, "Direction: ", windDirection ),
          preact.h( 'p', null, "Speed: ", windSpeed ),
          preact.h( 'p', null, "Gust: ", windGust )
        ),
        preact.h( 'span', { className: "mdl-card__supporting-text" },
          preact.h( 'h4', { className: "mdl-card__title-text" }, "Temperature"),
          preact.h( 'p', null, "Air: ", airTemperature ),
          preact.h( 'p', null, "Water: ", waterTemperature )
        )
      ),
      preact.h( 'p', { className: "mdl-card__actions", style: { textAlign: 'center' } }, "available at ", preact.h( 'a', { href: link }, "ndbc.noaa.gov")
      )
    )
  )
};

var connect$2 = PreactRedux.connect;

var Home = (function (Component$$1) {
  function Home () {
    Component$$1.apply(this, arguments);
  }

  if ( Component$$1 ) Home.__proto__ = Component$$1;
  Home.prototype = Object.create( Component$$1 && Component$$1.prototype );
  Home.prototype.constructor = Home;

  Home.prototype.componentDidMount = function componentDidMount () {
    this.props.fetchBuoys({ lat: '40N', lon: '73W' });
  };

  Home.prototype.render = function render$$1 (props) {
    if (props.isFetching) { return null }
    if (props.error) { return preact.h( 'h5', { className: "content" }, props.error) }
    var defaultText = preact.h( 'h5', null, props.favs ? 'You have no favorites.' : 'No Buoys.' );
    var visibleBuoys = props.buoys
      .map(function (b) { return preact.h( Buoy, {
          id: b.guid, title: b.title, data: b.data, link: b.link, isFavorite: props.favs.includes(b.guid), handleClick: props.offlineFav }); });
    return (
      preact.h( 'div', { className: "Home" },
        preact.h( 'section', { className: "content" },
          preact.h( 'h5', null, props.description ),
          props.buoys.length ? visibleBuoys : defaultText
        )
      )
    )
  };

  return Home;
}(preact.Component));

function mapStateToProps$1(state, ownProps) {
  var buoys = ownProps.favs ?
    getBuoys(state).filter(function (b) { return getFavs(state).includes(b.guid); }) :
    getBuoys(state);
  var favs = getFavs(state);
  var ref = state.buoys;
  var description = ref.description;
  var isFetching = ref.isFetching;
  var error = ref.error;
  return { buoys: buoys, favs: favs, isFetching: isFetching, description: description, error: error }
}

var Home$1 = connect$2(mapStateToProps$1, { fetchBuoys: fetchBuoys, offlineFav: offlineFav })(Home);

var connect$3 = PreactRedux.connect;

var Signup = (function (Component$$1) {
  function Signup(props) {
    Component$$1.call(this, props);
    this.state = { err: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  if ( Component$$1 ) Signup.__proto__ = Component$$1;
  Signup.prototype = Object.create( Component$$1 && Component$$1.prototype );
  Signup.prototype.constructor = Signup;

  Signup.prototype.handleChange = function handleChange (ref) {
    var ref_target = ref.target;
    var id = ref_target.id;
    var value = ref_target.value;

    this.setState(( obj = {}, obj[id] = value.trim(), obj ));
    var obj;
  };

  Signup.prototype.handleSubmit = function handleSubmit (e) {
    var this$1 = this;

    e.preventDefault();
    var field = function (id) { return document.getElementById(id).value.trim(); };
    var ref = this.state;
    var username = ref.username; if ( username === void 0 ) username = field('username');
    var password = ref.password; if ( password === void 0 ) password = field('password');
    var passwordConf = ref.passwordConf; if ( passwordConf === void 0 ) passwordConf = field('passwordConf');
    if (!username || !password) { return this.setState({ err: 'All fields required.' }) }
    if (password !== passwordConf) { return this.setState({ err: 'Passwords must match' }) }
    return this.props.signup(this.state)
      .then(function () { return this$1.setState({ err: '' }); })
  };

  Signup.prototype.render = function render$$1 (ref, ref$1) {
    var error = ref.error;
    var err = ref$1.err;

    return (
      preact.h( 'div', { className: "Auth" },
        preact.h( 'form', { className: "mx-auto", onSubmit: this.handleSubmit },
          preact.h( 'h3', null, "Sign up" ),
          preact.h( 'div', null,
            preact.h( 'label', { htmlFor: "username" }, "Username"), preact.h( 'br', null ),
            preact.h( 'input', { required: true, id: "username", onInput: this.handleChange })
          ),
          preact.h( 'div', null,
            preact.h( 'label', { htmlFor: "password" }, "Password"), preact.h( 'br', null ),
            preact.h( 'input', { required: true, id: "password", type: "password", onInput: this.handleChange })
          ),
          preact.h( 'div', null,
            preact.h( 'label', { htmlFor: "passwordConf" }, "Confirm Password"), preact.h( 'br', null ),
            preact.h( 'input', { required: true, id: "passwordConf", type: "password", onInput: this.handleChange })
          ),
          preact.h( 'button', { type: "submit" }, "Sign up"),
          preact.h( 'div', { className: "error" }, err || error)
        )
      )
    )
  };

  return Signup;
}(preact.Component));

var Signup$1 = connect$3(function (state) { return ({ error: state.user.error.signup }); }, { signup: signup })(Signup);

var connect$4 = PreactRedux.connect;

var Login = (function (Component$$1) {
  function Login(props) {
    Component$$1.call(this, props);
    this.state = { err: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  if ( Component$$1 ) Login.__proto__ = Component$$1;
  Login.prototype = Object.create( Component$$1 && Component$$1.prototype );
  Login.prototype.constructor = Login;

  Login.prototype.handleChange = function handleChange (ref) {
    var ref_target = ref.target;
    var id = ref_target.id;
    var value = ref_target.value;

    this.setState(( obj = {}, obj[id] = value.trim(), obj ));
    var obj;
  };

  Login.prototype.handleSubmit = function handleSubmit (e) {
    var this$1 = this;

    e.preventDefault();
    // hack for chrome autocomplete bug
    var field = function (id) { return document.getElementById(id).value.trim(); };
    var ref = this.state;
    var username = ref.username; if ( username === void 0 ) username = field('username');
    var password = ref.password; if ( password === void 0 ) password = field('password');
    if (!username || !password) { return this.setState({ err: 'All fields required.' }) }
    return this.props.login({ username: username, password: password })
      .then(function () { return this$1.setState({ err: '' }); })
  };

  Login.prototype.render = function render$$1 (ref, ref$1) {
    var error = ref.error;
    var err = ref$1.err;

    return (
      preact.h( 'div', { className: "Auth" },
        preact.h( 'form', { className: "mx-auto", onSubmit: this.handleSubmit },
          preact.h( 'h3', null, "Log in" ),
          preact.h( 'div', null,
            preact.h( 'label', { htmlFor: "username" }, "Username"), preact.h( 'br', null ),
            preact.h( 'input', { required: true, id: "username", onInput: this.handleChange })
          ),
          preact.h( 'div', null,
            preact.h( 'label', { htmlFor: "password" }, "Password"), preact.h( 'br', null ),
            preact.h( 'input', { required: true, id: "password", type: "password", onInput: this.handleChange })
          ),
          preact.h( 'button', { type: "submit" }, "Log in"),
          preact.h( 'div', { className: "error" }, err || error)
        )
      )
    )
  };

  return Login;
}(preact.Component));

var Login$1 = connect$4(function (state) { return ({ error: state.user.error.login }); }, { login: login })(Login);

var FourOhFour = function () { return (
  preact.h( 'div', { className: 'FourOhFour page' },
    preact.h( 'h1', null, "Dag nab it!" ),
    preact.h( 'p', null, "The url you are trying cannot be found." )
  )
); };

var Provider = PreactRedux.Provider;
var connect = PreactRedux.connect;

var mapStateToProps = function (state) { return ({ pathname: getPathname(state) }); };

var Content = connect(mapStateToProps)(function (ref) {
  var pathname = ref.pathname;

  if (pathname === '/') { return preact.h( Home$1, null ) }
  else if (pathname === '/favorites') { return preact.h( Home$1, { favs: true }) }
  else if (pathname === '/login') { return preact.h( Login$1, null ) }
  else if (pathname === '/signup') { return preact.h( Signup$1, null ) }
  return preact.h( FourOhFour, null )
});

var App = function (ref) {
  var store = ref.store;

  return (
  preact.h( Provider, { store: store },
    preact.h( 'div', null,
      preact.h( Header$1, null ),
      preact.h( Content, null )
    )
  )
);
};

var assets = JSON.parse(fs.readFileSync((__dirname + "/public/assets.json")));
var manifestUrl = "/" + (assets['manifest.json']);
var inlineCss = fs.readFileSync((__dirname + "/public/" + (assets['bundle.css'])));
var inlineJs = fs.readFileSync((__dirname + "/public/" + (assets['bundle.js'])));
var AppShell = function (ref) {
  var html = ref.html;
  var state = ref.state;

  return ("<!DOCTYPE html>\n<html lang=\"en-US\">\n  <head>\n    <script>if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }</script>\n    <title>BuoyFeed</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <meta name=\"mobile-web-app-capable\" content=\"yes\">\n    <meta name=\"theme-color\" content=\"#002b49\">\n    <link rel=\"manifest\" href=\"" + manifestUrl + "\">\n    <link rel=\"dns-prefetch\" href=\"https://jsonplaceholder.typicode.com\">\n    <link rel=\"shortcut icon\"type=\"image/x-icon\" href=\"data:image/x-icon;,\">\n    <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\">\n    <style>" + inlineCss + "</style>\n  </head>\n  <body>\n    <div id=\"app\">" + html + "</div>\n    <script>window.__STATE__=" + (JSON.stringify(state).replace(/</g, '\\u003c')) + "</script>\n    <script>" + inlineJs + "</script>\n  </body>\n</html>");
};

var createAppShell = function (store) {
  var state = store.getState();
  var html = render(preact.h( App, { store: store }));
  return AppShell({ html: html, state: state })
};

var root = function () { return (
  express.Router().get('/', function (req, res) {
    var store = createStore$1();
    store.dispatch(updateLocation(req.originalUrl));
    res.send(createAppShell(store));
  })
); };

var FEED_URL = 'http://www.ndbc.noaa.gov/rss/ndbc_obs_search.php';
var LAT_RE = new RegExp(/(^[0-9]{1,2})(N|S)/);
var LON_RE = new RegExp(/(^[0-9]{1,3})(E|W)/);

var validType = function (coord) { return coord && typeof coord === 'string'; };
var validDir = function (validDirs, dir) { return validDirs.includes(dir); };
var inRange = function (digit, max, min) { return Number(digit) <= max && Number(digit) >= min; };

function validCoords(coords) {
  var lat = coords.lat;
  var lon = coords.lon;
  if (!validType(lat) || !validType(lon)) { return false }

  var latMatch = lat.match(LAT_RE);
  var lonMatch = lon.match(LON_RE);
  if (!latMatch || !lonMatch) { return false }

  var ref = latMatch.slice(1, 3);
  var latDigit = ref[0];
  var latDir = ref[1];
  var ref$1 = lonMatch.slice(1, 3);
  var lonDigit = ref$1[0];
  var lonDir = ref$1[1];

  if (!validDir(['N', 'S'], latDir) || !validDir(['E', 'W'], lonDir)) { return false }

  return inRange(latDigit, 90, 0) && inRange(lonDigit, 180, 0)
}

var buoys$1 = function (app) {
  function getBuoys(req, res) {
    var ref = req.query;
    var lat = ref.lat;
    var lon = ref.lon;
    if (!validCoords({ lat: lat, lon: lon })) { return res.status(422).send('Invalid coordinates') }

    var ref$1 = req.session;
    var user = ref$1.user;
    var getFavs = user ? app.listFavorites(user) : Promise.resolve([]);

    return Promise.all([app.getFeed(req.query), getFavs])
      .then(function (ref) {
        var feed = ref[0];
        var favs = ref[1];

        return res.send({ feed: feed, favs: favs });
    })
      .catch(function (err) {
        if (err === 'not_found') { return res.status(404).send(err) }
        console.log(err);
        return res.status(500).send('something went wrong')
      })
  }

  return express.Router()
    .get('/', getBuoys)
};

var favorites = function (app) {
  function addFavorite(req, res) {
    var ref = req.session;
    var id = ref.user;
    app.addFavorite(id, req.body.buoy)
    .then(function () { return res.sendStatus(200); })
    .catch(function (err) {
      console.log(err);
      res.status(500).send('something went wrong');
    });
  }

  function removeFavorite(req, res) {
    var ref = req.session;
    var id = ref.user;
    app.removeFavorite(id, req.body.buoy)
    .then(function () { return res.sendStatus(200); })
    .catch(function (err) {
      console.log(err);
      res.status(500).send('something went wrong');
    });
  }

  return express.Router()
    .post('/', addFavorite)
    .delete('/', removeFavorite)
};

var auth = function (app) {
  function signup(req, res) {
    var ref = req.body;
    var username = ref.username;
    var password = ref.password;
    var passwordConf = ref.passwordConf;
    var match = password === passwordConf;
    if (!match || !username || !password || !passwordConf) { return res.sendStatus(422) }
    return app.createUser({ username: username, password: password })
    .then(function (ref) {
      var id = ref.id;

      req.session.user = id;
      res.send({ id: id });
    })
    .catch(function () { return res.status(403).send('Username is already taken.'); })
  }

  function login(req, res) {
    var ref = req.body;
    var username = ref.username;
    var password = ref.password;
    if (!username || !password) { return res.sendStatus(422) }
    return app.authenticate({ username: username, password: password })
    .then(function (ref) {
      var id = ref.id;

      req.session.user = id;
      res.send({ id: id });
    })
    .catch(function () { return res.status(403).send('Bad credentials'); })
  }

  function logout(req, res) {
    req.session.destroy(function () { return res.redirect('/'); });
  }

  return express.Router()
    .post('/signup', signup)
    .post('/login', login)
    .get('/logout', logout)
};

var web = function (app) {
  // likely our proxy will handle compression, cache-control, etc. these are healthy defaults
  var web = express__default();
  web.disable('x-powered-by');
  web.use(shrinkRay());
  web.use(strictTransportSecurity());
  web.use(serveStatic()); // immutable static content
  web.use(cacheControl()); // cache control for the rest
  web.use(bodyParser.json());
  web.use(morgan('dev'));
  web.use(session$1);
  web.use('/auth', auth(app));
  web.use('/favorites', favorites(app));
  web.use('/buoys', buoys$1(app));
  web.use('/*', root(app)); // everything else

  return web
};

function Connector(ref) {
  var this$1 = this;
  var host = ref.host;
  var database = ref.database;
  var port = ref.port;
  var user = ref.user;
  var password = ref.password;

  events.EventEmitter.call(this);

  var uri = "mongodb://" + user + ":" + password + "@" + host + ":" + port + "/" + database;
  this.db = mongoose__default.createConnection(uri, { keepAlive: 1 })
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

function App$1(config) {
  events.EventEmitter.call(this);

  this.config = config;
  this.connections = connections(config.mongoConfig);
  this.connections.once('ready', this.onConnected.bind(this));
  this.connections.once('lost', this.onLost.bind(this));
}

util.inherits(App$1, events.EventEmitter);

// Connections
App$1.prototype.onConnected = function () {
  this.Feed = createFeed({ connection: this.connections.db });
  this.User = CreateUser({ connection: this.connections.db });
  this.emit('ready');
};

App$1.prototype.onLost = function () {
  console.log('app lost');
  this.emit('lost');
};

// Feed
App$1.prototype.createFeed = function (ref) {
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

App$1.prototype.updateFeeds = function () {
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

App$1.prototype.getFeed = function (coords) {
  return this.Feed.findOne(coords, 'description items')
    .exec()
    .then(function (feed) {
      if (!feed) { return Promise.reject('not_found') }
      return feed
    })
};

// User
App$1.prototype.createUser = function (creds) {
  return this.User.create(creds)
};

App$1.prototype.authenticate = function (creds) {
  return this.User.authenticate(creds)
};

App$1.prototype.listFavorites = function (id) {
  return this.User.listFavorites(id)
};

App$1.prototype.addFavorite = function (id, buoy) {
  return this.User.addFavorite(id, buoy)
};

App$1.prototype.removeFavorite = function (id, buoy) {
  return this.User.removeFavorite(id, buoy)
};

var app = function (config) {
  return new App$1(config)
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

var instance = app({ mongoConfig: mongoConfig, url: FEED_URL });

function createServer() {
  var webInstance = web(instance);

  if (process.env.NODE_ENV !== 'production') {
    var refreshInterval = process.env.REFRESH_INTERVAL || 60;
    instance.updateFeeds();
    setInterval(function () { return instance.updateFeeds(); }, refreshInterval * 60 * 1000);
  }

  var server = webInstance.listen(process.env.PORT || 8080, function () {
    if (process.env.NODE_ENV === 'production') { process.send('ready'); }
    console.log(("[server] app on http://localhost:" + (server.address().port) + " - " + (webInstance.settings.env)));
  });

  function shutdown() {
    server.close(function () { return process.exit(0); });
  }

  process.on('SIGTERM', shutdown);
}

instance.on('ready', createServer);
