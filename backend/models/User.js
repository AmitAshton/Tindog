const mongoose = require('mongoose')
const israelCities = require('../config/israelCities')

// database schema for each user in the application
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:  true
    },
    location: {
        type: String,
        required: true,
        enum: israelCities
    },
    // when matching with other user, the other user enters the friends list of the current user
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "User"
    }],
    // the account status(buyer, seller, etc..)
    status: {
        type: String,
        required: true,
        enum: ['Seller', 'Giver', 'Buyer', 'Adopter', 'NeedSitter', 'Sitter']
    }
    },
    {
        timestamps: true
    }
)   

module.exports = mongoose.model('User', userSchema)