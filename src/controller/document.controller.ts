/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from "express"
import { fromBuffer as filetypeFromBuffer } from 'file-type'
import { PassThrough } from 'stream'
import { notification_channel } from '../socket'
import { socketStore } from '../lib/helpers/keystore'
// import * as queue from 'doshit'

import { ErrorHandler } from '../lib/helpers/error'
import getStorage from '../lib/storage/adapters'

const storage = getStorage()
// const queue_client = queue()

import { File } from '../models/file'
import { v4 as uuid } from 'uuid';
import { Bool } from "aws-sdk/clients/clouddirectory"

//Model Find Operations
export const getOwnFiles = async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.auth_user) return next(new ErrorHandler(500, "Can't access user property"))

    try {
        const files = await File.find({ owner: res.locals.auth_user._id }).sort(req.body.sorted || req.query.sorted || '-dated').populate('owner').select('title dated fileId locked extension owner.settings.displayName owner.avatar')
        res.locals.files = files
    } catch (error) {
        return next(new ErrorHandler(500, (error as Error).message))
    }

    next()
}

export const getSharedFiles = async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.auth_user) return next(new ErrorHandler(500, "Can't access user property"))

    try {
        const files = await File.find({ sharedWith: res.locals.auth_user._id }).sort(req.body.sorted || req.query.sorted || '-dated').populate('owner').select('title dated fileId locked extension owner.username owner.avatar')
        res.locals.files = files
    } catch (error) {
        return next(new ErrorHandler(500, (error as Error).message))
    }

    next()
}

export const getAllFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allFiles = await File.find({}).populate('owner')
        res.locals.files = allFiles
    } catch (error) {
        return next(new ErrorHandler(500, `Error getting documents: ${(error as Error).message}`))
    }

    next()
}

export const getRecent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.locals.recent = await File.find({ '$or': [{ owner: res.locals.auth_user._id }, { sharedWith: { '$in': [res.locals.auth_user._id] } }] }).populate({ path: 'log.user', select: 'user.settings.displayName user.avatar', options: { limit: 1 } }).limit(3)/* .sort('-log.timestamp').slice('log', -2).lean().select('title log').limit(req.query.limit || 3) */
    } catch (error) {
        return next(new ErrorHandler(500, `Error getting recent: ${(error as Error).message}`))
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
            .sort('')
    } catch (error) {
        return next(new ErrorHandler(500, `Error getting file: ${(error as Error).message}`))
    }

    next()
}

export const deleteSingleFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileId = req.params.fileid || req.body.fileid || req.query.fileid
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
        const fileid = uuid()
        const file = new File(req.body)
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

export const uploadFiles = async (req: Request & { file }, res: Response, next: NextFunction) => {
    try {
        const filetype = await filetypeFromBuffer(req.file.buffer)

        const bStream = new PassThrough()
        bStream.end(req.file.buffer)

        const storageId = await storage.add(bStream)

        res.locals.file.fileStorageId = storageId
        res.locals.file.mime = filetype?.mime
        res.locals.file.extension = filetype?.ext
        res.locals.file.save()
        delete res.locals.file.fileStorageId
    } catch (error) {
        //TODO: logging console.error(error)
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
        await emitNotification([res.locals.file.owner.username, ...res.locals.file.sharedWith.map(e => e.username)] as [string], actionContext.log, {
            notificationTemplate: [`${res.locals.auth_user.settings.displayName}`, 'commented on', `${res.locals.file.title}`],
            payload: res.locals.file.log,
            playNotification: true,
            actionAttentionURL: `/view/${res.locals.file.fileId}`
        }, (res.locals.auth_user.username as string))
    } catch (error) {
        return next(new ErrorHandler(500, `Error locking file: ${(error as Error).message}`))
    }

    next()
}

// Lock Operations

export const checkPermissionToFile = async (req: Request, res: Response, next: NextFunction) => {
    let permitted = false

    res.locals.file.sharedWith.filter(e => e.username === res.locals.auth_user.username).length > 0 ? permitted = true : permitted = false

    if (!(res.locals.auth_user.username == res.locals.file.owner.username || permitted)) return next(new ErrorHandler(401, "File can't be checked out by you"))
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
        if (res.locals.file.archived) throw new Error('File is archived')

        res.locals.fileBuffer = await storage.get(res.locals.file.fileStorageId)
    } catch (error) {
        return next(new ErrorHandler(500, `Error downloading file; ${(error as Error).message}`))
    }

    next()
}

// Share

export const shareFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userToShare = req.body.whoToShare || req.query.userToShare
        res.locals.file.sharedWith.push(userToShare)

        await res.locals.file.save()

        res.locals.file = await File.findOne({ fileId: res.locals.file.fileId })
            .populate('owner')
            .populate('sharedWith')

        //TODO: logging console.log(res.locals.file)

        await emitNotification([res.locals.file.owner.username, ...res.locals.file.sharedWith.map(e => e.username)] as [string], actionContext.share, {
            notificationTemplate: [`${res.locals.auth_user.settings.displayName}`, 'shared', `${res.locals.file.title}`, 'with you'],
            playNotification: true,
            actionAttentionURL: `/view/${res.locals.file.fileId}`
        }, (res.locals.auth_user.username as string))

    } catch (error) {
        return next(new ErrorHandler(500, `Error sharing file: ${(error as Error).message}`))
    }

    next()
}

export const archiveFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await storage.archive(res.locals.file.fileStorageId)
        res.locals.file.archived = true
        res.locals.file = await res.locals.file.save()
    } catch (error) {
        return next(new ErrorHandler(500, `Error archiving file: ${(error as Error).message}`))
    }

    next()
}

/* export const handleQueue = async (req: Request, res: Response, next: NextFunction) => {
    switch (req.params.queue) {
        case "ocr":

    }
} */

// HELPER FUNCTION
// ---------------
interface actionDataIf {
    payload?: Record<string, unknown>,
    notificationTemplate: Array<string>,
    playNotification?: Bool,
    actionAttentionURL?: string
}

enum actionContext {
    log = 'log',
    share = 'share'
}

async function emitNotification(recps: [string], actionContext: actionContext, actionData: actionDataIf, emitter: string) {
    for (const recp of recps) {
        if (recp !== emitter) {
            const recp_adress: string = await socketStore.get(recp)
            if (recp_adress) {
                //TODO: logging console.log(`emitting to ${recp_adress}`)
                notification_channel.to(`/api/notifications#${recp_adress}`).emit('notification', {
                    type: actionContext,
                    payload: actionData
                })
            }
        }
    }
}