import { ReadStream, WriteStream } from 'fs';
import { Writable } from 'stream';

export default interface StorageAdapter {
    add(id: ReadStream): Promise<string>;
    get(id: string, stream: WriteStream): Promise<void>;
    delete(id: string): Promise<void>;
}
