import { Response } from 'express'

export class ErrorHandler extends Error {
    public statusCode: number
    public message: string

    constructor(statusCode: number, message: string) {
        super()
        this.statusCode = statusCode
        this.message = message
    }
}

export const handleError = (err: ErrorHandler, res: Response) => {
    res.status(400).json({
        payload: { message: err.message }
    })
}