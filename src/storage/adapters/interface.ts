import { ReadStream, WriteStream } from 'fs';

export default interface StorageAdapter {
    add(stream: ReadStream): Promise<string>;
    get(id: string, stream: WriteStream): Promise<void>;
    delete(id: string): Promise<void>;
    archive(id: string): Promise<void>;
}
