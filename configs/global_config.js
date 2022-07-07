require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.HTTP_PORT,
  mongoDbUrl: process.env.MONGO_DATABASE_URL,
  jwtKey: process.env.JWT_SECRET,
  mongoDbCollections: {
    users: 'users'
  }
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);