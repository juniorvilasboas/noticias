const express = require('express')
const Noticias = require('../models/noticia')

const index = (req, res) => {
  res.send('Restrito')
}

const noticias = async (req, res) => {
  const noticias = await Noticias.find({ category: 'private' })
  res.render('noticias/restrito', { noticias })
}

module.exports = {
  index,
  noticias
}