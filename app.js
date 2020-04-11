var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
var flash = require('express-flash')
var compression = require('compression')
var helmet = require('helmet')
var mongoose = require('mongoose')
var i18n = require('i18n')
var fs = require('fs')
var jwt = require('jsonwebtoken')
var cors = require('cors')

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
	// eslint-disable-next-line no-console
	console.log('Connected to MongoDB')
})

// Production
//app.use(compression())
//app.use(helmet())

i18n.configure({
	locales: ['en', 'de'],
	directory: __dirname + '/locales',
	defaultLocale: 'en',
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// logging setup (check if using test env)
if (process.env.NODE_ENV !== 'test') {
	app.use(
		logger('[ :date[web] ] :method :url - :status in :response-time[3] ms', {
			skip: function (req, res) {
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
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// auth middleware
const authRequired = async (req, res, next) => {
	try {
		let token

		if (req.query.token) {
			token = req.query.token
		} else {
			let authHeader = req.headers.authorization
			token = authHeader.split(' ')[1]
		}

		let result = await jwt.verify(token, process.env.JWT_SECRET)
		req.user = result

		next()
	} catch (error) {
		res.status(500).json({ payload: { message: 'Unauthorized access' } })
	}
}

app.use('/user', usersRouter)
app.use('/admin', adminRouter)
app.use('/documents', authRequired, docRouter)
app.use('/settings', authRequired, settingsRouter)
app.use('/functions', authRequired, helperRouter)
app.use('/', indexRouter)

// error handler
app.use(function (err, req, res) {
	// reply with error
	res.status(err.status || 500)
	res.json({ payload: { message: err.message } })
})

module.exports = app
