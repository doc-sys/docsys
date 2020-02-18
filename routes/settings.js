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
		let thisUser = await user.findOne({ _id: req.session.user._id })

		if (typeof req.file != 'undefined') {
			let avatar = await sharp(req.file.buffer)
				.resize(64, 64)
				.toBuffer()
			thisUser.avatar = avatar.toString('base64')
			req.flash('success', 'Avatar saved')
		}

		thisUser.settings.language = req.body.language
		thisUser.settings.displayName =
			req.body.displayName || thisUser.settings.displayName
		await thisUser.save()

		req.setLocale(thisUser.settings.language)

		req.session.user = thisUser

		res.redirect('/settings')
	})

module.exports = router
