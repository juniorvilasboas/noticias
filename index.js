const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

const User = require('./models/user')
const pages = require('./routes/pages')
const auth = require('./routes/auth')
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

app.use((req, res, next) => {
  if('user' in req.session) {
    res.locals.user = req.session.user
  }
  next()
})

app.use('/restrito', (req, res, next) => {
  if('user' in req.session) {
    return next()
  }
  res.redirect('/login')
})

app.use('/noticias', noticias)
app.use('/restrito', restrito)
app.use('/', auth)
app.use('/', pages)


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