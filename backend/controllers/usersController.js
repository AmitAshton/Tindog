const User = require('../models/User')
const Dog = require('../models/Dog')
const Seller = require('../models/Seller')
const Giver = require('../models/Giver')
const Buyer = require('../models/Buyer')
const Adopter = require('../models/Adopter')
const NeedSitter = require('../models/NeedSitter')
const Sitter = require('../models/Sitter')

const israelCities = require('../config/israelCities')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { isValidObjectId } = require('mongoose')


// @desc Get all users
// @route GET /users
// @access Privte
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message: "No users found"})
    }
    res.json(users)
})

// @desc Create new users
// @route  /users
// @access Public
const createNewUser = asyncHandler(async (req, res) => {
    const {username, password, location, status} = req.body

    // Confirm Data
    if (!username || !password || !location ||!status){
        return res.status(400).json({message: "All fields are required"})
    }

    if(typeof username !== "string"){
        return res.status(400).json({message: "username should be a string"})
    }

    if(typeof password !== "string"){
        return res.status(400).json({message: "password should be a string"})
    }

    // Password complexity requirements
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    if (!regex.test(password) || password.length < 6) {
        return res.status(400).json({message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."})
    }

    // Check if location is valid
    if (!israelCities.includes(location)) {
        return res.status(400).json({message: "Invalid location"})
    }
    
    // Check if status is valid
    const validStatusValues = ['Seller', 'Giver', 'Buyer', 'Adopter', 'NeedSitter', 'Sitter']
    if (!validStatusValues.includes(status)) {
        return res.status(400).json({message: "Invalid status"})
    }
    
    // Check for duplicates 
    const duplicate = await User.findOne({username}).lean().exec()

    if(duplicate){
        return res.status(409).json({message: "Duplicate username"})
    }

    // Hash password
    const hashPwd = await bcrypt.hash(password, 10) 

    const userObject = {username, "password": hashPwd, location, "friends": [], status}

    // Create and Save the new User
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ userId: user._id, status: user.status });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
})

// @desc Update a user
// @route PATCH /users
// @access Privte
const updateUser = asyncHandler(async (req, res) => {
    const {id, username, password, location, friends} = req.body

    // Confirm Data
    if(!id || !username || !location || !Array.isArray(friends)){
        res.status(400).json({message: "All fields are required"})
    }

    if(typeof username !== "string"){
        return res.status(400).json({message: "username should be a string"})
    }

    if(password && typeof password !== "string"){
        return res.status(400).json({message: "password should be a string"})
    }

    if(password){
        // Password complexity requirements
        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        if (!regex.test(password) || password.length < 6) {
            return res.status(400).json({message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."})
        }
    }

    if(!isValidObjectId(id)){
        return res.status(400).json({ message: 'User ID not valid' })
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: "User not found"})
    }

    const duplicate = await User.findOne({username}).lean().exec()

    // Allow updates

    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: "Duplicate username"})
    }

    //validating the friends array
    if(JSON.stringify(friends) !== JSON.stringify(user.friends)){
        for(const friend of friends){
            const foundFriend = await User.findById(friend).exec()
            if(!foundFriend){
                return res.status(400).json({message: "Friend User not found"})
            }
        }
    }

    user.username = username
    user.location = location
    user.friends = friends

    if(password){
        // Hash new Password
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({message: updatedUser.username + " updated Successfully"})
})

