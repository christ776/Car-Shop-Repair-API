var users = require('./users');

// Map routes to controller functions
module.exports = (app) => {

    app.post('/api/signup', users.create);
    app.post('/api/login', users.login);
};
