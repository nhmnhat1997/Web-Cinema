var mongoose = require('mongoose')
const config = require('../../../configs/config')
const responseStatus = require('../../../configs/responseStatus')
var jwt = require('jsonwebtoken')
const User = mongoose.model('User')

async function signUp(req, res, next) {
  try {
    let userData = req.body
    console.log(userData)
    var email = userData.email
    let user = await User.findOne({ email: email })
    console.log(user)
    if (user) {
      throw (responseStatus.Code409({
        errorMessage: responseStatus.EXIST_EMAIL
      }))
    }
    if (!userData.name.trim()) {
      userData.name = userData.email
    }
    user = new User(userData)
    user.createdAt = Date.now()
    user.password = user.hashPassword(userData.password)
    if (user.email && !isEmailValid(user.email)) {
      throw (responseStatus.Code409({ errorMessage: responseStatus.EMAIL_FORMAT }))
    }
    user = await user.save()
    const token = jwt.sign({ phone: user.email, loggedInTimestamp: Date.now() }, config.secret, {
      expiresIn: config.expireIn
    })
    res.send(responseStatus.Code200({ user: user, token: token }))
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

function isEmailValid(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

module.exports = {
  signUp: signUp
}
