const express = require('express');
const router = express.Router();
const adoptersController = require('../controllers/adoptersController.js')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(adoptersController.getAllAdopters)
    .post(adoptersController.createNewAdopter)
    .patch(adoptersController.updateAdopter)

module.exports = router