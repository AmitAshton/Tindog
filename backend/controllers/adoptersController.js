const User = require('../models/User')
const Dog = require('../models/Dog')
const Adopter = require('../models/Adopter')
const dogBreeds = require('../config/dogBreeds')

const asyncHandler = require('express-async-handler')
const { isValidObjectId } = require('mongoose')

// @desc Get all adopters
// @route GET /adopters
// @access Privte
const getAllAdopters = asyncHandler(async (req, res) => {
    const adopters = await Adopter.find().lean()
    if(!adopters?.length){
        return res.status(400).json({message: "No adopters found"})
    }
    res.json(adopters)
})

// @desc Create an adopter
// @route POST /adopters
// @access Privte
const createNewAdopter = asyncHandler(async (req, res) => {
    const {user, dogBreed} = req.body

    if(typeof user == undefined){
        return res.status(400).json({message: "All fields are required"})
    }

    // Check if dogBreed is valid
    if (!dogBreeds.includes(dogBreed)) {
        return res.status(400).json({message: "Invalid breed"})
    }

    if(!isValidObjectId(user)){
        return res.status(400).json({ message: 'User ID not valid' })
    }

    const userConnected = await User.findById(user).exec()

    if(!userConnected){
        return res.status(400).json({message: "User Id not found"})
    }

    const duplicate = await Adopter.findOne({user}).lean().exec()

    if(duplicate){
        return res.status(409).json({message: "Duplicate adopter"})
    }

    const adopterObject = {user, dogBreed}

    const adopter = await Adopter.create(adopterObject)

    if(adopter){
        res.status(201).json({message: "New adopter for " + userConnected.username + ' created with adopter ID ' + adopter._id})
    }else{
        res.status(400).json({message: 'Invalid adopter data received'})
    }
})

// @desc Update an adopter
// @route PATCH /adopters
// @access Privte
const updateAdopter = asyncHandler(async (req, res) => {
    const {id, dogBreed} = req.body

    // Check if dogBreed is valid
    if (!dogBreeds.includes(dogBreed)) {
        return res.status(400).json({message: "Invalid breed"})
    }

    if(!isValidObjectId(id)){
        return res.status(400).json({ message: 'Dog ID not valid' })
    }

    const adopter = await Adopter.findById(id).exec()

    if(!adopter){
        return res.status(400).json({message: "Adopter not found"})
    }

    adopter.dogBreed = dogBreed

    const user = await User.findById(adopter.user)
    const userName = user.username

    const updatedAdopter = await adopter.save()

    res.json({message: "Adopter "  + userName + " updated Successfully"})
})


module.exports = {getAllAdopters, createNewAdopter, updateAdopter}
