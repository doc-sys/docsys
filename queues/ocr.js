const Queue = require('bee-queue')
const fs = require('fs')
const mongoose = require('mongoose')

require('dotenv').config({ path: '../.env' })
const queue = new Queue('ocr', { isWorker: true })
mongoose.connect(process.env.DB_PATH)

let docs = require('../models/document')

queue.process(async function(job, done) {
	if (fs.existsSync('./files/' + job.data.filename)) {
		// PROCESS FILE WITH OCR
		console.log('PROCESS OCR')
		await fs.unlink('./files/' + job.data.filename)
	} else {
		console.log('NOT EXIST')
	}
	return done(null, true)
})
