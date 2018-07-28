var express = require('express')
var router = express.Router()
const userController = require('../controllers/userController')
var mongoose = require('mongoose')
const config = require('../../../configs/config')
const responseStatus = require('../../../configs/responseStatus')
var jwt = require('jsonwebtoken')
const User = mongoose.model('User')
const fileUpload = require('express-fileupload')

router.use(fileUpload())
router.get('/:id', userController.getUser)

router.put('/:id', checkAuthentication, userController.editInfo)

router.put('/:id/change-password', checkAuthentication, userController.changePassword)

router.put('/:id/change-avatar', checkAuthentication, userController.changeAvatar)

function checkAuthentication (req, res, next) {
  if (req.headers['x-access-token']) {
    isLogined(req.headers['x-access-token'])
      .then(() => {
        return next()
      })
      .catch(error => {
        res.status(error.status).send(error)
      })
  } else if (req.session.user) {
    return next()
  } else {
    res.status(401).send(responseStatus.Code401({ errorMessage: responseStatus.INVALID_REQUEST }))
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
