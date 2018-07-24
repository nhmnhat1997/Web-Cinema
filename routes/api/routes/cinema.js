var express = require('express')
var router = express.Router()
const cinemaController = require('../controllers/cinemaController')

router.post('/', cinemaController.createFilm)

router.get('/', cinemaController.getFilms)

router.get('/:id', cinemaController.getFilm)

module.exports = router
