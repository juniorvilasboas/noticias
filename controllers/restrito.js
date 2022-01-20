const express = require('express')
const Noticias = require('../models/noticia')

const restrito = (req, res, next) => {
  if('user' in req.session) {
    return next()
  }
  res.redirect('/login')
}

const index = (req, res) => {
  res.send('Restrito')
}

const noticias = async (req, res) => {
  const noticias = await Noticias.find({ category: 'private' })
  res.render('noticias/restrito', { noticias })
}

module.exports = {
  index,
  noticias,
  restrito
}