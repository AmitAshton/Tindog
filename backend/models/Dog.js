const mongoose = require('mongoose');
const dogBreeds = require('../config/dogBreeds')

//base Dog Schema
const dogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dogName: {
        type: String,
    },
    dogBreed: {
        type: String,
        required: true,
        enum: dogBreeds
    },
    dogAge: {
        type: Number
    },
    images: [{ type: String, required: true}], // Array of image URLs
})

module.exports = mongoose.model('Dog', dogSchema);
