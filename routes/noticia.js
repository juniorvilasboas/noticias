const express = require('express')
const noticiaController = require('../controllers/noticia')

const router = express.Router()

router.get('/', noticiaController.index)

module.exports = router