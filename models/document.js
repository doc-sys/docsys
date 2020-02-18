let mongoose = require('mongoose')

let document = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	created: {
		type: Date,
		default: Date.now(),
	},
	dated: {
		type: Date,
	},
	content: {
		type: String,
	},
	keywords: {
		type: [String],
		minlength: 3,
	},
	fileId: {
		type: String,
		unique: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: false,
	},
	sharedWith: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: [],
		},
	],
	lockedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: null,
	},
	locked: {
		type: Boolean,
		default: false,
	},
	mime: {
		type: String,
	},
	extension: {
		type: String,
	},
})

/* document.pre('save', async function(next) {
    try {
        let ocr = await getOCR(this.fileId)
        let keywords = await getKeywords(ocr)
    } catch (error) {
        next(error)
    }
    this.content = ocr
    this.keywords = keywords
}) */

document.pre('save', async function(next) {
	console.log('DOING OCR ETC')
	next()
})

module.exports = mongoose.model('Doc', document)
