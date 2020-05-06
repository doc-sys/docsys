let mongoose = require('mongoose')

let file = new mongoose.Schema({
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
		required: true,
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
	fileStorageId: String,
	log: [
		{
			timestamp: {
				type: Date,
				default: Date.now(),
			},
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			message: {
				type: String,
				required: true,
			},
		},
	],
})

var handleE11000 = function (error, res, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(new Error('File already exists'))
	} else {
		next()
	}
}

file.post('save', handleE11000)
file.post('update', handleE11000)
file.post('findOneAndUpdate', handleE11000)
file.post('insertMany', handleE11000)

module.exports = { File: mongoose.model('File', file) }
