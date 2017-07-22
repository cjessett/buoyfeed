module.exports = {
  apps: [{
    name: 'buoyfeed',
    script: './build/server.js',
    env: {
      PORT: 3000,
      MONGO_USER: 'buoyfeed',
      MONGO_PASSWORD: 'bu0yf33d123'
    }
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-13-59-89-79.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/buoyfeed.pem',
      ref: 'origin/aws',
      repo: 'git@github.com:cjessett/buoyfeed.git',
      path: '/home/ubuntu/buoyfeed',
      'post-deploy': 'yarn && yarn build && yarn pm2 startOrRestart ecosystem.config.js',
      env: {
        PORT: 3000,
        MONGO_USER: 'buoyfeed',
        MONGO_PASSWORD: 'bu0yf33d123'
      }
    }
  }
}
