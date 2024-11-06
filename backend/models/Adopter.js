const mongoose = require('mongoose');

//adopter status schema
const adopterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dogBreed: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Adopter', adopterSchema);
