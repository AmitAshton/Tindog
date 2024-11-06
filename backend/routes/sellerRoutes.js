const express = require('express');
const router = express.Router();
const sellersController = require('../controllers/sellersController.js')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(sellersController.getAllSellers)
    .post(sellersController.createNewSeller)
    .patch(sellersController.updateSeller)

module.exports = router