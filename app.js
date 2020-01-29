var createError   = require('http-errors')
var express       = require('express')
var path          = require('path')
var cookieParser  = require('cookie-parser')
var bodyParser    = require('body-parser')
var logger        = require('morgan')
var session       = require('express-session')
var flash         = require('express-flash')
var mongoose      = require('mongoose')

require('dotenv').config()

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var adminRouter = require('./routes/admin')
var docRouter   = require('./routes/documents')

var app = express()
mongoose.connect(process.env.DB_PATH, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useCreateIndex', true)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(session({ cookie: { maxAge: 6000 }, secret: 'testsec12', resave: false, saveUninitialized: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser('testsec12'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/admin', adminRouter)
app.use('/documents', docRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
