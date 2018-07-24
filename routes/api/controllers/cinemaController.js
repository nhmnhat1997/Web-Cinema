var mongoose = require('mongoose')
const Film = mongoose.model('Film')

async function createFilm (req, res, next) {
  try {
    let newFilm = new Film({
      name: req.body.name,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      content: req.body.content,
      createdDate: Date.now()
    })
    console.log(newFilm)
    await newFilm.save()
    res.send({ status: 200, message: 'Success' })
  } catch (error) {
    res.send({ status: 500, message: 'Error' })
  }
}

async function getFilms (req, res, next) {
  try {
    let films = await Film.find()
    res.send({ film: films })
  } catch (error) {
    console.log(error)
    res.send({ status: 500, message: 'Error' })
  }
}

module.exports = {
  createFilm: createFilm,
  getFilms: getFilms
}
