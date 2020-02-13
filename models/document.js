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
        required: false
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    lockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    mime: {
        type: String
    },
    extension: {
        type: String
    }
})

document.virtual('locked')
    .get(() => {
        if(this.lockedBy == null) {
            return false
        } else {
            return true
        }
    })

/* document.pre('save', async function(next) {
    try {
        let ocr = await getOCR(this.fileId)
        let keywords = await getKeywords(ocr)
    } catch (error) {
        next(error)
    }
    this.content = ocr
    this.keywords = keywords
}) */

module.exports = mongoose.model('Doc', document)