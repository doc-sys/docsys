var express = require('express')
var multer = require('multer')
let sharp = require('sharp')
var router = express.Router()

var user = require('../models/user')

var upload = multer({
	storage: multer.memoryStorage(),
})

router.route('/avatar').post(upload.single('file'), async (req, res) => {
	let thisUser = await user.findOne({ _id: req.user._id })

	if (typeof req.file != 'undefined') {
		let avatar = await sharp(req.file.buffer)
			.resize(64, 64)
			.toBuffer()
		thisUser.avatar = avatar.toString('base64')
	}

	thisUser.settings.language = req.body.language
	thisUser.settings.displayName =
		req.body.displayName || thisUser.settings.displayName
	await thisUser.save()

	res.status(200).json({ payload: { user: thisUser } })
})

module.exports = router
