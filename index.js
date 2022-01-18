const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

const User = require('./models/user')
const noticias = require('./routes/noticia')
const restrito = require('./routes/restrito')

mongoose.Promise = global.Promise
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session({
  secret: process.env.SESSION,
  resave: true,
  saveUninitialized: true
}))

app.use('/restrito', (req, res, next) => {
  if('user' in req.session) {
    return next()
  }
  res.redirect('/login')
})

app.use('/noticias', noticias)
app.use('/restrito', restrito)

app.get('/', (req, res) => res.render('index'))
app.get('/login', (req, res) => res.render('login'))
app.post('/login', async (req, res) => {
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

const createInitialUser = async () => {
  const total = await User.count({ username: 'moacyr' })
  if(total === 0) {
    const user = new User({
      username: 'moacyr',
      password: '12345'
    })
    await user.save()
    console.log('User created!')
  } else {
    console.log('User create skipped')
  }
}

mongoose
  .connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    createInitialUser()
    app.listen(port, () => {
      console.log('Listening on port: ' + port)
    })
  })
  .catch( e => {
    console.log(e)
  })