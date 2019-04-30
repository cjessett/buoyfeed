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
    wait_ready: true,
    autorestart: false,
  }],
  deploy: {
    production: {
      user: process.env.PROD_USER,
      host: process.env.PROD_HOST,
      key: process.env.PROD_KEY_PATH,
      ref: 'origin/master',
      repo: 'https://github.com/cjessett/buoyfeed',
      path: process.env.PROD_PATH,
      'post-deploy': 'yarn && yarn pm2 startOrRestart ecosystem.config.js',
    },
  },
}
