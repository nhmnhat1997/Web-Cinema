var express = require('express')
var router = express.Router()
var multipart = require('connect-multiparty');
const fileUpload = require('express-fileupload')
var multipartMiddleware = multipart();
const cinemaController = require('../controllers/cinemaController')

router.use(fileUpload())
router.post('/', cinemaController.createFilm)

router.get('/', cinemaController.getFilms)

router.get('/:id', cinemaController.getFilm)

module.exports = router
