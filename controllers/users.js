var User = require('../model/user');
var middleware = require('../middleware/middleware');

exports.create = (req,res) => {

 var newUser = new User(req.body);

    newUser.save((err) => {
        if (err) {
            return res.status(403).json({'error':'Please use another email'});
        }
        return res.status(200).json({'success':'user has been created'});
    })
};

exports.login = (req, res) => {

    const password = req.body.password;
    const email = req.body.email;

    User.findOne({email: email.toLowerCase()}, (err, user) => {

        if (user) {
             // Make sure the password is correct
            user.verifyPassword(password,function(err, isMatch) {
                if (err || !isMatch) {
                    return res.status(401).json({'Error':'User does not exist or bad password'});
                }  
                middleware.createToken(user).
                then(
                    (token) => {
                    return res.status(200).json({
                    'token': token, 
                    'user':{'fullname':user.fullname, 'email':user.email}
                });
                }).catch( 
                    (error) => {
                    return res.status(401).json({'Error':'User does not exist or bad password'});
                });
            });
        }
        else {
            return res.status(401).json({'Error':'User does not exist or bad password'});
        }
    });
};