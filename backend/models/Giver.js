const mongoose = require('mongoose');

//giver status schema
const giverSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dog: {
        type: mongoose.Schema.ObjectId,
        ref: 'Dog',
        required: true
    }
})

module.exports = mongoose.model('Giver', giverSchema);
