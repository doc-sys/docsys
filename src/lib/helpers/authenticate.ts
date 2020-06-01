// TYPES
import { Request, Response, NextFunction } from 'express';

//DEPS
import * as jwt from 'jsonwebtoken'
var { ErrorHandler } = require('./error')
import { user } from '../..//models/user'

export default async function authenticate(req: any, res: Response, next: NextFunction) {
    try {

        let token = req.query.token || req.headers.authorization!.split(' ')[1] || undefined

        if (token === undefined || token === null) {
            return next(new ErrorHandler(402, 'API Token must either be set as header or query string'))
        }

        let result = await jwt.verify(token, process.env.JWT_SECRET)

        let fullUser = await user.findOne({ username: result.username })

        res.locals.auth_user = fullUser
        next()
    } catch (error) {
        return next(new ErrorHandler(500, `Error checking permission: ${(error as Error).message}`))
    }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    res.locals.auth_user.isAdmin ? next() : next(new ErrorHandler(401, 'You have to be an administrator to do this.'))
}