var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload' })
})

module.exports = router
