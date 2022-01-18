const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const User = require('./models/user')

mongoose.Promise = global.Promise

const app = express()
const port = process.env.PORT || 3000
const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => res.render('index'))

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