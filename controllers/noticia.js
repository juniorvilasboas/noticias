const express = require('express')
const Noticia = require('../models/noticia')

const index = async (req, res) => {
  const noticias = await Noticia.find({ category: 'public'})
  res.render('noticias/index', { noticias })
}

module.exports = {
  index
}