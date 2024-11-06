const User = require('../models/User')
const Dog = require('../models/Dog')
const NeedSitter = require('../models/NeedSitter')

const asyncHandler = require('express-async-handler')
const { Types: { ObjectId } } = require('mongoose');
const { isValidObjectId } = require('mongoose')
const mongoose = require('mongoose');

// @desc Get all need sitters
// @route GET /needsitters
// @access Privte
const getAllNeedSitters = asyncHandler(async (req, res) => {
    const needSitters = await NeedSitter.find().lean()
    if(!needSitters?.length){
        return res.status(400).json({message: "No need sitters found"})
    }
    res.json(needSitters)
})

// @desc Create a need sitter
// @route POST /needsitters
// @access Privte
const createNewNeedSitter = asyncHandler(async (req, res) => {
    const {user, dog} = req.body

    if(typeof user == undefined || typeof dog == undefined){
        return res.status(400).json({message: "All fields are required"})
    }

    // Check if user and dog are valid ObjectIds
    if (!mongoose.isValidObjectId(user) || !mongoose.isValidObjectId(dog)) {
        return res.status(400).json({ message: "Invalid user or dog ID" });
    }

    const userObjectId = new ObjectId(user);
    const dogObjectId = new ObjectId(dog);

    const userConnected = await User.findById(userObjectId).exec();
    const dogConnected = await Dog.findById(dogObjectId).exec();

    if(!userConnected){
        return res.status(400).json({message: "User Id not found"})
    }

    if(!dogConnected){
        return res.status(400).json({message: "Dog Id not found"})
    }

    const duplicate = await NeedSitter.findOne({user}).lean().exec()

    if(duplicate){
        return res.status(409).json({message: "Duplicate need sitter"})
    }

    const needSitterObject = {user, dog}

    const needSitter = await NeedSitter.create(needSitterObject)

    if(needSitter){
        res.status(201).json({message: "New need sitter for " + userConnected.username + ' created with need sitter ID ' + needSitter._id})
    }else{
        res.status(400).json({message: 'Invalid need sitter data received'})
    }
})

module.exports = {getAllNeedSitters, createNewNeedSitter}