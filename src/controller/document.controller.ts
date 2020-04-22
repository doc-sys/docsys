import express, { Request, Response, NextFunction } from "express"
import { ErrorHandler } from '../lib/helpers/error'
import authenticate, { requireAdmin } from '../lib/helpers/authenticate'
import StorageAdapter from '../lib/storage/adapters/interface'
import { doc } from '../models/document'
import { user } from '../models/user'

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

module.exports = router