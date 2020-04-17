import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuid } from 'uuid'
import { ReadStream, WriteStream } from 'fs';
import StorageAdapter from './interface';

export default class Local implements StorageAdapter {
    private path: string

    constructor() {
        if (process.env.LOCAL_STORAGE_DIR === undefined) throw Error("LOCAL_STORAGE_DIR is not a defined env variable!")

        this.path = process.env.LOCAL_STORAGE_DIR
    }

    async add(stream: ReadStream): Promise<string> {
        const fileId = uuid()
        return new Promise((resolve, reject) => {
            let wStream = fs.createWriteStream(path.join('./', this.path, fileId))
            stream.pipe(wStream).on('error', (error) => reject(error)).on('finish', () => resolve(fileId))
        })
    }

    async get(id: string, stream: WriteStream): Promise<void> {
        return new Promise((resolve, reject) => {
            let rStream = fs.createReadStream(path.join('./', this.path, id))
            rStream.pipe(stream).on('error', (error) => reject(error)).on('finish', () => resolve())
        })
    }

    async delete(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(path.join('./', this.path, id), (error) => {
                if (error) reject(error)
                resolve()
            })
        })
    }

    async archive(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            reject(new Error('The storage backend does not support this function'))
        })
    }

}