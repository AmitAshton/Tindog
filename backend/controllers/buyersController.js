const User = require('../models/User')
const Buyer = require('../models/Buyer')

const dogBreeds = require('../config/dogBreeds')
const { Types: { ObjectId } } = require('mongoose');
const asyncHandler = require('express-async-handler')
const { isValidObjectId } = require('mongoose')
const mongoose = require('mongoose');

// @desc Get all buyers
// @route GET /buyers
// @access Privte
const getAllBuyers = asyncHandler(async (req, res) => {
    const buyers = await Buyer.find().lean()
    if(!buyers?.length){
        return res.status(400).json({message: "No buyers found"})
    }
    res.json(buyers)
})

// @desc Create a buyer
// @route POST /buyers
// @access Privte
const createNewBuyer = asyncHandler(async (req, res) => {
    const {user, dogBreed, price} = req.body

    if(typeof user == undefined || Number.isNaN(price)){
        return res.status(400).json({message: "All fields are required"})
    }

    if (!Number.isInteger(price) || !(price > 0)) {
        return res.status(400).json({message: "Price must be positive and integer"})
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

    const duplicate = await Buyer.findOne({user}).lean().exec()

    if(duplicate){
        return res.status(409).json({message: "Duplicate buyer"})
    }

    const buyerObject = {user, dogBreed, price}

    const buyer = await Buyer.create(buyerObject)

    if(buyer){
        res.status(201).json({message: "New buyer for " + userConnected.username + ' created with buyer ID ' + buyer._id})
    }else{
        res.status(400).json({message: 'Invalid buyer data received'})
    }
})

// @desc Update a buyer
// @route PATCH /buyers
// @access Privte
const updateBuyer = asyncHandler(async (req, res) => {
    const {id, dogBreed, price} = req.body

    if(Number.isNaN(price)){
        return res.status(400).json({message: "Price should be a number"})
    }

    if (!Number.isInteger(price) || !(price > 0)) {
        return res.status(400).json({message: "Price must be positive and integer"})
    }

    // Check if dogBreed is valid
    if (!dogBreeds.includes(dogBreed)) {
        return res.status(400).json({message: "Invalid breed"})
    }

    if(!isValidObjectId(id)){
        return res.status(400).json({ message: 'Dog ID not valid' })
    }

    const buyer = await Buyer.findById(id).exec()

    if(!buyer){
        return res.status(400).json({message: "Buyer not found"})
    }

    buyer.dogBreed = dogBreed
    buyer.price = price

    const user = await User.findById(buyer.user)
    const userName = user.username

    const updatedBuyer = await buyer.save()

    res.json({message: "Buyer "  + userName + " updated Successfully"})
})

module.exports = {getAllBuyers, createNewBuyer, updateBuyer}