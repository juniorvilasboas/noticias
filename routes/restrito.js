const express = require('express')

const router = express.Router()

router.get('/', (req, res) => res.send('Restrito'))
router.get('/noticias', (req, res) => res.send('Noticias restritas'))

module.exports = router