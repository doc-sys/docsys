var express = require('express')
var multer = require('multer')
var stream = require('stream')
var aws = require('aws-sdk')
var uuid = require('uuid/v4')
var router = express.Router()

var doc = require('../models/document')

var s3 = new aws.S3({
  accessKeyId: 'AKIAVAYX5NO5MZHI3ZH6',
  secretAccessKey: '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',
  sslEnabled: true
})

var upload = multer({ 
  storage: multer.memoryStorage()
})

router.route('/')
  .post(upload.array('documents'), (req, res) => {
    req.files.forEach(file => {
      console.log(file)
    })
    req.flash('success', `Uploaded ${req.files.length} files`)
    res.redirect('/')
  })

router.route('/:id')
  .get()
  .delete()
  .put()

module.exports = router
