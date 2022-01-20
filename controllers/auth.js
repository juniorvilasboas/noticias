const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username })
  if(user) {
    const isValid = await user.checkPassword(password)
    if(isValid) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  } else {
    return done(null, false)
  }
}))

const index = (req, res) => {
  res.render('login')
}

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

const roles = async (req, res) => {
  if(req.isAuthenticated()) {
    if(req.user.roles.indexOf(req.params.role)>=0) {
      req.session.role = req.params.role
    }
  }
  res.redirect('/')
}

module.exports = {
  index,
  logout,
  roles
}