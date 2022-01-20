const express = require('express')
const Noticias = require('../models/noticia')

const admin = (req, res, next) => {
  if('user' in req.session) {
    return next()
  }
  res.redirect('/login')
}

const noticias = async (req, res) => {
  if(req.session.role.indexOf('admin')>=0) {
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