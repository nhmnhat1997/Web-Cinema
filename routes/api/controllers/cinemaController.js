var mongoose = require('mongoose')
const Film = mongoose.model('Film')
const fs = require('fs')
const path = require('path')

async function createFilm (req, res, next) {
  try {
    console.log(req.files)
    let fileName
    if (req.files) {
      let file = req.files.file
      fileName = Date.now() + file.name
      await file.mv(path.join(__dirname, '../../../public/images/poster/') + fileName)
    }
    // if (err) throw err
    let data = {
      name: req.body.name,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      content: req.body.content,
      creatorId: req.body.creatorId,
      createdDate: Date.now(),
      posterURL: fileName ? '/images/poster/' + fileName : ''
    }
    console.log(data)

    if (!req.body._id) {
      let newFilm = new Film(data)
      console.log(newFilm)
      await newFilm.save()
    } else {
      delete data.createdDate
      if (!data.posterURL) {
        delete data.posterURL
      }
      console.log(data)
      await Film.findByIdAndUpdate(req.body._id, { $set: data })
    }
    res.send({ status: 200, message: 'Success' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: 500, message: error })
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
