const express = require('express');
const router = express.Router();
const dogsController = require('../controllers/dogsController.js')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(dogsController.getAllDogs)
    .post(dogsController.createNewDog)
    .patch(dogsController.updateDog)

module.exports = router
