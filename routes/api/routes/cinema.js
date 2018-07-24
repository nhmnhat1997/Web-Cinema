var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const Film = mongoose.model('Film')

router.post('/', async function (req, res, next) {
  try {
    let newFilm = new Film({
      name: req.body.name,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      content: req.body.content
    })
    console.log(newFilm)
    await newFilm.save()
    res.send({status: 200, message: 'Success'})
  } catch (error) {
    res.send({status: 500, messaeg: 'Error'})
  }
})

router.get('/', async function (req, res, next) {
  try {
    let newFilm = new Film({
      name: req.body.name,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      content: req.body.content
    })
    console.log(newFilm)
    await newFilm.save()
    res.send({status: 200, message: 'Success'})
  } catch (error) {
    res.send({status: 500, messaeg: 'Error'})
  }
})
module.exports = router
