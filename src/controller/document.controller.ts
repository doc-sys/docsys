import express, { Request, Response, NextFunction } from "express"
import { fromBuffer as filetypeFromBuffer } from 'file-type'
import { PassThrough } from 'stream'
import * as archive from 'archiver'

import { ErrorHandler } from '../lib/helpers/error'
import getStorage from '../lib/storage/adapters'

const storage = getStorage()

import { File } from '../models/file'
import { v4 as uuid } from 'uuid';

//Model Find Operations
export const getOwnFiles = async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.auth_user) return next(new ErrorHandler(500, "Can't access user property"))

    try {
        let files = await File.find({ owner: res.locals.auth_user._id }).sort(req.body.sorted || req.query.sorted || '-dated').populate('owner').select('title dated fileId locked extension owner.settings.displayName owner.avatar')
        res.locals.files = files
    } catch (error) {
        return next(new ErrorHandler(500, (error as Error).message))
    }

    next()
}

export const getSharedFiles = async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.auth_user) return next(new ErrorHandler(500, "Can't access user property"))

    try {
        let files = await File.find({ sharedWith: res.locals.auth_user._id }).sort(req.body.sorted || req.query.sorted || '-dated').populate('owner').select('title dated fileId locked extension owner.username owner.avatar')
        res.locals.files = files
    } catch (error) {
        return next(new ErrorHandler(500, (error as Error).message))
    }

    next()
}

export const getAllFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let allFiles = await File.find({}).populate('owner')
        res.locals.files = allFiles
    } catch (error) {
        return next(new ErrorHandler(500, `Error getting documents: ${(error as Error).message}`))
    }

    next()
}

export const getSingleFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.locals.file = await File.findOne({ fileId: req.params.fileid })
            .populate('owner')
            .populate('lockedBy')
            .populate('sharedWith')
            .populate('log.user')
    } catch (error) {
        return next(new ErrorHandler(500, `Error getting file: ${(error as Error).message}`))
    }

    next()
}

export const deleteSingleFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let fileId = req.params.fileid || req.body.fileid || req.query.fileid
        res.locals.file = await File.findOneAndDelete({ fileId: fileId })
        await storage.delete(res.locals.file.fileStorageId)
    } catch (error) {
        return next(new ErrorHandler(500, `Error deleting file: ${(error as Error).message}`))
    }

    next()
}

//Create And Update Model

export const createNewFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let fileid = uuid()
        let file = new File(req.body)
        file.owner = res.locals.auth_user._id
        file.fileId = fileid
        file.log.push({
            user: res.locals.auth_user._id,
            message: 'created this file'
        })
        file.log.push({
            user: res.locals.auth_user._id,
            logType: 'commented',
            message: req.body.comment
        })
        res.locals.file = await file.save()
    } catch (error) {
        return next(new ErrorHandler(500, `Error creating document: ${(error as Error).message}`))
    }

    next()
}

export const uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let filetype = await filetypeFromBuffer(req.file.buffer)

        let bStream = new PassThrough()
        bStream.end(req.file.buffer)

        let storageId = await storage.add(bStream)

        res.locals.file.fileStorageId = storageId
        res.locals.file.mime = filetype?.mime
        res.locals.file.extension = filetype?.ext
        res.locals.file.save()
        delete res.locals.file.fileStorageId
    } catch (error) {
        console.error(error)
        return next(new ErrorHandler(500, `Error handling file upload: ${(error as Error).message}`))
    }

    next()
}

export const appendComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.locals.file.log.push({
            user: res.locals.auth_user,
            message: req.body.comment,
            logType: 'commented'
        })
        await res.locals.file.save()

        //res.locals.file = await res.locals.file.populate('log.user')
    } catch (error) {
        return next(new ErrorHandler(500, `Error locking file: ${(error as Error).message}`))
    }

    next()
}

// Lock Operations

export const checkPermissionToFile = async (req: Request, res: Response, next: NextFunction) => {
    if (!(res.locals.auth_user.username == res.locals.file.owner.username || res.locals.file.sharedWith.includes(res.locals.auth_user)) || res.locals.file.locked) return next(new ErrorHandler(401, "File can't be checked out by you"))
    next()
}

export const checkFileOwnership = async (req: Request, res: Response, next: NextFunction) => {
    if (!(res.locals.auth_user._id == res.locals.file.owner._id)) return next(new ErrorHandler(401, 'You are not permitted to acces this file'))
    next()
}

export const lockFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.locals.file.lockedBy = res.locals.auth_user
        res.locals.file.locked = true
        await res.locals.file.save()
    } catch (error) {
        return next(new ErrorHandler(500, `Error locking file: ${(error as Error).message}`))
    }

    next()
}

export const unlockFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.locals.file.lockedBy = null
        res.locals.file.locked = false
        await res.locals.file.save()
    } catch (error) {
        return next(new ErrorHandler(500, `Error unlocking file: ${(error as Error).message}`))
    }

    next()
}

// File download

export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // let zip = await archive('zip')
        // await Promise.all(
        //     res.locals.file.pageHashes.forEach(async element => {
        //         let buffer = await storage.get(element)
        //         zip.append()
        //     })
        // )

        // res.locals.zip = zip

        res.locals.fileBuffer = await storage.get(res.locals.file.fileStorageId)
    } catch (error) {
        return next(new ErrorHandler(500, `Error downloading file; ${(error as Error).message}`))
    }

    next()
}

// Share

export const shareFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userToShare = req.body.userToShare || req.query.userToShare
        res.locals.file.sharedWith.push(userToShare._id)

        await res.locals.file.save()
    } catch (error) {
        return next(new ErrorHandler(500, `Error sharing file: ${(error as Error).message}`))
    }

    next()
}