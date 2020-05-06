let mongoose = require('mongoose')

const conversation = new mongoose.Schema({
	convoId: {
		type: String,
		required: true,
		unique: true,
	},
	participants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	],
	lastMessage: {
		type: Date,
		default: () => Date.now(),
	},
	messages: [
		{
			from: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			content: { type: String, required: true },
			timestamp: { type: Date, default: () => Date.now() },
		},
	],
})

module.exports = { conversation: mongoose.model('Conversation', conversation) }
