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
      user: 'ubuntu',
      host: 'cjessett.com',
      key: '~/.ssh/buoyfeed.pem',
      ref: 'origin/master',
      repo: 'git@github.com:cjessett/buoyfeed.git',
      path: '/home/ubuntu/buoyfeed',
      'post-deploy': 'yarn && yarn build && yarn pm2 startOrRestart ecosystem.config.js',
    },
  },
}
