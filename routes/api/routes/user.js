var express = require('express')
var router = express.Router()
const userController = require('../controllers/userController')

router.get('/:id', userController.getUser)

module.exports = router
