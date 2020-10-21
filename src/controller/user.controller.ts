/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from '../lib/helpers/error';
import { user } from '../models/user'
import * as jwt from 'jsonwebtoken'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp')

//ModelOperations
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username || req.params.username || res.locals.user.username
    const password = req.body.password || req.params.password || res.locals.user.password

    try {
        // eslint-disable-next-line no-var
        var result = await user.getAuthenticated(
            username,
            password
        )
    } catch (error) {
        return next(new ErrorHandler(501, `Error authenticating user: ${(error as Error).message}`))
    }

    const cleanResult = result.toJSON()
    await delete cleanResult.avatar
    await delete cleanResult.password
    await delete result.password

    try {
        // eslint-disable-next-line no-var
        var token = await jwt.sign(cleanResult, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        })
    } catch (error) {
        return next(new ErrorHandler(501, `Error token signing: ${error.message}`))
    }

    res.locals.user = result
    res.locals.token = token

    next()
}

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = new user({
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
        return next(new ErrorHandler(500, `Error creating user: ${error.message}`))
    }

    next()
}

export const updateUser = async (req: Request & { file }, res: Response, next: NextFunction) => {
    try {
        delete req.body.lockUntil, req.body.loginAttempts, req.body.admin
        if (req.file) {
            const newAvatar = await sharp(req.file.buffer).resize(64, 64).toBuffer()
            req.body.avatar = await Buffer.from(newAvatar).toString('base64')
        }

        const updatedUser = await user.findOneAndUpdate({ username: req.body.username || req.params.username }, req.body, { new: true })
        res.locals.user = updatedUser
    } catch (error) {
        return next(new ErrorHandler(500, `Error updating user: ${(error as Error).message}`))
    }

    next()
}

// FindOperations
export const findUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const thisUser = await user.findOne({ username: req.body.username || req.params.username }).select('username avatar settings loginAttempts mail lockUntil isLocked')
        res.locals.user = thisUser
    } catch (error) {
        return next(new ErrorHandler(401, 'User not found'))
    }

    next()
}

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allUser = await user.find({}).select('username avatar settings loginAttempts mail lockUntil isLocked')
        res.locals.user = allUser
    } catch (error) {
        return next(new ErrorHandler(500, `Error finding user: ${(error as Error).message}`))
    }

    next()
}

// Model Admin Functions
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedUser = await user.findOneAndDelete({ username: req.body.username || req.params.username }, { select: 'username' })
        res.locals.user = deletedUser
    } catch (error) {
        return next(new ErrorHandler(500, `Error deleting user: ${(error as Error).message}`))
    }

    next()
}

export const unlockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const unlockedUser = await user.updateOne({ username: req.body.username || req.params.username }, { $set: { loginAttempts: 0, lockUntil: null } }).select('username avatar settings loginAttempts mail lockUntil')
        res.locals.user = unlockedUser
    } catch (error) {
        return next(new ErrorHandler(500, `Error unlocking user: ${(error as Error).message}`))
    }

    next()
}