const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/';
const DB_NAME = 'bp-test';
const MONGO_URI = `${MONGODB_URI}${DB_NAME}`;

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

module.exports = mongoose.createConnection(MONGO_URI, connectionOptions);
