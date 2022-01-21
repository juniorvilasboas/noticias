const express = require('express')
const passport = require('passport')

const User = require('../models/user')
const authController = require('../controllers/auth')

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

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

router.get('/login', authController.index)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}))
router.get('/facebook', authController.facebook)
router.get('/facebook/callback',
              passport.authenticate('facebook', { failureRedirect: '/' }),
              (req, res) => {
                res.redirect('/')
              }
)
router.get('/google', authController.google)
router.get('/google/callback', authController.googleCallback)
router.get('/logout', authController.logout)
router.get('/change-role/:role', authController.changeRole)

module.exports = router