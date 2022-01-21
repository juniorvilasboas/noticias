const express = require('express')
const dotenv = require('dotenv')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const User = require('../models/user')
dotenv.config()

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

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT,
  clientSecret: process.env.SECRET_FACEBOOK,
  callbackURL: 'http://localhost:3000/facebook/callback',
  profileFields: ['id', 'displayName', 'email', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
  const userDB = await User.findOne({ facebookId: profile.id })
  if (!userDB) {
    const user = new User({
      name: profile.displayName,
      facebookId: profile.id,
      roles: ['restrito']
    })
    await user.save()
    done(null, user)
  } else {
    done(null, userDB)
  }
}))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT,
  clientSecret: process.env.SECRET_GOOGLE,
  callbackURL: 'http://localhost:3000/google/callback'
}, async (accessToken, refreshToken, err, profile, done) => {
  const userDB = await User.findOne({ googleId: profile.id })
  if(!userDB) {
    const user = new User({
      name: profile.displayName,
      googleId: profile.id,
      roles: ['restrito']
    })
    await user.save()
    done(null, user)
  } else {
    done(null, userDB)
  }
}))

const index = (req, res) => {
  res.render('login')
}

const facebook = passport.authenticate('facebook')

const facebookCallback = ''

const google = passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile']})

const googleCallback = passport.authenticate('google', { failureRedirect: '/', successRedirect: '/'})

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

const changeRole = async (req, res) => {
  if(req.isAuthenticated()) {
    if(req.user.roles.indexOf(req.params.role)>=0) {
      req.session.role = req.params.role
    }
  }
  res.redirect('/')
}

module.exports = {
  index,
  facebook,
  facebookCallback,
  google,
  googleCallback,
  logout,
  changeRole
}