import express, { Request, Response, NextFunction } from "express"
import { fromBuffer as filetypeFromBuffer } from 'file-type'
import { PassThrough } from 'stream'
import * as archive from 'archiver'

import { ErrorHandler } from '../lib/helpers/error'
import getStorage from '../lib/storage/adapters'

const storage = getStorage()

import { doc } from '../models/document'

let router = express.Router()

//CheckPropertyHandler
export const checkPropertyUsername = (req: Request, res: Response, next: NextFunction): void => {
    req.body.hasOwnProperty('username') || req.params.hasOwnProperty('username') ? next() : next(new ErrorHandler(400, 'Please provide a username'))
}

//Model Find Operations
export const getOwnDocuments = async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.auth_user) return next(new ErrorHandler(500, "Can't access user property"))

    try {
        let docs = await doc.find({ owner: res.locals.auth_user._id }).sort(req.body.sorted || req.query.sorted || '-dated').select('title dated fileId locked')
        res.locals.docs = docs
    } catch (error) {
        return next(new ErrorHandler(500, (error as Error).message))
    }

    next()
}

export const getSharedDocuments = async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.auth_user) return next(new ErrorHandler(500, "Can't access user property"))

    try {
        let docs = await doc.find({ sharedWith: res.locals.auth_user._id }).sort(req.body.sorted || req.query.sorted || '-dated').populate('owner').select('title dated fileId locked owner.username owner.avatar')
        res.locals.docs = docs
    } catch (error) {
        return next(new ErrorHandler(500, (error as Error).message))
    }

    next()
}

export const getAllDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let allDocs = await doc.find({}).populate('owner')
        res.locals.docs = allDocs
    } catch (error) {
        return next(new ErrorHandler(500, `Error getting documents: ${(error as Error).message}`))
    }

    next()
}

export const getSingleDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let document = await doc.findOne({ fileId: req.params.fileid })
            .populate('owner')
            .populate('lockedBy')
            .populate('sharedWith')
            .populate('log.user')
        res.locals.doc = document
    } catch (error) {
        return next(new ErrorHandler(500, `Error getting file: ${(error as Error).message}`))
    }

    next()
}

//Create And Update Model

export const createNewDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let newDoc = new doc(req.body)
        res.locals.doc = await newDoc.save()
    } catch (error) {
        return next(new ErrorHandler(500, `Error creating document: ${(error as Error).message}`))
    }
}

export const uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
    if (!(['pdf', 'jpg', 'jpeg', 'png', 'tiff'].includes(filetypeFromBuffer(req.files[0].buffer) as any))) return next(new ErrorHandler(415, `Filetype ${filetypeFromBuffer(req.files[0].buffer)} not supported`))

    try {
        req.files.forEach(async (file: any, i: number) => {
            let bStream = new PassThrough()
            bStream.end(file.buffer)

            let pageId = await storage.add(bStream)

            res.locals.doc.pageHashes = []
            res.locals.doc.pageHashes.push(pageId)
        })

        await res.locals.doc.save()
        next()
    } catch (error) {
        return next(new ErrorHandler(500, `Error handling file upload: ${(error as Error).message}`))
    }
}

// Lock Operations

export const checkPermissionToFile = async (req: Request, res: Response, next: NextFunction) => {
    if (!(res.locals.auth_user == res.locals.doc.owner.username || res.locals.doc.sharedWith.includes(res.locals.auth_user)) || res.locals.doc.locked) return next(new ErrorHandler(401, "File can't be checked out by you"))
    next()
}

export const checkFileOwnership = async (req: Request, res: Response, next: NextFunction) => {
    if (!(res.locals.auth_user._id == res.locals.dox.owner._id)) return next(new ErrorHandler(401, 'You are not permitted to acces this file'))
    next()
}

export const lockFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.locals.doc.lockedBy = res.locals.auth_user
        res.locals.doc.locked = true
        await res.locals.doc.save()
    } catch (error) {
        return next(new ErrorHandler(500, `Error locking file: ${(error as Error).message}`))
    }

    next()
}

export const unlockFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.locals.doc.lockedBy = null
        res.locals.doc.locked = false
        await res.locals.doc.save()
    } catch (error) {
        return next(new ErrorHandler(500, `Error unlocking file: ${(error as Error).message}`))
    }

    next()
}

// File download

export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let zip = await archive('zip')
        await Promise.all(
            res.locals.doc.pageHashes.forEach(async element => {
                let buffer = await storage.get(element)
                zip.append()
            })
        )

        res.locals.zip = zip
    } catch (error) {
        return next(new ErrorHandler(500, `Error downloading file; ${(error as Error).message}`))
    }

    next()
}

// Share

export const shareFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userToShare = req.body.userToShare || req.query.userToShare
        res.locals.doc.sharedWith.push(userToShare._id)

        await res.locals.doc.save()
    } catch (error) {
        return next(new ErrorHandler(500, `Error sharing file: ${(error as Error).message}`))
    }

    next()
}

module.exports = router