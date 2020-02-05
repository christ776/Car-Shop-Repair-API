const jwt = require('jsonwebtoken');

module.exports = {
    createToken,
    verifyToken
};

function createToken (user) {
    return jwt.sign(user,process.env.SECRET_KEY, { expiresIn:4000});
}

function verifyToken(req,res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {     
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;    
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }
}