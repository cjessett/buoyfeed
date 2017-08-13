export default {
  user: process.env.MONGO_USER || '',
  password: process.env.MONGO_PASSWORD || '',
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || '27017',
  database: process.env.MONGO_DB || '',
}
