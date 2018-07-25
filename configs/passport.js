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
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, email, password, done) {
      User.findOne({ email: email }).exec(function (err, user) {
        if (err) {
          return done(responseStatus.Code500(), false)
        }
        if (!user) {
          return done(responseStatus.Code404({ errorMessage: responseStatus.WRONG_EMAIL_OR_PASSWORD }), false)
        }
        if (!user.authenticate(password)) {
          return done(responseStatus.Code401({ errorMessage: responseStatus.WRONG_EMAIL_OR_PASSWORD }), false)
        }
        var token = jwt.sign({ email: user.email }, config.secret, {
          expiresIn: config.expireIn
        })

        return done(null, true, {
          user: user,
          token: token
        })
      })
    }
  ))

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
