module.exports = {
  apps: [{
    name: 'buoyfeed',
    script: './build/server.js',
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