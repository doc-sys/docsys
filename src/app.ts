import { Request, Response } from 'express'
import { handleError, ErrorHandler } from './lib/helpers/error';

import express from 'express';
import path from 'path';
import logger from 'morgan';

// eslint-disable-next-line no-unused-vars
import compression from 'compression';
// eslint-disable-next-line no-unused-vars
import helmet from 'helmet';
import mongoose from 'mongoose';
import fs from 'fs';
import cors from 'cors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv-defaults').config()

import indexRouter from './routes/index.route';
import usersRouter from './routes/user.route';
import docRouter from './routes/document.route';
import messageRouter from './routes/message.route';


const app = express()

try {
	mongoose.connect(
		process.env.NODE_ENV == 'test'
			? process.env.DB_PATH_TEST
			: process.env.DB_PATH,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: true
		}
	)
} catch (error) {
	// eslint-disable-next-line no-console
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

app.use(cors({ origin: '*' }))
// app.options('*', (req: Request, res: Response) => {
// 	res.header('Access-Control-Allow-Origin', '*')
// 	res.header('Access-Control-Allow-Methods', '*')
// 	res.header('Access-Control-Allow-Headers', '*')
// 	//res.header('Access-Control-Allow-Credentials', '*')
// 	console.log('PREFLIGHT')

// 	res.end()
// })
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', usersRouter)
app.use('/document', docRouter)
app.use('/message', messageRouter)
app.use('/', indexRouter)

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err: ErrorHandler, req: Request, res: Response) {
	handleError(err, res)
})

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' })
})

export default app
