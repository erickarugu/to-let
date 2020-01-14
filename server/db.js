const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const dbConfig = require('./config/dbConfig');

const dbUrl = dbConfig.MongoURI;

const connect = async () => {
  mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', () => {
    console.log('could not connect');
  });
  db.once('open', () => {
    console.log('> Successfully connected to database');
  });
};
module.exports = { connect };
