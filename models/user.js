const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//this will insert into our Schema a username and password, also it will make username unique and other things
//it also adds many static methods to User schema (like register and more)
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)