# [BuoyFeed](https://buoyfeed.cjessett.com/)


## Getting Started

### Prerequisites

Make sure that [Node v8](https://nodejs.org/en/download/releases/) is installed.

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
 Bootstrapped with [preact-pwa](https://github.com/ezekielchentnik/preact-pwa). A `super fast progressive web app` with a small footprint.

This is Universal Javascript application that uses a web-worker model to fetch and then serve buoy data. The `web` and the `worker` are separate node processes, each using an `app` instance.

The reason behind this architectural approach is to separate the concerns of handling web requests and processing background work. This allows either process to be scaled independently in response to site load.

Although this application uses only one RSS feed, it can scale to support many feeds and users. One approach would be to use a work queue for fetching and caching/persiting feeds.

Note that in development mode the worker is not used and the web process handles fetching and persisting the feed.


#### entry
`server/index.js`

This is the entry into the app. It runs the `web` process with an `app` instance.

#### web
`server/web.js`

The Express application that handles web requests.

#### worker
`server/worker.js`

The process that fetches and saves buoy data from the given RSS feed using an `app` instance.

#### app
`server/app/index.js`

The `app` interface for the buoy and user data.

---
License

MIT
