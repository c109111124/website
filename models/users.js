const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    registerboolen: {
        type: Boolean,
        default: false
    },
    registerexpire: {
        type: Date
    },
    verifycode: {
        type: String,
    },
    verifycodeexpire: {
        type: Date
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;