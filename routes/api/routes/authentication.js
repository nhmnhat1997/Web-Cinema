var express = require('express')
var router = express.Router()
var passport = require('../../../configs/passport').passport
var responseStatus = require('../../../configs/responseStatus')
const authController = require('../controllers/authController')

router.post('/signup', authController.signUp)

router.post('/signin', function (req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
    console.log(err, user, info)
    if (err) return res.status(err.status).send(err)
    if (!user) {
      return res.status(401).send(responseStatus.Code401({ errorMessage: responseStatus.WRONG_EMAIL_OR_PASSWORD }))
    }
    req.logIn(user, async function (err) {
      if (err) { return next(err) }
      req.session.token = info.token // TODO: remove req.session.token (dang nhap bang dien thoai)
      req.session.user = info.user

      return res.send(responseStatus.Code200({
        user: info.user,
        token: info.token
      }))
    })
  })(req, res, next)
})

router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', function (req, res, next) {
  passport.authenticate('facebook', function (err, user, info) {
    if (err) {
      console.log(err)
      return res.send({ errorMessage: err })
    }
    console.log(req.session.user)
    console.log(req.session.token)
    req.session.user = info.user
    req.session.token = info.token
    res.redirect('/')
  })(req, res, next)
})

router.get('/google', passport.authenticate('google', { scope:
  [ 'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read' ] }))
router.get('/google/callback', function (req, res, next) {
  passport.authenticate('google', function (err, user, info) {
    if (err) {
      console.log(err)
      return res.send({ errorMessage: err })
    }
    console.log(info.user)
    console.log(info.token)
    req.session.user = info.user
    req.session.token = info.token
    res.redirect('/')
  })(req, res, next)
})

router.get('/signout', function (req, res) {
  delete req.session.user
  delete req.session.token
  return res.send(responseStatus.Code200())
})

module.exports = router
