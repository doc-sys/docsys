let mongoose = require('mongoose')
let { getOCR } = require('../helper/ocr')
let { getKeywords } = require('../helper/keywords')

let document = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
    dated: {
        type: Date
    },
    content: {
        type: String
    },
    keywords: {
        type: [String],
        minlength: 3
    },
    fileId: {
        type: String,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    access: {
        type: String,
        enum: ['PUBLIC', 'PRIVATE', 'INTERNAL'],
        default: 'PRIVATE'
    }
})

document.pre('save', async function(next) {
    try {
        let ocr = await getOCR(this.fileId)
        let keywords = await getKeywords(ocr)
    } catch (error) {
        next(error)
    }
    this.content = ocr
    this.keywords = keywords
})

module.exports = mongoose.model('Doc', document)