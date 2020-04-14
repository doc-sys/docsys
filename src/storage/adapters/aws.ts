import aws from 'aws-sdk';

class S3Bucket implements StorageAdapter {
    private connection: any;
    constructor() {
        this.connection = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sslEnabled: true,
        });
    }
    async add(id: string, document: Buffer): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async addBulk(id: string, documents: Buffer[]): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async get(id: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
    async list(id: string): Promise<StorageFile[]> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}