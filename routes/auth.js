const express = require('express')
const passport = require('passport')
const userController = require('../controllers/auth')

const router = express.Router()

router.use(passport.initialize())
router.use(passport.session())

router.use((req, res, next) => {
  if(req.isAuthenticated()) {
    res.locals.user = req.user
    if(!req.session.role) {
      req.session.role = req.user.roles[0]
    }
    res.locals.role = req.session.role
  }
  next()
})

router.get('/login', userController.index)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}))
router.get('/logout', userController.logout)
router.get('/change-role/:role', userController.roles)

module.exports = router