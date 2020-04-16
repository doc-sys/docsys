import aws, { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid'
import { ReadStream, WriteStream } from 'fs';
import StorageAdapter from './interface';

class S3Bucket implements StorageAdapter {
    private connection: aws.S3
    private bucket_name: string

    constructor() {
        if (process.env.AWS_ACCESS_KEY_ID === undefined) throw Error("AWS_ACCESS_KEY_ID is not a defined env variable!")
        if (process.env.AWS_SECRET_ACCESS_KEY === undefined) throw Error("AWS_SECRET_ACCESS_KEY is not a defined env variable!")
        if (process.env.AWS_BUCKET_NAME === undefined) throw Error("AWS_BUCKET_NAME is not a defined env variable!")

        this.connection = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sslEnabled: true,
            apiVersion: '2006-03-01'
        })

        this.bucket_name = process.env.AWS_BUCKET_NAME
    }

    async add(stream: ReadStream): Promise<string> {
        const fileId = uuid()
        const params: aws.S3.PutObjectRequest = { Bucket: this.bucket_name, Key: fileId, Body: stream, StorageClass: process.env.AWS_INTELLIGENT_TIERING ? 'INTELLIGENT_TIERING' : 'STANDARD' }
        return new Promise((resolve, reject) => {
            let upload: Promise<aws.S3.ManagedUpload.SendData> = this.connection.upload(params).promise()

            upload.then((data) => {
                resolve(data.Key)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    async get(id: string, stream: WriteStream): Promise<void> {
        const params: aws.S3.GetObjectRequest = { Bucket: this.bucket_name, Key: id }

        return new Promise((resolve, reject) => {
            let download = this.connection.getObject(params).createReadStream()
            download.on('error', (error) => reject(error))

            download.pipe(stream).on('error', (error) => reject(error)).on('finish', () => resolve())
        })
    }

    async delete(id: string): Promise<void> {
        const params: aws.S3.DeleteObjectRequest = { Bucket: this.bucket_name, Key: id }

        return new Promise((resolve, reject) => {
            let _delete = this.connection.deleteObject(params).promise()

            _delete.then(() => resolve()).catch((error) => reject(error))
        })
    }

    async archive(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            reject(new Error('The storage backend does not support this function'))
        })
    }

}