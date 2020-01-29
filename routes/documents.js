var express = require('express')
var multer = require('multer')
var aws = require('aws-sdk')
var uuid = require('uuid/v4')
var ftype = require('file-type')
var fs = require('fs')
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
  .post(upload.array('documents'), async (req, res) => {
    try {
      req.files.forEach(async (file) => {
        let uid = uuid();
        let filetype = await ftype.fromBuffer(file.buffer)
  
        await fs.writeFile('./helper/files/' + uid + '.' + filetype.ext, file.buffer, () => {})
  
        let uploadedFile = new doc({
          title: req.body.title,
          created: req.body.dated,
          fileId: uid,
          //owner: req.session.userId | 'FELIX',
          mime: filetype.mime,
          ext: filetype.ext
    })
  
        //uploadedFile.save()
  
        let uploadPromise = s3.upload({
          Bucket: 'docsys',
          Key: uid,
          Body: file.buffer,
          ContentType: filetype.mime
        }).promise()

        uploadPromise.then(() => {
    req.flash('success', `Uploaded ${req.files.length} files`)
          res.status(200).redirect('/upload')      
        }).catch((error) => {
          req.flash('success', 'Couldn\'t upload files')
          console.log(error)
          res.status(501).redirect('/upload')
        })
      })
    } catch (error) {
      req.flash('success', 'Couldn\'t upload files')
      console.log(error)
      res.status(501).redirect('/upload')
    }
  })

router.route('/:id')
  .get()
  .delete()
  .put()

module.exports = router
