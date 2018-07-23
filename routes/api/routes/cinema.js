var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const User = mongoose.model('User')

let user = [{name: 'Nhat', id: '123456'}]

router.get('/', function (req, res, next) {
  res.send(user)
})

router.post('/', async function (req, res, next) {
  try {
    user.push(req.body)
    let newUser = new User({
      name: req.body.name,
      email: req.body.email
    })
    await newUser.save()
    res.send({status: 200, message: 'Success'})
  } catch (error) {
    res.send({status: 500, messaeg: 'Error'})
  }
})

module.exports = router
