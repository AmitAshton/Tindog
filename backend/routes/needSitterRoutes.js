const express = require('express');
const router = express.Router();
const needSittersController = require('../controllers/needSittersController.js')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(needSittersController.getAllNeedSitters)
    .post(needSittersController.createNewNeedSitter)

module.exports = router