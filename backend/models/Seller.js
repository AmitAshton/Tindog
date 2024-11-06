const mongoose = require('mongoose');

//seller status schema
const sellerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dog: {
        type: mongoose.Schema.ObjectId,
        ref: 'Dog',
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Seller', sellerSchema);
