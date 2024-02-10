const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },

    num_of_actions: {
        type: Number,
        required: true,
      
    },


});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
