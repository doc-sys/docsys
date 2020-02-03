var express = require('express')
var router = express.Router()

const user  = require('../models/user')
const doc   = require('../models/document')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

router.get('/session', (req, res) => {
  res.send(req.session.user)
})

router.get('/db_user', async (req, res) => {
  res.send(await user.find())
})

router.get('/db_docs', async (req, res) => {
  res.send(await doc.find())
})

module.exports = router
