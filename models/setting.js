let mongoose = require('mongoose')

let setting = new mongoose.Schema({
	language: {
		type: String,
		default: 'en',
	},
})

module.exports = mongoose.model('Setting', setting)
