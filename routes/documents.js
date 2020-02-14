var express = require('express')
var multer = require('multer')
var aws = require('aws-sdk')
var uuid = require('uuid/v4')
var ftype = require('file-type')
var fs = require('fs')
var archiver = require('archiver')
var router = express.Router()

var doc = require('../models/document')

var s3 = new aws.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	sslEnabled: true,
})

var upload = multer({
	storage: multer.memoryStorage(),
})

router
	.route('/')
	.get(async (req, res) => {
		let ownDocs = await doc
			.find({ owner: req.session.user._id })
			.sort('-dated')
			.select('title dated fileId locked')
		let sharedDocs = await doc
			.find({ sharedWith: req.session.user._id })
			.sort('-dated')
			.select('title dated fileId locked owner')

		res.render('index', {
			title: 'Dashboard',
			docs: { own: ownDocs, shared: sharedDocs },
		})
	})
	.post(upload.array('documents'), async (req, res) => {
		try {
			let uid = uuid()
			let filetype = await ftype.fromBuffer(req.files[0].buffer)

			let uploadedFile = new doc({
				title: req.body.title,
				created: req.body.dated,
				fileId: uid,
				owner: req.session.user._id,
				mime: filetype.mime,
				ext: filetype.ext,
			})

			await uploadedFile.save()

			req.files.forEach(async (file, index) => {
				await fs.writeFile(
					'./helper/files/' + uid + '/' + index + '.' + filetype.ext,
					file.buffer,
					() => {}
				)

				let upload = s3
					.upload({
						Bucket: process.env.AWS_BUCKET_NAME,
						Key: uid + '/' + index,
						Body: file.buffer,
						ContentType: filetype.mime,
					})
					.promise()

				upload
					.then(() => {
						return true
					})
					.catch(e => {
						throw new Error(e)
					})
			})
			req.flash('success', `Uploaded ${req.files.length} files`)
			res.status(200).redirect('/documents')
		} catch (error) {
			console.log(error)
			req.flash('warn', "Couldn't upload files")
			res.redirect('/documents')
		}
	})

router.get('/upload', function(req, res) {
	res.render('upload', { title: 'Upload' })
})

router.route('/delete/:fileid').get(async (req, res) => {
	try {
		let result = await doc.deleteOne({ fileId: req.params.fileid })

		await emptyS3Directory(process.env.AWS_BUCKET_NAME, req.params.fileid)

		let deletePromise = s3
			.deleteObject({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: req.params.fileid,
			})
			.promise()

		deletePromise
			.then(() => {
				req.flash('success', 'File(s) deleted')
				res.redirect('/documents')
			})
			.catch(e => {
				throw e
			})
	} catch (error) {
		console.log(error)
		req.flash('warn', "Couldn't delete file(s)")
		res.redirect('/documents')
	}
})

router.route('/checkout/:fileid').get(async (req, res) => {
	let file = await doc
		.findOne({ fileId: req.params.fileid })
		.populate('owner')
		.populate('sharedWith')
	//check permissions
	if (
		!(
			req.session.user.username == file.owner.username ||
			file.sharedWith.includes(req.session.user)
		)
	) {
		req.flash('warn', 'Not allowed to checkout')
		res.redirect(req.originalUrl)
	} else {
		file.lockedBy = req.session.user
		await file.save()

		res.writeHead(200, {
			'Content-Type': 'application/zip',
			'Content-disposition': 'attachement; filename=files.zip',
		})

		let objects = await s3
			.listObjects({
				Bucket: process.env.AWS_BUCKET_NAME,
				Prefix: req.params.fileid,
			})
			.promise()

		const promises_list = objects.Contents.map(el => {
			return el
		})

		await Promise.all(promises_list)

		const promises_data = promises_list.map(el => {
			return s3
				.getObject({
					Bucket: process.env.AWS_BUCKET_NAME,
					Key: el.Key,
				})
				.promise()
		})

		await Promise.all(promises_data)

		let zip = await archiver('zip')

		promises_data.forEach((data, i) => {
			zip.append(data.Body, {
				name: file.fileId + '-' + i + '.' + file.extension,
			})
		})

		await zip.pipe(res)

		zip.finalize()
	}
})

router.route('/:fileid').get(async (req, res) => {
	let result = await doc
		.findOne({ fileId: req.params.fileid })
		.populate('owner')
		.populate('lockedBy')
		.populate('sharedWith')
	res.render('single_view', { title: 'Document View', doc: result })
})

// HELPER FUNC
async function emptyS3Directory(bucket, dir) {
	const listParams = {
		Bucket: bucket,
		Prefix: dir,
	}

	const listedObjects = await s3.listObjectsV2(listParams).promise()

	if (listedObjects.Contents.length === 0) return

	const deleteParams = {
		Bucket: bucket,
		Delete: { Objects: [] },
	}

	listedObjects.Contents.forEach(({ Key }) => {
		deleteParams.Delete.Objects.push({ Key })
	})

	await s3.deleteObjects(deleteParams).promise()

	if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir)
}

module.exports = router
