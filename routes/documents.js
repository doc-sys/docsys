var express = require('express')
var multer = require('multer')
var multers3 = require('multer-s3')
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
  storage: multers3({
    s3: s3,
    bucket: 'docsys',
    metadata: (req, file, cb) => {
      cb(null, { fileName: file.originalname})
    },
    key: (req, file, cb) => {
      req.newName = uuid()
      cb(null, req.newName)
    }
  })
})

router.route('/')
  .post(upload.array('documents'), (req, res) => {
    req.files.forEach(file => {
      let upload = null
    })
    req.flash('success', `Uploaded ${req.files.length} files`)
    res.redirect('/')
  })

router.route('/:id')
  .get()
  .delete()
  .put()

module.exports = router
