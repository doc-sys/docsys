var express = require('express')
var router = express.Router()

const user = require('../models/user')

router.get('/autocomplete', async (req, res) => {
	res
		.status(200)
		.json(await user.find().select('username settings.displayName'))
})

module.exports = router
