const dogBreeds = require('../config/dogBreeds')
const Dog = require('../models/Dog')
const User = require('../models/User')

const asyncHandler = require('express-async-handler')
const { isValidObjectId } = require('mongoose')

// @desc Get all dogs
// @route GET /dogs
// @access Privte
const getAllDogs = asyncHandler(async (req, res) => {
    const dogs = await Dog.find().lean()
    if(!dogs?.length){
        return res.status(400).json({message: "No dogs found"})
    }
    res.json(dogs)
})

// @desc Create a dog
// @route POST /dogs
// @access Privte
const createNewDog = asyncHandler(async (req, res) => {
    const {user, dogName, dogBreed, dogAge, images} = req.body


    if(!user || !dogName || !dogBreed  || !dogAge || images.length === 0){
        return res.status(400).json({message: "All fields are required"})
    }

    if(typeof dogName !== "string"){
        return res.status(400).json({message: "Dog name should be String"})
    }

    // Check if dogBreed is valid
    if (!dogBreeds.includes(dogBreed)) {
        return res.status(400).json({message: "Invalid breed"})
    }

    if (Number.isNaN(dogAge) || !Number.isInteger(dogAge) || !(dogAge > 0)) {
        return res.status(400).json({message: "Dog age must be positive and integer"})
    }

    if(!Array.isArray(images)){
        return res.status(400).json({message: "Images should be an array"})
    }

    images.forEach(image => {
        if(!image instanceof String){
            return res.status(400).json({message: "each image should be a URL string"})
        }
    })

    if(!isValidObjectId(user)){
        return res.status(400).json({ message: 'User ID not valid' })
    }

    const userConnected = await User.findById(user).exec()

    if(!userConnected){
        return res.status(400).json({message: "User Id not found"})
    }

    const duplicate = await Dog.findOne({user}).lean().exec()

    if(duplicate){
        return res.status(409).json({message: "Duplicate user"})
    }

    const dogObject = {user: user, dogName, dogBreed, dogAge, images}

    const dog = await Dog.create(dogObject)

    if(dog){
        res.status(201).json({message: "New dog created with dog ID: " + dog._id + " for User ID: " + user})
    }else{
        res.status(400).json({message: 'Invalid dog data received'})
    }
})

// @desc Update a DOG
// @route PATCH /dogs
// @access Privte
const updateDog = asyncHandler(async (req, res) => {
    const {id, dogName, dogBreed, dogAge, images} = req.body

    // Confirm Data
    if(!id || !dogName || !dogBreed){
        res.status(400).json({message: "All fields are required"})
    }

    if(typeof dogName !== "string"){
        return res.status(400).json({message: "Dog name should be String"})
    }

    // Check if dogBreed is valid
    if (!dogBreeds.includes(dogBreed)) {
        return res.status(400).json({message: "Invalid breed"})
    }

    if (Number.isNaN(dogAge) || !Number.isInteger(dogAge) || !(dogAge > 0)) {
        return res.status(400).json({message: "Dog age must be positive and integer"})
    }

    if(!Array.isArray(images)){
        return res.status(400).json({message: "Images should be an array"})
    }

    images.forEach(image => {
        if(!image instanceof String){
            return res.status(400).json({message: "each image should be a URL string"})
        }
    })

    if(!isValidObjectId(id)){
        return res.status(400).json({ message: 'Dog ID not valid' })
    }

    const dog = await Dog.findById(id).exec()

    if(!dog){
        return res.status(400).json({message: "Dog not found"})
    }

    dog.dogName = dogName
    dog.dogBreed = dogBreed
    dog.dogAge = dogAge
    dog.images = images

    const updatedDog = await dog.save()

    res.json({message: updatedDog.dogName + " updated Successfully"})
})

module.exports = {getAllDogs, createNewDog, updateDog}