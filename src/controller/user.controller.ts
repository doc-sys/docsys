import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from '../lib/helpers/error'
import { user } from '../models/user'
import * as jwt from 'jsonwebtoken'

//CheckPropertyHandler
export const checkPropertyUsername = (req: Request, res: Response, next: NextFunction): void => {
    req.body.hasOwnProperty('username') ? next() : next(new ErrorHandler(400, 'Please provide a username'))
}

export const checkPropertyPassword = (req: Request, res: Response, next: NextFunction): void => {
    req.body.hasOwnProperty('password') ? next() : next(new ErrorHandler(400, 'Please provide a password'))
}

export const checkPropertyMail = (req: Request, res: Response, next: NextFunction): void => {
    req.body.hasOwnProperty('mail') ? next() : next(new ErrorHandler(400, 'Please provide a mail address'))
}

export const checkPropertyName = (req: Request, res: Response, next: NextFunction): void => {
    req.body.hasOwnProperty('displayName') ? next() : next(new ErrorHandler(400, 'Please provide a display name'))
}

//ModelOperations
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    let username = req.body.username || res.locals.user.username
    let password = req.body.password || res.locals.user.password

    username === undefined && next(new ErrorHandler(400, 'Please provide a username'))
    password === undefined && next(new ErrorHandler(400, 'Please provide a password'))

    try {
        var result = await user.getAuthenticated(
            username,
            password
        )
    } catch (error) {
        next(error)
    }

    try {
        var token = await jwt.sign(result.toJSON(), process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES,
        })
    } catch (error) {
        next(new ErrorHandler(501, `Error token signing: ${error.message}`))
    }

    res.locals.user = result
    res.locals.token = token

    next()
}

export const findUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let thisUser = await user.findOne({ username: req.body.username })
        res.locals.user = thisUser
    } catch (error) {
        next(new ErrorHandler(401, 'User not found'))
    }

    next()
}

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var newUser = new user({
            username: req.body.username,
            password: req.body.password,
            mail: req.body.mail,
            settings: {
                language: 'en',
                displayName: req.body.displayName,
            },
        })

        await newUser.save()

        res.locals.user = newUser
    } catch (error) {
        next(new ErrorHandler(500, `Error creating user: ${error.message}`))
    }

    next()
}