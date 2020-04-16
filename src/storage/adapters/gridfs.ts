import { ReadStream, WriteStream } from 'fs';
import StorageAdapter from './interface';
import {
    Db,
    ObjectId,
    MongoClient,
    GridFSBucket,
    GridFSBucketReadStream,
    GridFSBucketWriteStream
} from 'mongodb'

export default class GridFS implements StorageAdapter {
    private client: MongoClient;
    private ready: Promise<void>;
    private db!: Db;
    private bucket!: GridFSBucket;
    constructor() {
        if (process.env.GRIDFS_PATH === undefined) throw Error("GRIDFS_PATH is not a defined env variable!");
        this.client = new MongoClient(process.env.GRIDFS_PATH);
        this.ready = new Promise(resolve => {
            this.client.connect(() => {
                this.db = this.client.db("file_storage");
                this.bucket = new GridFSBucket(this.db);
                resolve();
            });
        });
    }

    async add(fileStream: ReadStream): Promise<string> {
        await this.ready;
        const stream: GridFSBucketWriteStream = this.bucket.openUploadStream("untitled");
        return new Promise((resolve, reject) => {
            fileStream.pipe(stream).on('finish', () => {
                resolve(stream.id.toString());
            }).on('error', (error) => {
                reject(error);
            });
        })
    }

    async get(id: string, stream: WriteStream): Promise<void> {
        await this.ready;
        const bucketStream: GridFSBucketReadStream = this.bucket.openDownloadStream(new ObjectId(id));
        return new Promise((resolve, reject) => {
            bucketStream.pipe(stream).on('finish', () => {
                resolve();
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    async delete(id: string): Promise<void> {
        await this.ready;
        this.bucket.delete(new ObjectId(id));
    }

    async archive(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            reject(new Error('The storage backend does not support this function'))
        })
    }
}