var express = require('express')
var router = express.Router()

const user = require('../models/user')
const doc = require('../models/document')

router.get('/autocomplete', async (req, res) => {
	res.json(await user.find().select('username settings.displayName'))
})

module.exports = router
