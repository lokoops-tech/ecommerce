const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        default: {}
    },
    date: {
        type: Date,
        default: Date.now
    },
    resetCode: String,
    resetCodeExpires: Date,
});

// Create the Users model
const Users = mongoose.model('Users', userSchema);

module.exports = Users;