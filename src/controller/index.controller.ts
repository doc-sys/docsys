/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from "express"
import { ErrorHandler } from '../lib/helpers/error'

import * as mongoose from 'mongoose'
import * as redisStatus from 'redis-status'

export const checkMongoDBHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.locals.health.mongoose = mongoose.STATES[mongoose.connection.readyState]
    } catch (error) {
        return next(new ErrorHandler(500, `Error checking MongoDB health: ${(error as Error).message}`))
    }

    next()
}

export const checkStorageHealth = async () => {
    //no idea how to implement this
}

export const checkRedisHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const redisURI = new URL(process.env.REDIS_URI as string) || {}
        const redis = redisStatus({
            name: redisURI.pathname,
            port: redisURI.port,
            host: redisURI.hostname,
            password: redisURI.password
        })

        redis.checkStatus((err) => {
            err ? res.locals.healt.redis = err : res.locals.health.redis = 'healthy'
        })
    } catch (error) {
        return next(new ErrorHandler(500, `Error checking Redis health: ${(error as Error).message}`))
    }

    next()
}