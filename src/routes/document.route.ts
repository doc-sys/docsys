import express, { Request, Response, NextFunction } from "express"
import { checkSchema } from 'express-validator'
const multer = require('multer')
import { Readable } from "stream"

import authenticate, { requireAdmin } from '../lib/helpers/authenticate'
import { getAllFiles, createNewFile, getRecent, uploadFiles, getOwnFiles, getSharedFiles, checkPermissionToFile, lockFile, getSingleFile, downloadFile, unlockFile, shareFile, checkFileOwnership, deleteSingleFile, appendComment, archiveFile } from '../controller/document.controller';

import createNew from '../lib/requestSchemas/document.createNew.json'
import checkout from '../lib/requestSchemas/document.checkout.json'
import share from '../lib/requestSchemas/document.share.json'
import fileid from '../lib/requestSchemas/document.fileid.json'
import { checkSchemaValidation } from '../lib/helpers/validator';

let router = express.Router()
let uploadFileHandler = multer({
    storage: multer.memoryStorage()
})

router.route('/')
    /**
     * @api {get} /document/ All documents
     * @apiName documentsGetAll
     * @apiGroup Document
     * @apiDescription Gets all documents on the instance. Can only be accessed by an admin.
     * @apiSuccess {Object[]} document All documents
     * @apiError (401) NotAuthorized Only admins are allow to access this ressource
     * @apiError (500) InternalServerError Something went wron processing your request
     */
    .get([authenticate, requireAdmin, getAllFiles], (req, res) => {
        res.status(200).json({ docs: res.locals.files })
    })
    /**
    * @api {post} /document/ New document
    * @apiName documentCreate
    * @apiGroup Document
    * @apiDescription Creates and uploads a new documents with its body.
    * @apiParam {Buffer[]} files Page(s) for the document
    * @apiParam {String} title Documents subject or title
    * @apiParam {Date} dated Date the original document was recieved
    * @apiParam {String} comment Comment to append to log
    * @apiSuccess {Object} document The created document
    * @apiError (415) {String} FileTypeError Filetype is not supported. So far only PDFs and picture types are supported
    * @apiError (500) {String} InternalError Something went wrong
    */
    .post([authenticate, uploadFileHandler.single('documents'), checkSchema(createNew as any), checkSchemaValidation, createNewFile, uploadFiles], (req, res) => {
        res.status(200).json({ document: res.locals.file })
    })

router.route('/own')
    /**
     * @api {get} /document/own Own documents
     * @apiName documentGetOwn
     * @apiGroup Document
     * @apiDescription Returns the users documents
     * @apiSuccess {Array} docs User documents basic metadata
     * @apiError (401) {String} PermissionError Not allowed to GET this file
     * @apiError (500) {String} InternalError Something went wrong
     */
    .get([authenticate, getOwnFiles], (req, res) => {
        res.status(200).json({ docs: res.locals.files })
    })

router.route('/shared')
    /**
     * @api {get} /document/shared Shared documents
     * @apiName documentGetShared
     * @apiGroup Document
     * @apiDescription Returns the documents shared with the user
     * @apiSuccess {Array} sharedDocs Shared documents basic metadata
     * @apiError (401) {String} PermissionError Not allowed to GET this file
     * @apiError (500) {String} InternalError Something went wrong
     */
    .get([authenticate, getSharedFiles], (req, res) => {
        res.status(200).json({ docs: res.locals.files })
    })

router.route('/recent')
    /**
     * @api {get} /document/recent Get recent activity
     * @apiName documentGetRecent
     * @apiGroup Document
     * @apiDescription Gets the recent activity on the users documents. Query 'limit' limits the amount of returned activity.
     * @apiSuccess {Array} recent Recent actvity
     * @apiError (401) {String} PermissionError Not allowed to GET this
     * @apiError (500) {String} InternalError Something went wrong
     */
    .get([authenticate, getRecent], (req, res) => {
        res.status(200).json(res.locals.recent)
    })

router.route('/comment/:fileid')
    /**
     * @api {post} /document/comment/:fileid Add comment to file log
     * @apiName documentAddComment
     * @apiGroup Document
     * @apiDescription Returns the file log
     * @apiSuccess {Array} logs Log of the file
     * @apiError (401) {String} PermissionError Not allowed to POST a comment
     * @apiError (500) {String} InternalError Something went wrong
     */
    .post([authenticate, checkSchema(fileid), checkSchemaValidation, getSingleFile, checkPermissionToFile, appendComment], (req, res) => {
        res.status(200).json(res.locals.file.log)
    })

