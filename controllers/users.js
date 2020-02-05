const User = require('../model/user');
const middleware = require('../middleware/middleware');
const bcrypt = require('bcrypt-nodejs');

async function create(req,res) {
    const newUser = new UserModel(req.body);
    console.log('New user creation with: ', req.body);
    try {
        await newUser.save();
        return res.status(201).json({'success':'user has been created'});
    } catch (error) {
        return res.status(403).json({'error':'Please use another email'});

    }
}

async function login(req, res) {

    const password = req.body.password;
    const email = req.body.email;

    try {
        const user = await User.findOne({email: email.toLowerCase()});
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({'error':'User does not exist or password mismatch'});
        }  
        middleware.createToken(user).then((token) => res.status(200).json({
            'token': token,
            'user': { 'fullname': user.fullname, 'email': user.email }
        })).catch( () => {
            return res.status(401).json({'error':'User does not exist or bad password'});
        });
    } catch (error) {
        return res.status(401).json({'error':'User does not exist or bad password'});
    }
}

module.exports = {
    create,
    login
};