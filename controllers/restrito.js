const express = require('express')
const Noticias = require('../models/noticia')

const restrito = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

const noticias = async (req, res) => {
  if(req.user.roles.indexOf('restrito')>=0) {
    const noticias = await Noticias.find({ category: 'private' })
    res.render('noticias/restrito', { noticias })
  } else {
    res.redirect('/')
  }
}

module.exports = {
  noticias,
  restrito
}