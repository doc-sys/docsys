var express = require('express')
var jwt = require('jsonwebtoken')
var router = express.Router()

var user = require('../models/user')

/* GET users listing. */
router.route('/login').post(async (req, res) => {
	try {
		let result = await user.getAuthenticated(
			req.body.username,
			req.body.password
		)

		result.avatar = null

		const token = await jwt.sign(result.toJSON(), process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES,
		})

		res.status(200).json({ payload: { user: result, token: token } })
	} catch (error) {
		res.status(401).json({ payload: { message: error.message } })
	}
})

router.route('/signup').post(async (req, res) => {
	try {
		let newUser = new user({
			username: req.body.username,
			password: req.body.password,
			mail: req.body.mail,
			settings: {
				language: 'en',
				displayName: req.body.displayName,
			},
		})

		console.log(newUser.toObject())

		const token = jwt.sign(newUser.toObject(), process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES,
		})

		await newUser.save()

		res.status(200).json({ payload: { user: newUser, token: token } })
	} catch (error) {
		console.log(error)
		res.status(500).json({ payload: { message: error.message } })
	}
})

// Commented until I know if this is neccessary for react
/* router.get('/logout', async (req, res) => {
	await req.session.destroy()
	res.redirect('/')
}) */

module.exports = router
