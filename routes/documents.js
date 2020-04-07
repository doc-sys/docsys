var express = require('express')
var multer = require('multer')
var aws = require('aws-sdk')
var uuid = require('uuid/v4')
var ftype = require('file-type')
var fs = require('fs').promises
var archiver = require('archiver')
/* const Queue = require('bee-queue')

const convertQueue = new Queue('pdfconversion', {
	activateDelayedJobs: true,
	redis: { url: process.env.REDIS_URL },
})
const ocrQueue = new Queue('ocr', { redis: process.env.REDIS_URL }) */

var router = express.Router()

// DELETE IN PROD!!!!!
let delay = require('express-delay')
router.use(delay(1000))

var doc = require('../models/document')
var user = require('../models/user')

const ALLOWED_FILETYPES = ['pdf', 'jpg', 'jpeg', 'png', 'tiff']

var s3 = new aws.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	sslEnabled: true,
})

var upload = multer({
	storage: multer.memoryStorage(),
})

router.get('/own', async (req, res) => {
	try {
		let ownDocs = await doc
			.find({ owner: req.user._id })
			.sort('-dated')
			.select('title dated fileId locked')

		res.status(200).json({ payload: ownDocs })
	} catch (e) {
		console.log(e)
	}
})

router.get('/shared', async (req, res) => {
	let sharedDocs = await doc
		.find({ sharedWith: req.user._id })
		.sort('-dated')
		.populate('owner')
		.select('title dated fileId locked owner.avatar')

	res.status(200).json({ payload: sharedDocs })
})

router
	.route('/')
	.get(async (req, res) => {
		let ownDocs = await doc
			.find({ owner: req.user._id })
			.sort('-dated')
			.select('title dated fileId locked')
		let sharedDocs = await doc
			.find({ sharedWith: req.user._id })
			.sort('-dated')
			.populate('owner')
			.select('title dated fileId locked owner')

		res
			.status(200)
			.json({ payload: { ownDocs: ownDocs, sharedDocs: sharedDocs } })
	})
	.post(upload.array('documents'), async (req, res) => {
		try {
			let uid = uuid()
			let filetype = await ftype.fromBuffer(req.files[0].buffer)

			if (!ALLOWED_FILETYPES.includes(filetype.ext)) {
				throw new Error('Filetype not supported')
			}

			req.files.forEach(async (file, index) => {
				let processUID = uuid()
				let filename = processUID + '.' + filetype.ext

				let writtenFile = fs.writeFile(
					'./queues/files/' + filename,
					file.buffer
				)
				writtenFile.then(async () => {
					if (filetype.ext == 'pdf') {
						await convertQueue
							.createJob({
								filename: filename,
								parentUID: uid,
							})
							.delayUntil(Date.now() + 3000)
							.save()
					} else {
						await ocrQueue
							.createJob({
								filename: filename,
								parentUID: uid,
							})
							.delayUntil(Date.now() + 3000)
							.save()
					}
				})

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

			res
				.status(200)
				.json({ payload: { message: `Uploaded ${req.files.length} files` } })
		} catch (error) {
			res.status(500).json({
				payload: { message: error },
			})
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
				req.user.username == file.owner.username ||
				file.sharedWith.includes(req.session.user)
			) ||
			file.locked
		) {
			res
				.status(401)
				.json({ payload: { message: 'Not allowed to download file' } })
		} else {
			file.lockedBy = req.user
			//file.locked = true
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
		return res
			.status(401)
			.json({ payload: { message: 'Cant share with yourself' } })
	} else {
		return res.status(401).json({ payload: { message: 'Not the owner' } })
	}

	res.status(200).json({ payload: { message: 'Successfully shared' } })
})

router
	.route('/:fileid')
	.get(async (req, res) => {
		let result = await doc
			.findOne({ fileId: req.params.fileid })
			.populate('owner')
			.populate('lockedBy')
			.populate('sharedWith')
			.populate('log.user')
		res.status(200).json({ payload: result })
	})
	.delete(async (req, res) => {
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
					res.status(200).json({ payload: { message: 'File deleted' } })
				})
				.catch(e => {
					throw e
				})
		} catch (error) {
			res.status(401).json({ payload: { message: 'Couldnt delete file' } })
		}
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
