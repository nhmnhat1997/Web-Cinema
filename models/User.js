var mongoose = require('mongoose')
var crypto = require('crypto-js')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  provider: {
    type: String,
    default: 'email'
  },
  providerId: {
    type: String,
    default: ''
  },
  avatarURL: {
    type: String,
    default: ''
  }
}, { usePushEach: true })

UserSchema.methods.hashPassword = function (password) {
  return crypto.AES.encrypt(password, this.email).toString()
}
UserSchema.methods.authenticate = function (password) {
  var bytes = crypto.AES.decrypt(this.password, this.email)
  var decryptedPass = bytes.toString(crypto.enc.Utf8)
  return password === decryptedPass
}

mongoose.model('User', UserSchema)
