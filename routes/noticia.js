const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('noticias')
})

module.exports = router