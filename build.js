/* eslint-disable */
require('dotenv').config()

const { rollup } = require('rollup')
const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const nodeResolve = require('rollup-plugin-node-resolve')
const optimizeJs = require('rollup-plugin-optimize-js')
const replace = require('rollup-plugin-replace')
const { uglify } = require('rollup-plugin-uglify')
const fs = require('fs-extra-promise')
const { render: sass } = require('node-sass')
const { process: cssnano } = require('cssnano')
const purifycss = require('purify-css')
const { generateSW: swPrecache } = require('workbox-build')
const { default: nodeRev } = require('node-rev')
const ugly = require('./uglify')
const { name, dependencies } = require('./package')

const mdl = fs.readFileSync('node_modules/material-design-lite/material.min.css', 'utf-8')
const sourceMap = process.env.NODE_ENV === 'development'
const externals = ['fs', 'util', 'events', 'redux-offline/lib/defaults', 'redux-offline/lib/defaults/persist', 'redux-devtools-extension/logOnlyInProduction']

const server = () => rollup({
  entry: 'src/server/index.js',
  external: Object.keys(dependencies).concat(externals),
  plugins: [
    replace({ __CLIENT__: false }),
    json(),
    commonjs({ extensions: ['.js', '.json'] }),
    buble({ jsx: 'h', objectAssign: 'Object.assign' })
  ]
}).then(bundle => bundle.write({ sourceMap, format: 'cjs', dest: 'build/index.js' }))

const worker = () => rollup({
  entry: 'src/server/worker.js',
  external: Object.keys(dependencies).concat(['fs', 'util', 'events', 'http']),
  plugins: [
    replace({ __CLIENT__: false }),
    json(),
    commonjs({ extensions: ['.js', '.json'] }),
    buble({ jsx: 'h', objectAssign: 'Object.assign' })
  ]
}).then(bundle => bundle.write({ sourceMap, format: 'cjs', dest: 'build/worker.js' }))

const client = () => rollup({
  entry: 'src/app/entry.js',
  context: 'window',
  plugins: [
    nodeResolve({ jsnext: true, browser: true }),
    commonjs({ include: /node_modules/, namedExports:  }),
    replace({
      __CLIENT__: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    buble({ jsx: 'h', objectAssign: 'Object.assign', exclude: /node_modules/ }),
    uglify(ugly),
    optimizeJs()
  ]
})
.then(bundle => bundle.write({ sourceMap, format: 'iife', dest: 'build/public/bundle.js' }))

const css = () => new Promise((resolve, reject) =>
  sass({ file: 'src/app/styles/entry.scss' }, (err, result) => (err ? reject(err) : resolve(result))))
  .then(({ css }) => purifycss(['src/app/components/**/*.js'], css.toString().concat(mdl)))
  .then(purified => cssnano(purified, { autoprefixer: { add: true } }))
  .then(({ css }) => fs.outputFileAsync('build/public/bundle.css', css))

const sw = () => swPrecache({
  globDirectory: 'build',
   globPatterns: [
     '**\/*.{html,json,js,css}',
   ],
   swDest: 'build/sw.js'
})

const rev = () => Promise.resolve(nodeRev({
  files: './build/public/**/*.*',
  outputDir: './build/public/',
  file: './build/public/assets.json',
  hash: true  // depends if we inlineJs, inlineCss or not
}))

const clean = () => fs.emptyDirAsync('./build')
const copy = () => fs.copyAsync('src/app/static/', './build/public/')

const tasks = new Map()
const run = (task) => {
  const start = new Date()
  return tasks.get(task)().then(
    () => console.log('\x1b[36m%s\x1b[0m', '[build]', `'${task}' done in ${new Date().getTime() - start.getTime()}ms`),
    err => console.error('\x1b[31m%s\x1b[0m', '[build]', `error running '${task}':`, err)
  )
}

tasks
  .set('clean', clean)
  .set('client', client)
  .set('css', css)
  .set('copy', copy)
  .set('rev', rev)
  .set('server', server)
  .set('worker', worker)
  .set('sw', sw)
  .set('build', () => run('clean')
    .then(() => Promise.all([run('client'), run('css'), run('copy'), run('server'), run('worker')]))
    .then(() => run('rev'))
    .then(() => run('sw'))
  )

run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'build')
