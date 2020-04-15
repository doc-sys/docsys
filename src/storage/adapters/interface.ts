
interface StorageAdapter {
    add(id: string): Promise<string>;
    get(id: string): Promise<StorageFile>;
    delete(id: string): Promise<void>;
    list(id: string): Promise<StorageFile[]>;
}
