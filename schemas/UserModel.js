const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    userName: {type: String, required: true, trim: true, unique: true},
    email: {type: String, required: true, trim: true,validate:validator.isEmail, unique: true},
    password: {type: String, minlength: 8, required: true},
    profilePic: {type: String, default: "/img/users/profilePic.png"},
}, {
    timestamps: true
});

UserSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;