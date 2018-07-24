var express = require('express')
var router = express.Router()
var cinema = require('./api/routes/cinema')
var mongoose = require('mongoose')
const Film = mongoose.model('Film')

router.use('/api/cinema', cinema)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Trang chủ' })
})

router.get('/phim/tao-phim', function (req, res, next) {
  res.render('cinema/create', { title: 'Tạo phim' })
})
router.get('/phim/:id', async function (req, res, next) {
  try {
    console.log(req.params)
    let film = await Film.findById(req.params.id)
    res.render('cinema/detail', {title: film.name, filmId: film._id})
  } catch (error) {
    console.log(error)
  }
})

router.get('/users', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/signin', function (req, res, next) {
  res.render('signin', { title: 'Express' })
})

module.exports = router
