var mongoose = require('mongoose')
const responseStatus = require('../../../configs/responseStatus')
const User = mongoose.model('User')

async function getUser (req, res, next) {
  try {
    console.log(req.params)
    let user = await User.findById(req.params.id)
    res.send(responseStatus.Code200({ user: user }))
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

module.exports = {
  getUser: getUser
}
