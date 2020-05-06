import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ErrorHandler } from './error'

export const checkSchemaValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(({ msg, param }) => { return `${msg}` })
    if (!errors.isEmpty()) {
        return next(new ErrorHandler(400, errors.array()[0]))
    }

    next()
}