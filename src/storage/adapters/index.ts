import AWS from './aws'
import GridFS from './gridfs';
import Local from './local';
import AzureStorage from './azure';
import GoogleStorage from './google';
import StorageAdapter from './interface';

export default function getStorage(): StorageAdapter {
    switch (process.env.STORAGE_ENGINE) {
        case 'aws':
            return new AWS()
        case 'gridfs':
            return new GridFS()
        case 'local':
            return new Local()
        case 'azure':
            return new AzureStorage()
        case 'google':
            return new GoogleStorage()

        default:
            throw new Error(`Invalid Storage Type: ${process.env.STORAGE_ENGINE}`)
    }
}