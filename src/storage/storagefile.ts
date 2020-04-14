class StorageFile {
    fileId: string;

    constructor(fileId: string, origin: string, body: Buffer) {
        this.fileId = fileId;
    }
}