const express = require('express');
const router = express.Router();
const path = require('path')

//sending index.html file for the main route(just '/' or included index.html)
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router;