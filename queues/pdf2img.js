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
