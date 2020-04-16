import aws from 'aws-sdk';
import { ReadStream, WriteStream } from 'fs';
import { Writable } from 'stream';
import StorageAdapter from './interface';

class S3Bucket implements StorageAdapter {
    private connection: any;
    constructor() {
        this.connection = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sslEnabled: true,
        });
    }
    async add(id: ReadStream): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async get(id: string, stream: WriteStream): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}