/* module.exports = {
    getOCR: function (imagePath) {
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
} */

module.exports = async function getOCR(imageBuffer) {
	const { createWorker } = require('tesseract.js')

	const worker = createWorker({
		logger: m => console.log(m),
		corePath: 'C:Program/Files/Tesseract-OCR',
	})
	worker.load()
	worker.loadLanguage('de')
	worker.initialize('de')

	const {
		data: { text },
	} = await worker.recognize(imageBuffer)
	return text
}
