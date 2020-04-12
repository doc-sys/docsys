var express = require('express')
var router = express.Router()

const user = require('../models/user')
const doc = require('../models/document')

router.get('/session', (req, res) => {
	res.send(req.session.user)
})

router.get('/db_user', async (req, res) => {
	res.send(await user.find())
})

router.get('/db_docs', async (req, res) => {
	res.send(await doc.find())
})

router.get('/clear', async (req, res) => {
	await user.remove()
	await doc.remove()

	res.send('cleaned')
})

module.exports = router
