'use strict'

var passport = require('passport')
var mongoose = require('mongoose')
const config = require('./config')
var User = mongoose.model('User')
// var constants = require('./constants')
var jwt = require('jsonwebtoken')
var responseStatus = require('./responseStatus')
const authController = require('../routes/api/controllers/authController')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy

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
    },
    passport.use(new FacebookStrategy({
      clientID: '893876184132708',
      clientSecret: '1250f3ec2316b80e5719aa2791ba657f',
      callbackURL: "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile)
      User.findOne({ email: profile.emails[0].value }, async function(err, user) {
        if (err) { return done(err); }
        if (user){
          var token = jwt.sign({ email: user.profile.emails[0].value }, config.secret, {
            expiresIn: config.expireIn
          })
          return done(null, true, {
            user: user,
            token: token
          })
        }
        if (!user){
          let newUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            providerId: profile.id,
            avatarURL: profile.photos ? profile.photos[0].value : '',
            provider: 'facebook'
          }
          let dataReturn = await authController.signUpForSocial(newUser)
          done(null, user, dataReturn);
        }
        
      });
    }
  ));
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
