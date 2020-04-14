class StorageFile {
    fileId: string;
    origin: string;
    body: Buffer;

    constructor(fileId: string, origin: string, body: Buffer) {
        this.fileId = fileId;
        this.origin = origin;
        this.body = body;
    }
}