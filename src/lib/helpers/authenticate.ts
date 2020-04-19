// TYPES
import { Request, Response, NextFunction } from 'express';

//DEPS
import * as jwt from 'jsonwebtoken'
var { ErrorHandler } = require('./error')

export default async function authenticate(req: any, res: Response, next: NextFunction) {
    try {

        let token = req.query.token || req.headers.authorization!.split(' ')[1] || undefined

        if (token === undefined || token === null) {
            throw new ErrorHandler(402, 'API Token must either be set as header or query string')
        }

        let result = await jwt.verify(token, process.env.JWT_SECRET)

        req.user = result

        next()
    } catch (error) {
        next(error)
    }
}