require('dotenv').config();

module.exports = {
  apps: [{
    name: 'web',
    script: './build/index.js',
    wait_ready: true,
    autorestart: false,
    error_file: 'err.log',
    out_file: 'out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
  }, {
    name: 'worker',
    script: './build/worker.js',
    error_file: 'worker-err.log',
    out_file: 'worker-out.log',
    wait_ready: true,
    autorestart: false,
  }],
  deploy: {
    production: {
      user: process.env.user,
      host: process.env.host,
      key: process.env.key,
      ref: 'remotes/origin/terraform',
      repo: 'https://github.com/cjessett/buoyfeed',
      path: process.env.path,
      'post-deploy': 'yarn && yarn build && yarn pm2 startOrRestart ecosystem.config.js',
    },
  },
}
