const express = require('express')
const Noticias = require('../models/noticia')

const admin = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

const noticias = async (req, res) => {
  if(req.user.roles.indexOf('admin')>=0) {
    const noticias = await Noticias.find({})
    res.render('noticias/admin', { noticias })
  } else {
    res.redirect('/')
  }
}

module.exports = {
  admin,
  noticias
}