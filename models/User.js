var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({ // TODO: chuyenCan cho nhan vien
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  }
}, { usePushEach: true })

mongoose.model('User', UserSchema)
