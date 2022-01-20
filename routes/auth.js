const express = require('express')
const userController = require('../controllers/auth')

const router = express.Router()

router.use((req, res, next) => {
  if('user' in req.session) {
    res.locals.user = req.session.user
    res.locals.role = req.session.role
  }
  next()
})

router.get('/login', userController.index)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/change-role/:role', userController.roles)

module.exports = router