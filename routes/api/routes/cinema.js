var express = require('express')
var router = express.Router()

let user = [{name: 'Nhat', id: '123456'}]

router.get('/', function (req, res, next) {
  res.send(user)
})

router.post('/', function (req, res, next) {
  user.push(req.body)
  res.send({status: 200, message: 'Success'})
})

module.exports = router
