const express = require('express');
const router = express.Router();
const sittersController = require('../controllers/sittersController.js')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(sittersController.getAllSitters)
    .post(sittersController.createNewSitter)
    .patch(sittersController.updateSitter)

module.exports = router