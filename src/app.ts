import { Request, Response, NextFunction } from 'express'
import { handleError, ErrorHandler } from './lib/helpers/error';

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

require('dotenv-defaults').config()

var indexRouter = require('./routes/index.route')
var usersRouter = require('./routes/user.route')
var docRouter = require('./routes/document.route')


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
	console.error(error.message)
	process.exit(1)
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
app.use(express.urlencoded({ extended: true }))

app.use('/user', usersRouter)
app.use('/document', docRouter)
app.use('/', indexRouter)

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err: ErrorHandler, req: Request, res: Response, next: NextFunction) {
	handleError(err, res)
})

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' })
})

module.exports = app
