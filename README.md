# [BuoyFeed](https://buoyfeed.cjessett.com/)


## Getting Started

### Prerequisites

Make sure that [Node v7](https://nodejs.org/en/download/releases/) is installed.

Make sure that [yarn](https://github.com/yarnpkg/yarn) is installed.

Also, [mongodb](https://www.mongodb.com/download-center#community). ([On a mac with brew](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/))

Finally, [redis](https://redis.io/). (sessions)

### Instructions

Clone the repo

```bash
$ git clone https://github.com/cjessett/buoyfeed
```

Install dependencies:

```bash
$ yarn
```
Make sure mongodb is running. ([with brew](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb))

Make sure redis is running.

**Note, mongo and redis config variables are assumed to be the default, you can set environment variables via a `.env` file**


Finally, to run the project for development:

```bash
$ yarn dev
```

Or, to run the project for production:

```bash
$ yarn build
$ yarn start
```

## Architecture
 Bootstrapped with [preact-pwa](https://github.com/ezekielchentnik/preact-pwa).

A `Super fast progressive web app` with a small footprint.

Features universal rendering, redux, state-driven routing, preact, & service workers.
Offline support with redux-offline.
Crunched & optimized with rollup, buble, optimize-js, & purify-css.

#### Features

- Progressive Web App enabled with [service workers](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)
- Offline capable with [service workers](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)
- Universal JavaScript (isomorphic rendering)
- Asset Versioning, long term caching, & cache busting for browser that do not support service workers via [node-rev](https://www.npmjs.com/package/node-rev)
- Modern JavaScript syntax with [ES6](https://github.com/lukehoban/es6features) via [buble](https://buble.surge.sh/guide/).
- Performant bundles via [rollup](http://rollupjs.org/).
- Component-based UI architecture via [Preact](https://preactjs.com/).
- Application state management w/time-travel debugging via [Redux](https://github.com/gaearon/redux).
- CSS built with [Sass](http://sass-lang.com/) and optimized with [purify-css](https://github.com/purifycss/purifycss).
- Async actions handled with [redux-thunk](https://github.com/gaearon/redux-thunk), [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch), and [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
- Node server is built with [express](http://expressjs.com/).
- Linting is handled with [Standard](http://standardjs.com/).

License

MIT
