var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Used to generate password hash
const SALT_WORK_FACTOR = 10;

const Roles = ['admin','user'];

const Repair = new mongoose.Schema({
    cost: { type: Number, default: 1},
    comments: { type: String, required: true}
});

// Define user model schema
var UserSchema = new mongoose.Schema({
    fullname:{ type:String, required:true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    role:{ type: String, default: 'user',enum:Roles },
    tickets:{ type: [Repair], default:[] }
});



UserSchema.methods.verifyPassword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Export user model
module.exports = mongoose.model('User', UserSchema);
