var express = require('express')
var router = express.Router()
var cinema = require('./api/routes/cinema')

router.use('/api/cinema', cinema)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/phim/tao-phim', function (req, res, next) {
  res.render('cinema/create', { title: 'Express' })
})

router.get('/users', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/signin', function (req, res, next) {
  res.render('signin', { title: 'Express' })
})

module.exports = router
