var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
var flash = require('express-flash')
var mongoose = require('mongoose')
var i18n = require('i18n')
var fs = require('fs')

require('dotenv').config()

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var adminRouter = require('./routes/admin')
var docRouter = require('./routes/documents')
var settingsRouter = require('./routes/settings')
var helperRouter = require('./routes/helper')

var app = express()
try {
	mongoose.connect(process.env.DB_PATH, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
} catch (error) {
	throw new Error(error)
}
mongoose.set('useCreateIndex', true)
mongoose.connection.on('open', () => {
	console.log('Connected to MongoDB')
})

i18n.configure({
	locales: ['en', 'de'],
	directory: __dirname + '/locales',
	defaultLocale: 'en',
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// logging setup
app.use(
	logger('[ :date[web] ] :method :url - :status in :response-time[3] ms', {
		skip: function(req, res) {
			return res.statusCode < 400
		},
	})
)
app.use(
	logger('[ :date[web] ] :method :url - :remote-addr', {
		stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
			flags: 'a',
		}),
	})
)

app.use(
	session({
		cookie: { maxAge: 60000000 },
		secret: 'testsec12',
		resave: true,
		saveUninitialized: true,
	})
)
app.use(i18n.init)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser('testsec12'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
app.locals.moment = require('moment')

// auth middleware
const authRequired = async (req, res, next) => {
	if (req.session.isAuthenticated) {
		res.locals.isAuthenticated = true
		res.locals.user = req.session.user
		next()
	} else {
		req.flash('warn', 'You need to be logged in')
		let url = encodeURIComponent(req.originalUrl)
		res.redirect('/user/login?path=' + url)
	}
}

app.use('/user', usersRouter)
app.use('/admin', adminRouter)
app.use('/documents', authRequired, docRouter)
app.use('/settings', authRequired, settingsRouter)
app.use('/functions', authRequired, helperRouter)
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app
