const express = require('express');
const router = express.Router();
const buyersController = require('../controllers/buyersController.js')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(buyersController.getAllBuyers)
    .post(buyersController.createNewBuyer)
    .patch(buyersController.updateBuyer)

module.exports = router