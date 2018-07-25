'use strict'

var passport = require('passport')
var mongoose = require('mongoose')
const config = require('./config')
var User = mongoose.model('User')
// var constants = require('./constants')
var jwt = require('jsonwebtoken')
var responseStatus = require('./responseStatus')
var LocalStrategy = require('passport-local').Strategy

function createPassportConfig (app) {
  passport.use(new LocalStrategy(
    {
      usernameField: 'phone',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, username, password, done) {
      if (username !== trimUsername(username)) {
        return done(responseStatus.Code404({ errorMessage: responseStatus.USER_NOT_FOUND }), false)
      } else {
        User.findOne({ phone: username }).populate('khuyenMais.khuyenMai').exec(function (err, user) {
          if (err) {
            return done(responseStatus.Code500(), false)
          }
          if (!user) {
            return done(responseStatus.Code404({ errorMessage: responseStatus.USER_NOT_FOUND }), false)
          }
          if (!user.authenticate(password)) {
            return done(responseStatus.Code401({ errorMessage: responseStatus.WRONG_PHONE_OR_PASSWORD }), false)
          }

          var token = jwt.sign({ phone: user.phone }, config.secret, {
            expiresIn: config.tokenExpire
          })

          return done(null, true, {
            user: user,
            token: token
          })
        })
      }
    }
  ))

  function trimUsername (name) {
    return name.replace(/[\s.,]/g, '')
  }

  passport.serializeUser(function (user, cb) {
    cb(null, user)
  })

  passport.deserializeUser(function (user, cb) {
    User.findOne({ email: user.email }, function (err, user) {
      if (err) { return cb(err) }
      cb(null, user)
    })
  })

  app.use(passport.initialize())
  app.use(passport.session())
}

module.exports = {
  createPassportConfig: createPassportConfig,
  passport: passport
}
