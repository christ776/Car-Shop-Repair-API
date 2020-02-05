const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Used to generate password hash
const SALT_WORK_FACTOR = 10;

const Roles = ['admin','user'];

const Repair = new mongoose.Schema({
    cost: { type: Number, default: 1},
    comments: { type: String, required: true}
});

// Define user model schema
const UserSchema = new mongoose.Schema({
    fullname:{ type:String, required:true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    role:{ type: String, default: 'user',enum:Roles },
    tickets:{ type: [Repair], default:[] }
});

//Middleware executed before save - hash the user's password
UserSchema.pre('save', async (next) => {

    const user = this;
 
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
 
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err)  {
            return next(err);
        }
 
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
 
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// Export user model
module.exports = mongoose.model('User', UserSchema);

