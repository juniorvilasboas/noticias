const express = require('express')
const pageController = require('../controllers/page')

const router = express.Router()

router.get('/', pageController.index)

module.exports = router