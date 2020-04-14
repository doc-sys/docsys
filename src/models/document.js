let mongoose = require('mongoose')
let storageEngine = require(`../storage/adapters/${process.env.STORAGE_ENGINE}`)

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
	pages: [
		{
			fileHash: { type: String, required: true },
			index: { type: Number },
		},
	],
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

document.methods.addFile = function (buffer, page) {
	page
		? storageEngine.add(page, buffer)
		: storageEngine.add(this.pages.length(), buffer)
}

document.methods.getFile = function () {
	return storageEngine.get(this.fileId)
}

document.post('remove', function (doc) {
	storageEngine.delete(doc._id)
})

module.exports = mongoose.model('Doc', document)
