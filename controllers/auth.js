const express = require('express')
const User = require('../models/user')

const index = (req, res) => {
  res.render('login')
}

const login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if(user) {
    const isValid = await user.checkPassword(req.body.password)
    if(isValid) {
      req.session.user = user
      req.session.role = user.roles[0]
      res.redirect('/noticias/restrito')
    } else {
      res.redirect('/login')
    }
  } else {
    res.redirect('/login')
  }
}

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

const roles = async (req, res) => {
  if('user' in req.session) {
    if(req.session.user.roles.indexOf(req.params.role)>=0) {
      req.session.role = req.params.role
    }
  }
  res.redirect('/')
}

module.exports = {
  index,
  login,
  logout,
  roles
}