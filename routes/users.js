var express = require('express')
var router = express.Router()

var user = require('../models/user')

/* GET users listing. */
router
	.route('/login')
	.post(async (req, res) => {
		try {
			let result = await user.getAuthenticated(
				req.body.username,
				req.body.password
			)

			result.password = ''

			req.session.user = result
			req.session.isAuthenticated = true

			res.setLocale(result.settings.language)

			if (typeof req.query.path != 'undefined') {
				res.redirect(decodeURIComponent(req.query.path))
			} else {
				res.redirect('/documents')
			}
		} catch (error) {
			req.flash('warn', `Following error occured - ${error}`)
			res.redirect('/user/login?path=' + req.query.path)
		}
	})
	.get(async (req, res) => {
		if (req.session.isAuthenticated) {
			res.redirect('/documents')
		} else {
			res.render('login', {
				query: req.query.path ? encodeURIComponent(req.query.path) : '',
			})
		}
	})

router
	.route('/signup')
	.get(async (req, res) => {
		if (req.session.isAuthenticated) {
			res.redirect('/documents')
		} else {
			res.render('signup')
		}
	})
	.post(async (req, res) => {
		let newUser = new user({
			username: req.body.username,
			password: req.body.password,
			mail: req.body.email,
			settings: {
				language: 'en',
				displayName: req.body.name,
			},
		})

		await newUser.save()
		req.session.user = newUser
		req.session.isAuthenticated = true

		res.redirect('/')
	})

router.get('/logout', async (req, res) => {
	await req.session.destroy()
	res.redirect('/')
})

module.exports = router
