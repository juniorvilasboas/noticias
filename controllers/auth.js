const User = require('../models/user')

const index = (req, res) => {
  res.render('login')
}

const login = async (req, res) => {
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
}

module.exports = {
  index,
  login
}