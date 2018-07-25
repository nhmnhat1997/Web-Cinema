var express = require('express')
var router = express.Router()
var passport = require('../../../configs/passport').passport
var responseStatus = require('../../../configs/responseStatus')
const authController = require('../controllers/authController')

router.post('/signup', authController.signUp)

router.post('/signin', function (req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
    console.log(err, user, info)
    if (err) return res.send(err)
    if (!user) {
      return res.send(responseStatus.Code401({ errorMessage: responseStatus.WRONG_EMAIL_OR_PASSWORD }))
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

router.get('/signout', function (req, res) {
  delete req.session.user
  delete req.session.token
  return res.send(responseStatus.Code200())
})

module.exports = router
