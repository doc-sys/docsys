var express = require('express')
var multer = require('multer')
let sharp = require('sharp')
var router = express.Router()

var user = require('../models/user')
var setting = require('../models/setting')

var upload = multer({
	storage: multer.memoryStorage(),
})

router
	.route('/')
	.get(async (req, res) => {
		let userSettings = await user
			.findOne({ _id: req.session.user._id })
			.populate('settings')
			.select('settings')
		res.render('settings', { title: 'Settings', settings: userSettings })
	})
	.post(upload.single('avatar'), async (req, res) => {
		if (typeof req.file != 'undefined') {
			let avatar = await sharp(req.file.buffer)
				.resize(64, 64)
				.toBuffer()
			let thisUser = await user.findOne({ _id: req.session.user._id })
			thisUser.avatar = avatar.toString('base64')
			await thisUser.save()
			req.flash('success', 'Avatar saved')
		}
		res.redirect('/settings')
	})

router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' })
})

module.exports = router
