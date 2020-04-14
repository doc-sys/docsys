
interface StorageAdapter {
    add(id: string, document: Buffer): Promise<boolean>;
    addBulk(id: string, documents: Buffer[]): Promise<boolean>
    get(id: string): Promise<Buffer>;
    delete(id: string): Promise<void>;
    list(id: string): Promise<StorageFile[]>;
}
