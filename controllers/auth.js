const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const User = require('../models/user')

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
  clientID: '2040584456096050',
  clientSecret: '19e07bc6d7f3348b194112d12d92428b',
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
  clientID: '679414641501-8odcuclvid60qtiqso0im9ctcobe09vj.apps.googleusercontent.com',
  clientSecret: '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',
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