const express = require('express')
const restritoController = require('../controllers/restrito')
const router = express.Router()

router.use(restritoController.restrito)
router.get('/', restritoController.index)
router.get('/noticias', restritoController.noticias)

module.exports = router