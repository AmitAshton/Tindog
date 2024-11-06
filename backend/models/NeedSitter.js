const mongoose = require('mongoose');

//need sitter status schema
const needSitterSchema = new mongoose.Schema({
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

module.exports = mongoose.model('NeedSitter', needSitterSchema);
