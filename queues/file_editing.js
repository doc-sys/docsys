// OCR QUEUE

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

// CONVERSION QUEUE

/* const Queue = require('bee-queue')
const fs = require('fs')
const PDFImage = require('pdf-image').PDFImage
const conversionQueue = new Queue('pdfconversion', {
	isWorker: true,
	activateDelayedJobs: true,
})
const ocrQueue = new Queue('ocr')

conversionQueue.process(async function(job, done) {
	let path = './files/' + job.data.filename

	let pdfImage = new PDFImage(path)
	pdfImage
		.convertFile()
		.then(images => {
			console.log(images)
		})
		.catch(err => {
			console.error(err)
		})

	done(null, true)
}) */

const path = require('path')
const pdf = require('pdf-poppler')

let file = 'test.pdf'

let opts = {
	format: 'jpeg',
	out_dir: path.dirname(file),
	out_prefix: path.baseName(file, path.extname(file)),
	page: null,
}

pdf
	.convert(file, opts)
	.then(res => {
		console.log('Successfully converted')
	})
	.catch(error => {
		console.error(error)
	})
