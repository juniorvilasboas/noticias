const express = require('express')
const Noticias = require('../models/noticia')

const restrito = (req, res, next) => {
  if('user' in req.session) {
    return next()
  }
  res.redirect('/login')
}

const noticias = async (req, res) => {
  if(req.session.role.indexOf('restrito')>=0) {
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