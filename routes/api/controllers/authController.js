var mongoose = require('mongoose')
const config = require('../../../configs/config')
const responseStatus = require('../../../configs/responseStatus')
var jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer')
var passwordGenerator = require('password-generator')
var ejs = require('ejs')
var crypto = require('crypto-js')
const User = mongoose.model('User')

async function signUp (req, res, next) {
  try {
    let userData = req.body
    var email = userData.email
    let user = await User.findOne({ email: email })
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
    user.password = User.hashPassword(userData.password)
    if (user.email && !isEmailValid(user.email)) {
      throw (responseStatus.Code409({ errorMessage: responseStatus.EMAIL_FORMAT }))
    }
    user = await user.save()
    const token = jwt.sign({ phone: user.email, loggedInTimestamp: Date.now() }, config.secret, {
      expiresIn: config.expireIn
    })
    res.send(responseStatus.Code200({ user: user, token: token }))
  } catch (error) {
    res.send(error)
  }
}

async function signUpForSocial (newUser) {
  try {
    let user = new User(newUser)
    user = await user.save()
    const token = jwt.sign({providerId: user.providerId}, config.secret, {
      expiresIn: config.expireIn
    })
    return (responseStatus.Code200({ user: user, token: token }))
  } catch (error) {
    return (error)
  }
}

async function sendResetPasswordMail (req, res, next) {
  try {
    let user = await User.findOne({email: req.body.email})
    if (!user) {
      throw (responseStatus.Code404({errorMessage: 'Không tìm thấy tài khoản. Vui lòng kiểm tra lại'}))
    }
    console.log(user)
    let newPass = passwordGenerator(6)
    user.password = hashPassword(req.body.email, newPass)
    await user.save()
    var smtpTransport = nodemailer.createTransport({
      service: 'Yahoo',
      auth: {
        user: 'nhmn040697@yahoo.com.vn',
        pass: 'jvngneihhwbeqqad'
      }
    })
    var content = ejs.render('<body style="font-family: Arial; font-size: 12px;"><div><p>Mật khẩu của bạn đã được đặt lại.</p><p>Mật khẩu mới của bạn là.</p><h2><%=newPass%></h2></div></body>', {newPass: newPass})
    var mailOptions = {
      to: req.body.email,
      from: 'nhmn040697@yahoo.com.vn',
      subject: 'Mật khẩu mới Cinema',
      html: content
    }
    smtpTransport.sendMail(mailOptions, function (err) {
      if (err) {
        console.log(err)
        throw err
      }
      res.send(responseStatus.Code200({message: 'Reset mật khẩu thành công.'}))
    })
  } catch (error) {
    console.log(error)
    return error
  }
}

function isEmailValid (email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

function hashPassword (email, password) {
  return crypto.AES.encrypt(password, email).toString()
}

module.exports = {
  signUp: signUp,
  signUpForSocial: signUpForSocial,
  sendResetPasswordMail: sendResetPasswordMail
}
