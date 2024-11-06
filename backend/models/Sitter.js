const mongoose = require('mongoose');

// sitter status schema
const sitterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    personImage: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Sitter', sitterSchema);
