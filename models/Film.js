var mongoose = require('mongoose')
var Schema = mongoose.Schema

var FilmSchema = new Schema({ // TODO: chuyenCan cho nhan vien
  name: {
    type: String,
    default: ''
  },
  genre: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: Number,
    default: 0
  },
  content: {
    type: String,
    default: ''
  },
  createdDate: {
    type: Number,
    default: 0
  },
  creatorId: {
    type: String,
    default: ''
  }
}, { usePushEach: true })

mongoose.model('Film', FilmSchema)
