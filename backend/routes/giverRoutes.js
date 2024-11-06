const express = require('express');
const router = express.Router();
const giversController = require('../controllers/giversController.js')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(giversController.getAllGivers)
    .post(giversController.createNewGiver)

module.exports = router