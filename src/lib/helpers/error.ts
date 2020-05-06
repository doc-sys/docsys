import { Response } from 'express'

export class ErrorHandler extends Error {
    public statusCode: number
    public message: string

    constructor(statusCode: number, message: string) {
        super()
        this.statusCode = statusCode
        this.message = message

        console.error(this.stack)
    }
}

export const handleError = (err: ErrorHandler, res: Response) => {
    res.status(err.statusCode || 500).json({
        message: err.message
    })
}