var express = require('express')
var path = require('path')
var logger = require('morgan')

// eslint-disable-next-line no-unused-vars
var compression = require('compression')
// eslint-disable-next-line no-unused-vars
var helmet = require('helmet')
var mongoose = require('mongoose')
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
	mongoose.connect(
		process.env.NODE_ENV == 'test'
			? process.env.DB_PATH_TEST
			: process.env.DB_PATH,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
} catch (error) {
	throw new Error(error)
}
mongoose.set('useCreateIndex', true)

process.env.NODE_ENV === 'production'
	? app.use(compression()).use(helmet())
	: null

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
	res.status(err.status || 500).json({ payload: { message: err.message } })
})

module.exports = app
