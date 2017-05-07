var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var morgan = require('morgan');
var middleware = require('./middleware/middleware');
var express = require('express');
var cors = require('cors')

// Create Express web app
var app = express();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

var config = require('./config/config');
config.setConfig();

// get an instance of the router for api routes
var router = express.Router();

// route middleware to verify a token
// router.get('/pending',middleware.verifyToken,(req, res, next) => {
//   next()
// });

require('./controllers/controller')(app);

app.set('port', (process.env.PORT || 3000));

//app.use("/api",router);

var options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  replset: { rs_name: 'myReplicaSetName' },
  user: 'carshop',
  pass: 'Hq70BqjvzbSz'
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOOSE_CONNECT,options, (error) => {

  if (error) {
    console.log('Error connecting to DB ',error);
  }
  else {
      app.listen(app.get('port'), () => {
      console.log("Example app listening on port 3000!");
    });
  }
});

// Export Express app
module.exports = app;
