import { WriteStream } from 'fs';
import { Readable } from 'stream'

export default interface StorageAdapter {
    add(stream: Readable): Promise<string>;
    delete(id: string): Promise<void>;
    archive(id: string): Promise<void>;
}
