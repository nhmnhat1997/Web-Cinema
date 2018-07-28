var express = require('express')
var router = express.Router()
const userController = require('../controllers/userController')
const fileUpload = require('express-fileupload')

router.use(fileUpload())
router.get('/:id', userController.getUser)

router.put('/:id', userController.editInfo)

router.put('/:id/change-password', userController.changePassword)

router.put('/:id/change-avatar', userController.changeAvatar)

function checkAuthentication (req, res, next) {
  if (req.headers['x-access-token']) {
    isLogined(req.headers['x-access-token'])
      .then(() => {
        console.log(req.headers['x-access-token'])
        return next()
      })
      .catch(error => {
        res.status(error.status).send(error)
        console.log(error)
      })
  }
  if (req.session.user) {
    return next()
  } else {
    res.redirect('/')
  }
}

async function isLogined (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return reject(responseStatus.Code401({ errorMessage: responseStatus.INVALID_REQUEST }))
      }
      if (!decoded || !decoded.email) {
        return reject(responseStatus.Code401({ errorMessage: responseStatus.INVALID_REQUEST }))
      }
      console.log(decoded)
      const email = decoded.email
      User.findOne({ email: email }).exec((err, user) => {
        if (err) {
          return reject(responseStatus.Code500({ err: err }))
        }
        if (!user) {
          return reject(responseStatus.Code403({ errorMessage: responseStatus.INVALID_REQUEST }))
        }
        return resolve(responseStatus.Code200({ user: user }))
      })
    })
  })
}

module.exports = router
