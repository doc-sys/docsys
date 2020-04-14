class GridFS implements StorageAdapter {
    constructor() {
        throw new Error("Method not implemented.");
    }
    async add(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async get(id: string): Promise<StorageFile> {
        throw new Error("Method not implemented.");
    }
    async list(id: string): Promise<StorageFile[]> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}