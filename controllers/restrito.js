const index = (req, res) => {
  res.send('Restrito')
}

const noticias = (req, res) => {
  res.render('restrito/noticias')
}

module.exports = {
  index,
  noticias
}