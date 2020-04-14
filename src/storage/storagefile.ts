const mongoose = require('mongoose')
const document = require('../models/document.js')

class StorageFile {
    fileId: string;
    origin: string;
    body: Buffer;

    constructor(title: string, created: Date, dated: Date, owner: string, ) {

    }


}