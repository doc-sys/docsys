import { ReadStream, WriteStream } from 'fs'
import StorageAdapter from './interface'
import { Storage } from '@google-cloud/storage'
import { v4 as uuid } from 'uuid'

export default class GoogleStorage implements StorageAdapter {
    private client: any
    private bucket_name: string | undefined


    constructor() {
        if (process.env.GC_CLIENT_EMAIL === undefined) throw Error("GC_CLIENT_EMAIL is not a defined env variable!")
        if (process.env.GC_PRIVATE_KEY === undefined) throw Error("GC_PRIVATE_KEY is not a defined env variable!")
        if (process.env.GC_BUCKET_NAME === undefined) throw Error("GC_BUCKET_NAME is not a defined env variable!")


        this.client = new Storage({
            credentials: {
                client_email: process.env.GC_CLIENT_EMAIL,
                private_key: process.env.GC_PRIVATE_KEY
            }
        })
        this.bucket_name = process.env.GC_BUCKET_NAME
    }

    async add(stream: ReadStream): Promise<string> {
        const fileId = uuid()
        return new Promise((resolve, reject) => {
            stream.pipe(this.client.bucket(this.bucket_name).file(fileId).createWriteStream({ gzip: true }))
                .on('error', (error: any) => reject(error))
                .on('finish', () => { resolve(fileId) })
        })
    }

    async get(id: string, stream: WriteStream): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.bucket(this.bucket_name).file(id).createReadStream()
                .on('error', (error: any) => reject(error))
                .on('end', () => resolve())
        })
    }

    async delete(id: string): Promise<void> {
        return this.client.bucket(this.bucket_name).file(id).delete()
    }

    async archive(id: string): Promise<void> { }
}