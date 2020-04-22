// TYPES
import { Request, Response, NextFunction } from 'express';

//DEPS
import * as jwt from 'jsonwebtoken'
var { ErrorHandler } = require('./error')

export default async function authenticate(req: any, res: Response, next: NextFunction) {
    try {

        let token = req.query.token || req.headers.authorization!.split(' ')[1] || undefined

        if (token === undefined || token === null) {
            return next(new ErrorHandler(402, 'API Token must either be set as header or query string'))
        }

        let result = await jwt.verify(token, process.env.JWT_SECRET)

        res.locals.user = result

        next()
    } catch (error) {
        return next(new ErrorHandler(500, `Error checking permission: ${(error as Error).message}`))
    }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    res.locals.user.isAdmin ? next() : next(new ErrorHandler(401, 'You have to be an administrator to do this.'))
}