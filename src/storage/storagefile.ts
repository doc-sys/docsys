class StorageFile {
    fileId: string;
    origin: string;

    constructor(fileId: string, origin: string, body: Buffer) {
        this.fileId = fileId;
        this.origin = origin;
    }
}