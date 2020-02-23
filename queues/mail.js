require('dotenv').config({ path: '../.env' })

const nodemailer = require('nodemailer')
const Queue = require('bee-queue')
const queue = new Queue('mail', { isWorker: true })

let transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: process.env.SMTP_SECURE || false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
})

transporter.verify(function(error) {
	if (error) throw error
})

queue.process(async function(job, done) {
	try {
		let info = await transporter.sendMail({
			from: '"DocSys" <' + process.env.SMTP_USER + '>',
			to: job.data.to,
			subject: job.data.subject,
			html: job.data.text,
		})

		return done(null, info.messageId)
	} catch (error) {
		return done(error)
	}
})
