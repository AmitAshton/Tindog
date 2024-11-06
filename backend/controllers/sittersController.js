const User = require('../models/User')
const Sitter = require('../models/Sitter')

const asyncHandler = require('express-async-handler')
const { isValidObjectId } = require('mongoose')

// @desc Get all sitters
// @route GET /sitters
// @access Privte
const getAllSitters = asyncHandler(async (req, res) => {
    const sitters = await Sitter.find().lean()
    if(!sitters?.length){
        return res.status(400).json({message: "No sitters found"})
    }
    res.json(sitters)
})

// @desc Create a sitter
// @route POST /sitters
// @access Privte
const createNewSitter = asyncHandler(async (req, res) => {
    const {user, pricePerHour, personImage} = req.body

    if(typeof user == undefined || Number.isNaN(pricePerHour)){
        return res.status(400).json({message: "All fields are required"})
    }

    if (!Number.isInteger(pricePerHour) || !(pricePerHour > 0)) {
        return res.status(400).json({message: "Price per hour must be positive and integer"})
    }

    if(typeof personImage !== "string"){
        return res.status(400).json({message: "Person image should be a string"})
    }

    if(!isValidObjectId(user)){
        return res.status(400).json({ message: 'User ID not valid' })
    }

    const userConnected = await User.findById(user).exec()

    if(!userConnected){
        return res.status(400).json({message: "User Id not found"})
    }

    const duplicate = await Sitter.findOne({user}).lean().exec()

    if(duplicate){
        return res.status(409).json({message: "Duplicate sitter"})
    }

    const sitterObject = {user, pricePerHour, personImage}

    const sitter = await Sitter.create(sitterObject)

    if(sitter){
        res.status(201).json({message: "New sitter for " + userConnected.username + ' created with sitter ID ' + sitter._id})
    }else{
        res.status(400).json({message: 'Invalid sitter data received'})
    }
})

// @desc Update a sitter
// @route PATCH /sitters
// @access Privte
const updateSitter = asyncHandler(async (req, res) => {
    const {id, pricePerHour, personImage} = req.body

    if(Number.isNaN(pricePerHour)){
        return res.status(400).json({message: "Price should be a number"})
    }

    if (!Number.isInteger(pricePerHour) || !(pricePerHour > 0)) {
        return res.status(400).json({message: "Price must be positive and integer"})
    }

    if(typeof personImage !== "string"){
        return res.status(400).json({message: "Person image should be a string"})
    }

    if(!isValidObjectId(id)){
        return res.status(400).json({ message: 'Dog ID not valid' })
    }

    const sitter = await Sitter.findById(id).exec()

    if(!sitter){
        return res.status(400).json({message: "Sitter not found"})
    }

    sitter.pricePerHour = pricePerHour
    sitter.personImage = personImage

    const user = await User.findById(sitter.user)
    const userName = user.username

    const updatedSitter = await sitter.save()

    res.json({message: "Sitter "  + userName + " updated Successfully"})
})

module.exports = {getAllSitters, createNewSitter, updateSitter}