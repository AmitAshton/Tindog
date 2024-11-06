const mongoose = require('mongoose');
const dogBreeds = require('../config/dogBreeds')

//buyer status schema
const buyerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dogBreed: {
        type: String,
        required: true,
        enum: dogBreeds
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Buyer', buyerSchema);
