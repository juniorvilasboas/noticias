const express = require('express')
const noticiaController = require('../controllers/noticia')
const restritoController = require('../controllers/restrito')
const adminController = require('../controllers/admin')

const router = express.Router()

router.get('/', noticiaController.index)

router.use('/restrito', restritoController.restrito)
router.get('/restrito', restritoController.noticias)

router.use('/admin', adminController.admin)
router.use('/admin', adminController.noticias)

module.exports = router