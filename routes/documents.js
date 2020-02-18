var express = require('express')
var multer = require('multer')
var aws = require('aws-sdk')
var uuid = require('uuid/v4')
var ftype = require('file-type')
var fs = require('fs')
var archiver = require('archiver')
var router = express.Router()

var doc = require('../models/document')
var user = require('../models/user')

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
			.populate('owner')
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

			req.files.forEach(async (file, index) => {
				await fs.writeFile(
					'./helper/files/' + uid + '/' + index + '.' + filetype.ext,
					file.buffer,
					() => {}
				)

				await uploadToS3Directory(
					process.env.AWS_BUCKET_NAME,
					uid,
					file.buffer,
					filetype.mime,
					index
				)
			})

			let uploadedFile = new doc({
				title: req.body.title,
				created: req.body.dated,
				fileId: uid,
				owner: req.session.user._id,
				mime: filetype.mime,
				extension: filetype.ext,
				log: [],
			})

			uploadedFile.log.push({
				message: 'Document created',
				user: req.session.user._id,
			})
			uploadedFile.log.push({
				message: req.body.comment,
				user: req.session.user._id,
			})

			await uploadedFile.save()

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
		await doc.deleteOne({ fileId: req.params.fileid })

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

router
	.route('/checkout/:fileid')
	.get(async (req, res) => {
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
			file.locked = true
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

			let zip = await archiver('zip')

			await Promise.all(
				objects.Contents.map(async ({ Key }, i) => {
					let downloadedFile = await s3
						.getObject({
							Bucket: process.env.AWS_BUCKET_NAME,
							Key: Key,
						})
						.promise()

					await zip.append(downloadedFile.Body, {
						name: file.fileId + '-' + i + '.' + file.extension,
					})
				})
			)

			await zip.pipe(res)

			zip.finalize()
		}
	})
	.post(upload.array('documents'), async (req, res) => {
		try {
			let file = await doc.findOne({ fileId: req.params.fileid })

			await emptyS3Directory(process.env.AWS_BUCKET_NAME, req.params.fileid)

			req.files.forEach((f, index) => {
				uploadToS3Directory(
					process.env.AWS_BUCKET_NAME,
					file.fileId,
					f.buffer,
					file.mime,
					index
				)
			})

			req.flash('success', `Uploaded ${req.files.length} files`)
			res.redirect(req.originalUrl)
		} catch (error) {
			req.flash('warn', 'Couldn`t upload files')
			res.redirect(req.originalUrl)
		}
	})

router.route('/share/:fileid').post(async (req, res) => {
	let fileid = req.params.fileid
	let document = await doc.findOne({ fileId: fileid }).populate('owner')
	let sharedUser = await user.findOne({ username: req.body.shareUsername })

	if (req.session.user.username == document.owner.username) {
		document.sharedWith.push(sharedUser._id)
		await document.save()
	} else if (req.session.user.username == req.body.shareUsername) {
		req.flash('warn', "Can't share with yourself")
	} else {
		req.flash('warn', 'You are not the owner')
	}

	res.redirect('/documents/' + fileid)
})

router.route('/:fileid').get(async (req, res) => {
	let result = await doc
		.findOne({ fileId: req.params.fileid })
		.populate('owner')
		.populate('lockedBy')
		.populate('sharedWith')
		.populate('log.user')
	res.render('single_view', { title: 'Document View', doc: result })
})

// HELPER FUNC

/**
 * Empties the directory on the given AWS S3 Bucket.
 * @param {String} bucket
 * @param {String} dir
 */
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

/**
 * Uploads all files in @param files to the Bucket and into the directory
 * @param {String} bucket
 * @param {String} dir
 * @param {Buffer} files
 * @param {String} mime
 * @param {Number} index
 */
async function uploadToS3Directory(bucket, dir, data, mime, index) {
	let upload = s3
		.upload({
			Bucket: bucket,
			Key: dir + '/' + index,
			Body: data,
			ContentType: mime,
		})
		.promise()

	upload
		.then(() => {
			return true
		})
		.catch(e => {
			throw new Error(e)
		})
}

module.exports = router
