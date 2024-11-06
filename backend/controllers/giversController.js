const User = require('../models/User')
const Dog = require('../models/Dog')
const Giver = require('../models/Giver')

const asyncHandler = require('express-async-handler')
const { Types: { ObjectId } } = require('mongoose');
const { isValidObjectId } = require('mongoose')
const mongoose = require('mongoose');

// @desc Get all givers
// @route GET /givers
// @access Privte
const getAllGivers = asyncHandler(async (req, res) => {
    const givers = await Giver.find().lean()
    if(!givers?.length){
        return res.status(400).json({message: "No givers found"})
    }
    res.json(givers)
})

// @desc Create a giver
// @route POST /givers
// @access Privte
const createNewGiver = asyncHandler(async (req, res) => {
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

    const duplicate = await Giver.findOne({user}).lean().exec()

    if(duplicate){
        return res.status(409).json({message: "Duplicate giver"})
    }

    const giverObject = {user, dog}

    const giver = await Giver.create(giverObject)

    if(giver){
        res.status(201).json({message: "New giver for " + userConnected.username + ' created with giver ID ' + giver._id})
    }else{
        res.status(400).json({message: 'Invalid giver data received'})
    }
})

module.exports = {getAllGivers, createNewGiver}