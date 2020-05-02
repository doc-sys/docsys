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
	pageHashes: {
		type: [String],
		required: true,
	},
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

module.exports = { doc: mongoose.model('Doc', document) }
