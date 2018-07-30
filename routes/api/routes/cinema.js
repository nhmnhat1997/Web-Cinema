var express = require('express')
var router = express.Router()
const fileUpload = require('express-fileupload')
var responseStatus = require('../../../configs/responseStatus')
var config = require('../../../configs/config')
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose')
var User = mongoose.model('User')
const cinemaController = require('../controllers/cinemaController')

router.use(fileUpload())
router.post('/', checkAuthentication, cinemaController.createFilm)

router.get('/', cinemaController.getFilms)

router.get('/:id', cinemaController.getFilm)

function checkAuthentication (req, res, next) {
  if (req.headers['x-access-token']) {
    isLogined(req.headers['x-access-token'])
      .then(() => {
        return next()
      })
      .catch(error => {
        res.status(error.status).send(error)
      })
  } 
  else if (req.session.user) {
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