router.route('/checkout/:fileid')
    /**
     * @api {get} /document/checkout/:fileid Document checkout
     * @apiName documentCheckout
     * @apiGroup Document
     * @apiDescription Checks out document and sends files as ZIP archive
     * @apiParam {String} fileid The fileid as part of the GET URL
     * @apiSuccess (200) {Stream} ZIP file stream
     * @apiError (401) PermissionError Not allowed to GET this file
     * @apiError (500) {String} InternalError Something went wrong
     */
    .get([authenticate, checkSchema(checkout), checkSchemaValidation, getSingleFile, checkPermissionToFile, /* lockFile ,*/ downloadFile], (req, res) => {
        res.writeHead(200, {
            'Content-Type': res.locals.file.mime,
            'Content-disposition': `attachment; filename=${res.locals.file.title}`, //.${res.locals.file.extension}
            'Content-Length': res.locals.fileBuffer.length
        })

        res.end(res.locals.fileBuffer)

        // const stream = new Readable()
        // stream._read = () => { }
        // stream.push(res.locals.fileBuffer)
        // stream.push(null)

        // stream.pipe(res)
    })
    /**
    * @api {unlock} /document/checkout/:fileid
    * @apiName documentAdminUnlock
    * @apiGroup Document
    * @apiDescription Unlocks a locked document without actually submitting a new document file. Requires user to be an admin
    * @apiParam {String} fileid The fileid as part of the POST URL
    * @apiSuccess (200) {Object} The unlocked document
    * @apiError (401) PermissionError Not allowed to UNLOCK this file
    * @apiError (500) {String} InternalError Something went wrong
    */
    .unlock([authenticate, requireAdmin, checkSchema(checkout), checkSchemaValidation, getSingleFile, unlockFile], (req, res) => {
        res.status(200).json({ doc: res.locals.file })
    })

router.route('/share/:fileid')
    /**
     * @api {post} /document/share/:fileid
     * @apiName documentShareFile
     * @apiGroup Document
     * @apiDescription Shares file with a new user
     * @apiParam {String} fileid The fileid as part of the POST URL
     * @apiParam {String} whoToShare Username to share the file with. Provided in body or query.
     * @apiSuccess (200) {Object} The updated document
     * @apiError (401) PermissionError Not allowed to edit this file
     * @apiError (500) {String} InternalError Something went wrong
     */
    .post([authenticate, checkSchema(share), checkSchemaValidation, getSingleFile, checkPermissionToFile, shareFile], (req, res) => {
        res.status(200).json({ doc: res.locals.file })
    })

router.route('/archive/:fileid')
    /**
     * @api {post} /document/archive/:fileid
     * @apiName documentArchiveFile
     * @apiGroup Document
     * @apiDescription Moves the file to the archive
     * @apiParam {String} fileid The fileid as part of the POST URL
     * @apiSuccess (200) {Object} The archived document
     * @apiError (401) PermissionError Not allowed to archive this file
     * @apiError (500) {String} InternalError Something went wrong
     */
    .post([authenticate, checkSchema(fileid), checkSchemaValidation, getSingleFile, checkPermissionToFile, archiveFile], (req, res) => {
        res.status(200).json({ file: res.locals.file })
    })

// router.route('/queue/:queue/:fileid')
//     .post([authenticate, checkSchema(fileid), checkSchemaValidation, getSingleFile, checkPermissionToFile, downloadFile, handleQueue])

router.route('/:fileid')
    /**
     * @api {get} /document/:fileid Get single document
     * @apiName documentGetSingle
     * @apiGroup Document
     * @apiDescription Returns the single requested document
     * @apiParam {String} fileid The fileid as part of the GET URL
     * @apiSuccess {Object} document The requested object
     * @apiError (401) {String} PermissionError Not allowed to GET this file
     * @apiError (500) {String} InternalError Something went wrong
     */
    .get([authenticate, checkSchema(fileid), checkSchemaValidation, getSingleFile, checkPermissionToFile], (req, res) => {
        res.status(200).json({ doc: res.locals.file })
    })
    /**
    * @api {delete} /document/:fileid Deletes document
    * @apiName documentDeleteSingle
    * @apiGroup Document
    * @apiDescription Deletes the requested document
    * @apiParam {String} fileid The fileid as part of the GET URL
    * @apiSuccess {Object} document The deleted object
    * @apiError (401) {String} PermissionError Not allowed to DELETE this file
    * @apiError (500) {String} InternalError Something went wrong
    */
    .delete([authenticate, checkSchema(fileid), checkSchemaValidation, deleteSingleFile], (req, res) => {
        res.status(200).json({ doc: res.locals.file })
    })

module.exports = router