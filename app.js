var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const mongoose = require('mongoose')
var engine = require('ejs-locals')

// mongoose.connect('mongodb://localhost/cinema')
mongoose.connect('mongodb://admin:abc123@ds247171.mlab.com:47171/web-cinema-training', {
  useNewUrlParser: true
})

require('./models/Film')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs',engine)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

var indexRouter = require('./routes/index')
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
