var mongoose = require('mongoose')
const responseStatus = require('../../../configs/responseStatus')
const User = mongoose.model('User')
const path = require('path')

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

async function editInfo (req, res, next) {
  try {
    console.log(req.params)
    let user = await User.findById(req.params.id)
    console.log(req.body.name)
    user.name = req.body.name || user.name
    user = await user.save()
    console.log(user)
    res.send(responseStatus.Code200({ user: user }))
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

async function changePassword (req, res, next) {
  try {
    console.log(req.params)
    let user = await User.findById(req.params.id)
    console.log(req.body)
    let currentPass = req.body.currentPass
    if (!user.authenticate(currentPass)) {
      throw responseStatus.Code403({errorMessage: 'Mật khẩu hiện tại không đúng'})
    }
    user.password = user.hashPassword(req.body.newPass)
    user = await user.save()
    console.log(user)
    res.send(responseStatus.Code200({ user: user }))
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

async function changeAvatar (req, res, next) {
  try {
    console.log(req.files)
    let fileName
    let user = await User.findById(req.params.id)
    let currentAvatar = user.avatarURL
    if (req.files) {
      let file = req.files.file
      fileName = req.params.id + file.name
      await file.mv(path.join(__dirname, '../../../public/images/avatar/') + fileName)
    }
    // if (err) throw err
    let avatarURL = fileName ? '/images/avatar/' + fileName : currentAvatar
    user.avatarURL = avatarURL
    await user.save()
    console.log(avatarURL)
    res.send({ status: 200, message: 'Success' })
  } catch (error) {
    console.log(error)
    res.send({ status: 500, message: 'Error' })
  }
}

module.exports = {
  getUser: getUser,
  editInfo: editInfo,
  changePassword: changePassword,
  changeAvatar: changeAvatar
}
