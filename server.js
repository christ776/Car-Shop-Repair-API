var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var middleware = require('./middleware/middleware');
var express = require('express');
var cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

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

// get an instance of the router for api routes
var router = express.Router();

// route middleware to verify a token
router.get('/pending',middleware.verifyToken,(req, res, next) => {
    next();
});

require('./controllers/controller')(app);

app.set('port', (process.env.PORT || 3000));

//app.use("/api",router);

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const usr = process.env.DB_USER;
const pwd = process.env.DB_PASSWORD;

// mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${usr}:${pwd}@cluster0-1bmbf.mongodb.net/test?retryWrites=true&w=majority`,options, (error) => {

    if (error) {
        console.log('Error connecting to DB ',error);
    }
    else {
        app.listen(app.get('port'), () => {
            console.log('Example app listening on port 3000!');
        });
    }
});

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

// Export Express app
module.exports = app;
