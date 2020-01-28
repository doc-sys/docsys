module.exports = function getOCR(imagePath) {
    return new Promise(function(success, nosuccess) {
        const { spawn } = require('child_process')
        const py = spawn('python', ['./ocr.py', imagePath])
    
        py.stdout.on('data', function(data) {
            success(data)
        })
    
        py.stderr.on('data', function(data) {
            nosuccess(data)
        })
    })
}