const User = require('../models/User')
const Dog = require('../models/Dog')
const Seller = require('../models/Seller')
const { Types: { ObjectId } } = require('mongoose');
const asyncHandler = require('express-async-handler')
const { isValidObjectId } = require('mongoose')
const mongoose = require('mongoose');

// @desc Get all sellers
// @route GET /sellers
// @access Privte
const getAllSellers = asyncHandler(async (req, res) => {
    const sellers = await Seller.find().lean()
    if(!sellers?.length){
        return res.status(400).json({message: "No sellers found"})
    }
    res.json(sellers)
})

// @desc Create a seller
// @route POST /sellers
// @access Privte
const createNewSeller = asyncHandler(async (req, res) => {
    const { user, dog, price } = req.body;

    if (typeof user === undefined || typeof dog === undefined || Number.isNaN(price)) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!Number.isInteger(price) || !(price > 0)) {
        return res.status(400).json({ message: "Price must be positive and integer" });
    }

    // Check if user and dog are valid ObjectIds
    if (!mongoose.isValidObjectId(user) || !mongoose.isValidObjectId(dog)) {
        return res.status(400).json({ message: "Invalid user or dog ID" });
    }

    const userObjectId = new ObjectId(user);
    const dogObjectId = new ObjectId(dog);

    const userConnected = await User.findById(userObjectId).exec();
    const dogConnected = await Dog.findById(dogObjectId).exec();

    if (!userConnected) {
        return res.status(400).json({ message: "User Id not found" });
    }

    if (!dogConnected) {
        return res.status(400).json({ message: "Dog Id not found" });
    }

    const duplicate = await Seller.findOne({ user: userObjectId }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate seller" });
    }

    const sellerObject = { user: userObjectId, dog: dogObjectId, price };

    const seller = await Seller.create(sellerObject);

    if (seller) {
        res.status(201).json({ message: "New seller for " + userConnected.username + ' created with seller ID ' + seller._id });
    } else {
        res.status(400).json({ message: 'Invalid seller data received' });
    }
});

// @desc Update a seller
// @route PATCH /sellers
// @access Privte
const updateSeller = asyncHandler(async (req, res) => {
    const {id, price} = req.body

    if(Number.isNaN(price)){
        return res.status(400).json({message: "Price should be a number"})
    }

    if (!Number.isInteger(price) || !(price > 0)) {
        return res.status(400).json({message: "Price must be positive and integer"})
    }

    if(!isValidObjectId(id)){
        return res.status(400).json({ message: 'Seller ID not valid' })
    }

    const seller = await Seller.findById(id).exec()

    if(!seller){
        return res.status(400).json({message: "Seller not found"})
    }

    seller.price = price
    const user = await User.findById(seller.user)
    const userName = user.username

    const updatedSeller = await seller.save()

    res.json({message: "Seller "  + userName + " updated Successfully"})
})


module.exports = {getAllSellers, createNewSeller, updateSeller}