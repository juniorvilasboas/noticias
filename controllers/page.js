const express = require('express')

const index = (req, res) => {
  res.render('index')
}

module.exports = {
  index
}