const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
require('dotenv').config();
const port = process.env.PORT || 3000;
// require routes
const userRoutes = require('./routes/user.routes');

const app = express();

// connect to db
const db = require('./db');

db.connect();

// middlewares
app.use(morgan('dev'));
app.use(express.json());


app.use('/user', userRoutes);

// start server
app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
