var express = require('express')
var multer = require('multer')
let sharp = require('sharp')
var router = express.Router()

var user = require('../models/user')

var upload = multer({
	storage: multer.memoryStorage(),
})

router
	.route('/')
	.get(async (req, res) => {
		res.render('settings', { title: 'Settings' })
	})
	.post(upload.single('avatar'), async (req, res) => {
		let thisUser = user.findOne({ _id: req.session.user._id })

		if (typeof req.file != 'undefined') {
			let avatar = await sharp(req.file.buffer)
				.resize(64, 64)
				.toBuffer()
			thisUser.avatar = avatar.toString('base64')
			req.flash('success', 'Avatar saved')
		}

		thisUser.settings.language = req.body.language
		await thisUser.save()

		res.redirect('/settings')
	})

module.exports = router
