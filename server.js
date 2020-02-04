const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const middleware = require('./middleware/middleware');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Create Express web app
const app = express();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

// get an instance of the router for api routes
const router = express.Router();

// route middleware to verify a token
router.get('/pending',middleware.verifyToken,(req, res, next) => {
    next();
});

require('./controllers/controller')(app);

app.set('port', (process.env.PORT || 3000));

//app.use("/api",router);

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const usr = process.env.DB_USER;
const pwd = process.env.DB_PASSWORD;

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
