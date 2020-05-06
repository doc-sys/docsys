import { ReadStream, WriteStream } from 'fs'
import StorageAdapter from './interface'
import { BlobServiceClient, StorageSharedKeyCredential, ContainerClient } from '@azure/storage-blob'
import { v4 as uuid } from 'uuid'

export default class AzureStorage implements StorageAdapter {
    private client: BlobServiceClient
    private bucket: ContainerClient


    constructor() {
        if (process.env.AZURE_ACCOUNT_NAME === undefined) throw Error("AZURE_ACCOUNT_NAME is not a defined env variable!")
        if (process.env.AZURE_ACCOUNT_KEY === undefined) throw Error("AZURE_ACCOUNT_KEY is not a defined env variable!")
        if (process.env.AZURE_CONTAINER_NAME === undefined) throw Error("AZURE_CONTAINER_NAME is not a defined env variable!")

        this.client = new BlobServiceClient(`https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net`, new StorageSharedKeyCredential(process.env.AZURE_ACCOUNT_NAME, process.env.AZURE_ACCOUNT_KEY))
        this.bucket = this.client.getContainerClient(process.env.AZURE_CONTAINER_NAME)
    }

    async add(stream: ReadStream): Promise<string> {
        const fileId = uuid()

        return new Promise(async (resolve, reject) => {
            let blobClient = await this.bucket.getBlockBlobClient(fileId)
            let uploadResponse = blobClient.uploadStream(stream)

            uploadResponse.then(() => {
                resolve(fileId)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    async get(id: string, stream: WriteStream): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let blobClient = await this.bucket.getBlockBlobClient(id)
            let downloadResponse = await blobClient.download()

            downloadResponse.readableStreamBody?.pipe(stream).on('error', (error) => reject(error)).on('finish', () => resolve())
        })
    }

    async delete(id: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let blobClient = await this.bucket.getBlockBlobClient(id)
            let _delete = blobClient.delete()

            _delete.then(() => resolve()).catch((error) => reject(error))
        })
    }

    async archive(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            reject(new Error('The storage backend does not support this function'))
        })
    }
}