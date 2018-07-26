var express = require('express')
var router = express.Router()
var cinema = require('./api/routes/cinema')
var authentication = require('./api/routes/authentication')
var user = require('./api/routes/user')
var mongoose = require('mongoose')
const Film = mongoose.model('Film')

router.use('/api/cinema', cinema)
router.use('/api/auth', authentication)
router.use('/api/user', user)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Trang chủ', userId: req.session.user ? req.session.user._id : '' })
})

router.get('/phim/tao-phim', function (req, res, next) {
  res.render('cinema/create', { title: 'Tạo phim', userId: req.session.user ? req.session.user._id : '' })
})

router.get('/dangky', function (req, res, next) {
  res.render('cinema/signup', { title: 'Đăng ký' })
})

router.get('/dangnhap', function (req, res, next) {
  res.render('cinema/signin', { title: 'Đăng nhập' })
})

router.get('/user/:id', function (req, res, next) {
  res.render('cinema/profile', {title: 'Thông tin', userId: req.session.user ? req.session.user._id : ''})
})

router.get('/phim/:id', async function (req, res, next) {
  try {
    console.log(req.params)
    let film = await Film.findById(req.params.id)
    res.render('cinema/detail', {title: film.name, filmId: film._id, userId: req.session.user ? req.session.user._id : ''})
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
