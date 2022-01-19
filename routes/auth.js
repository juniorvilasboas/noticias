const express = require('express')
const userController = require('../controllers/auth')

const router = express.Router()

router.get('/login', userController.index)
router.post('/login', userController.login)

module.exports = router