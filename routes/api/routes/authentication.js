var express = require('express')
var router = express.Router()
var passport = require('../../../configs/passport').passport
var responseStatus = require('../../../configs/responseStatus')
const authController = require('../controllers/authController')

router.post('/signup', authController.signUp)

router.post('/sign_in', function (req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
    if (err) return res.send(err)
    if (!user) {
      return res.send(responseStatus.Code401({ errorMessage: responseStatus.INVALID_ACCOUNT }))
    }
    objectReturnn.token = info.token
    req.logIn(user, async function (err) {
      if (err) { return next(err) }
      req.session.token = info.token // TODO: remove req.session.token (dang nhap bang dien thoai)
      req.session.user = info.user

      return res.send(responseStatus.Code200(objectReturnn))
    })
  })(req, res, next)
})


router.get('/sign_out', function (req, res) {
  const token = req.headers['x-access-token'] || req.session.token
  delete req.session.user
  delete req.session.token
  AuthService.isLogined(token)
    .then(resolve => {
      if (req.query.platform) {
        userController.deleteUserMobileToken(resolve.user.code, req.query.platform)
      }
      return res.send(responseStatus.Code200())
    })
    .catch(reject => { return res.send(responseStatus.Code200()) })
})

module.exports = router
