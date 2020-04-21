import StorageAdapter from '../lib/storage/adapters/interface'
import { Request, Response } from 'express'
//mport * as Storage from `../storage/adapters/${process.env.STORAGE_ENGINE}`
import getStorage from '../lib/storage/adapters'
import * as stream from 'stream'
import * as fs from 'fs'

let storage = getStorage()

var express = require('express')
var multer = require('multer')
var uuid = require('uuid/v4')
var ftype = require('file-type')
var archiver = require('archiver')

var router = express.Router()
var ErrorHandler = require('../lib/helpers/error')

// delay responses in developement
if (process.env.NODE_ENV == 'developement') {
	let delay = require('express-delay')
	router.use(delay(1000))
}

var doc = require('../models/document')
var user = require('../models/user')

const ALLOWED_FILETYPES = ['pdf', 'jpg', 'jpeg', 'png', 'tiff']

var upload = multer({
	storage: multer.memoryStorage(),
})

/**
 * @api {get} /document/own Own documents
 * @apiName documentGetOwn
 * @apiGroup Document
 * @apiDescription Returns the users documents
 * @apiSuccess {Array} ownDocs User documents basic metadata
 */
router.get('/own', async (req: any, res: Response) => {
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

/**
 * @api {get} /document/shared Shared documents
 * @apiName documentGetShared
 * @apiGroup Document
 * @apiDescription Returns the documents shared with the user
 * @apiSuccess {Array} sharedDocs Shared documents basic metadata
 */
router.get('/shared', async (req: any, res: Response) => {
	let sharedDocs = await doc
		.find({ sharedWith: req.user._id })
		.sort('-dated')
		.populate('owner')
		.select('title dated fileId locked owner.avatar')

	res.status(200).json({ payload: sharedDocs })
})

router
	.route('/')
	.get(async (req: any, res: Response) => {
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
	/**
	 * @api {post} /document/ New document
	 * @apiName documentCreate
	 * @apiGroup Document
	 * @apiDescription Creates and uploads a new documents with its body.
	 * @apiParam {Buffer[]} files Page(s) for the document
	 * @apiParam {String} title Documents subject or title
	 * @apiParam {Date} dated Date the original document was recieved
	 * @apiParam {String} comment Optional comment to append to log
	 * @apiSuccess {String} message Confirming upload
	 * @apiError (500) {String} InternalError Something went wrong
	 */
	.post(upload.array('documents'), async (req: any, res: Response, next: any) => {
		try {
			let uid = uuid()
			let filetype = await ftype.fromBuffer(req.files[0].buffer)

			if (!ALLOWED_FILETYPES.includes(filetype.ext)) {
				throw new ErrorHandler(415, 'Filetype not supported')
			}

			let uploadedFile = new doc({
				title: req.body.title,
				created: req.body.dated,
				fileId: uid,
				owner: req.user._id,
				mime: filetype.mime,
				extension: filetype.ext,
				log: [],
				pageHashes: [],
			})

			uploadedFile.log.push({
				message: 'Document created',
				user: req.user._id,
			})
			uploadedFile.log.push({
				message: req.body.comment,
				user: req.user._id,
			})

			console.log(storage)

			req.files.forEach(async (file: any, index: number) => {
				let bStream = new stream.PassThrough()
				bStream.end(file.buffer)

				let pageId = await storage.add(bStream)
				uploadedFile.pageHashes.push(pageId)
			})

			await uploadedFile.save()

			res
				.status(200)
				.json({ payload: { message: `Uploaded ${req.files.length} files` } })
		} catch (error) {
			next(error)
		}
	})

router
	.route('/checkout/:fileid')
	/**
	 * @api {get} /document/checkout/:fileid Document checkout
	 * @apiName documentCheckout
	 * @apiGroup Document
	 * @apiDescription Checks out document and sends files as ZIP archive
	 * @apiParam {String} fileid The fileid as part of the GET URL
	 * @apiSuccess (200) {Stream} ZIP file stream
	 * @apiError (401) PermissionError Not allowed to GET this file
	 */
	.get(async (req: any, res: Response) => {
		let file = await doc
			.findOne({ fileId: req.params.fileid })
			.populate('owner')
			.populate('sharedWith')

		//check permissions
		if (
			!(
				req.user.username == file.owner.username ||
				file.sharedWith.includes(req.user)
			) ||
			file.locked
		) {
			res
				.status(401)
				.json({ payload: { message: 'Not allowed to download file' } })
		} else {
			file.lockedBy = req.user
			file.locked = true
			await file.save()

			res.writeHead(200, {
				'Content-Type': 'application/zip',
				'Content-disposition': 'attachement; filename=files.zip',
			})

			let zip = await archiver('zip')

			await Promise.all(
				file.pageHashes.map(async (pageId: string, i: number) => {
					let buf = new Buffer(0)
					stream.on('data', (d) => {
						buf = Buffer.concat([buf, d])
					})

					await storage.get(pageId, zip)

					zip.append()
				})
			)

			await zip.pipe(res)

			zip.finalize()
		}
	})
	/**
	 * @api {post} /document/checkout/:fileid
	 */
	.post(upload.array('documents'), async (req: any, res: Response) => {
		try {
			let file = await doc.findOne({ fileId: req.params.fileid })

			req.flash('success', `Uploaded ${req.files.length} files`)
			res.redirect(req.originalUrl)
		} catch (error) {
			req.flash('warn', 'Couldn`t upload files')
			res.redirect(req.originalUrl)
		}
	})

router.route('/share/:fileid').post(async (req: any, res: Response) => {
	let fileid = req.params.fileid
	let document = await doc.findOne({ fileId: fileid }).populate('owner')
	let sharedUser = await user.findOne({ username: req.body.shareUsername })

	if (req.user.username == document.owner.username) {
		document.sharedWith.push(sharedUser._id)
		await document.save()
	} else if (req.user.username == req.body.shareUsername) {
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
	.get(async (req: any, res: Response) => {
		let result = await doc
			.findOne({ fileId: req.params.fileid })
			.populate('owner')
			.populate('lockedBy')
			.populate('sharedWith')
			.populate('log.user')
		res.status(200).json({ payload: result })
	})
	.delete(async (req: any, res: Response) => {
		try {
			await doc.deleteOne({ fileId: req.params.fileid })


		} catch (error) {
			res.status(401).json({ payload: { message: 'Couldnt delete file' } })
		}
	})

module.exports = router
