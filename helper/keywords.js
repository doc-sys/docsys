let rake = require('node-rake')

module.exports = function getKeywords(text) {
    return rake.generate(text)
}