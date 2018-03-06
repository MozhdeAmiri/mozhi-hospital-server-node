const express = require('express');
const bodyParser = require('body-parser');

const router = require('./api/routes/router'); 

const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');

const devDbUrl = 'mongodb://mozhde:mozhde@ds251217.mlab.com:51217/mozhde_hospital';
const mongoDB = process.env.MONGODB_URI || devDbUrl;
mongoose.connect(mongoDB, {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router(app); // register the route

const port = process.env.PORT || 4000;
app.listen(port);
console.log(`Hospital RESTful API server started on: ${port}`);

module.exports = app;