// @desc Delete a user
// @route DELETE /users
// @access Privte
const deleteUser = asyncHandler(async (req, res) => {
    const {id, status} = req.body

    if(!id){
        return res.status(400).json({message: "User ID required"})
    }

    if(!isValidObjectId(id)){
        return res.status(400).json({ message: 'User ID not valid' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const userName = user.username
    const userId = user._id

    switch (status) {
        case "Seller":
            const seller = await Seller.findOne({user: id}).exec()

            if(!seller){
                return res.status(400).json({message: "Seller profile not found"})
            }

            const sellerDog = await Dog.findById(seller.dog).exec()

            if(!sellerDog){
                return res.status(400).json({message: "Linked Dog not found"})
            }

            const sellerId = seller._id
            const sellerDogId = sellerDog._id

            const deleteSeller = await seller.deleteOne()
            const deleteSellerDog = await sellerDog.deleteOne()
            const deleteUserSeller = await user.deleteOne()

            if(deleteSeller && deleteSellerDog && deleteUserSeller){

                res.json('User ' + userName + ", User ID: " + userId + ", Seller ID: " + sellerId
                + ", Dog ID: " + sellerDogId + " were deleted Successfully");
            }else{
                res.status(400).json({message: 'Invalid user data received'})
            }

            break;

        case "Giver":
            const giver = await Giver.findOne({user: id}).exec()

            if(!giver){
                return res.status(400).json({message: "Giver profile not found"})
            }

            const giverDog = await Dog.findById(giver.dog).exec()

            if(!giverDog){
                return res.status(400).json({message: "Linked Dog not found"})
            }

            const giverId = giver._id
            const giverDogId = giverDog._id

            const deleteGiver = await giver.deleteOne()
            const deleteGiverDog = await giverDog.deleteOne()
            const deleteUserGiver = await user.deleteOne()

            if(deleteGiver && deleteGiverDog && deleteUserGiver){

                res.json('User ' + userName + ", User ID: " + userId + ", Giver ID: " + giverId
                + ", Dog ID: " + giverDogId + " was deleted Successfully");
            }else{
                res.status(400).json({message: 'Invalid user data received'})
            }

            break;
        
        case "Buyer": 
            const buyer = await Buyer.findOne({user: id}).exec()

            if(!buyer){
                return res.status(400).json({message: "Buyer profile not found"})
            }

            const buyerId = buyer._id
            
            const deleteBuyer = await buyer.deleteOne()
            const deleteUserBuyer = await user.deleteOne()

            if(deleteBuyer && deleteUserBuyer){
                res.json('User ' + userName + ", User ID: " + userId + ", Buyer ID: " + buyerId
                + " was deleted Successfully");
            }else{
                res.status(400).json({message: 'Invalid user data received'})
            }

            break;

        case "Adopter":
            const adopter = await Adopter.findOne({user: id}).exec()

            if(!adopter){
                return res.status(400).json({message: "Adopter profile not found"})
            }

            const adopterId = adopter._id

            const deleteAdopter = await adopter.deleteOne()
            const deleteUserAdopter = await user.deleteOne()

            if(deleteAdopter && deleteUserAdopter){
                res.json('User ' + userName + ", User ID: " + userId + ", Adopter ID: " + adopterId
                + " was deleted Successfully");
            }else{
                res.status(400).json({message: 'Invalid user data received'})
            }

            break;

        case "NeedSitter":
            const needSitter = await NeedSitter.findOne({user: id}).exec()
            
            if(!needSitter){
                return res.status(400).json({message: "NeedSitter profile not found"})
            }

            const needSitterDog = await Dog.findById(needSitter.dog).exec()

            if(!needSitterDog){
                return res.status(400).json({message: "Linked Dog not found"})
            }

            const needSitterId = needSitter._id
            const needSitterDogId = needSitterDog._id

            const deleteNeedSitter = await needSitter.deleteOne()
            const deleteNeedSitterDog = await needSitterDog.deleteOne()
            const deleteUserNeedSitter = await user.deleteOne()

            if(deleteNeedSitter && deleteNeedSitterDog && deleteUserNeedSitter){
                res.json('User ' + userName + ", User ID: " + userId + ", NeedSitter ID: " + needSitterId
                + ", Dog ID: " + needSitterDogId + " was deleted Successfully");
            }else{
                res.status(400).json({message: 'Invalid user data received'})
            }

            break;
        
        case "Sitter":
            const sitter = await Sitter.findOne({user:id}).exec()

            if(!sitter){
                return res.status(400).json({message: "Sitter profile not found"})
            }

            const sitterId = sitter._id

            const deleteSitter = await sitter.deleteOne()
            const deleteUserSitter = await user.deleteOne()
            
            if(deleteSitter && deleteUserSitter){
                res.json('User ' + userName + ", User ID: " + userId + ", Sitter ID: " + sitterId + " was deleted Successfully");
            }else{
                res.status(400).json({message: 'Invalid user data received'})
            }

            break;

        default:
            res.status(400).json({message: "Status is not valid"})
    }
})

module.exports = {getAllUsers, createNewUser, updateUser, deleteUser}