import { Response } from 'express'

class ErrorHandler extends Error {
    statusCode: number
    message: string

    constructor(statusCode: number, message: string) {
        super()
        this.statusCode = statusCode
        this.message = message
    }
}

const handleError = (err: ErrorHandler, res: Response) => {
    const { statusCode, message } = err

    res.status(statusCode).json({
        payload: message
    })
}

module.exports = {
    ErrorHandler,
    handleError
}