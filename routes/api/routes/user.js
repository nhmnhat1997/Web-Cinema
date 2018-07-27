var express = require('express')
var router = express.Router()
const userController = require('../controllers/userController')
const fileUpload = require('express-fileupload')

router.use(fileUpload())
router.get('/:id', userController.getUser)

router.put('/:id', userController.editInfo)

router.put('/:id/change-password', userController.changePassword)

router.put('/:id/change-avatar', userController.changeAvatar)

module.exports = router
