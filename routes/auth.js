const express = require('express')
const User = require('../models/user')

const router = express.Router()

router.get('/login', (req, res) => res.render('login'))
router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if(user) {
    const isValid = await user.checkPassword(req.body.password)
    if(isValid) {
      req.session.user = user
      res.redirect('/restrito/noticias')
    } else {
      res.redirect('/login')
    }
  } else {
    res.redirect('/login')
  }
})

module.exports = router