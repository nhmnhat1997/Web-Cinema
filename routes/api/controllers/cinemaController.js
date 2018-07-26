var mongoose = require('mongoose')
const Film = mongoose.model('Film')

async function createFilm (req, res, next) {
  try {
    let data = {
      name: req.body.name,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      content: req.body.content,
      creatorId: req.body.creatorId,
      createdDate: Date.now()
    }
    if (!req.body._id) {
      let newFilm = new Film(data)
      console.log(newFilm)
      await newFilm.save()
    }
    else{
      delete data.createdDate
      console.log(data)
      await Film.findByIdAndUpdate(req.body._id, {$set: data})
    }
    res.send({ status: 200, message: 'Success' })
  } catch (error) {
    res.send({ status: 500, message: 'Error' })
  }
}

async function getFilms (req, res, next) {
  try {
    let films = await Film.find()
    res.send({ films: films })
  } catch (error) {
    console.log(error)
    res.send({ status: 500, message: 'Error' })
  }
}

async function getFilm (req, res, next) {
  try {
    let film = await Film.findById(req.params.id)
    res.send({ film: film })
  } catch (error) {
    console.log(error)
    res.send({ status: 500, message: 'Error' })
  }
}

module.exports = {
  createFilm: createFilm,
  getFilms: getFilms,
  getFilm: getFilm
}
