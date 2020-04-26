/* eslint-disable no-useless-escape */
let mongoose = require('mongoose')
let bcrypt = require('bcryptjs')
let sharp = require('sharp')

const SALT_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

let user = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		index: {
			unique: true,
		},
	},
	settings: {
		language: {
			type: String,
			enum: ['en', 'de'],
			default: 'en',
		},
		displayName: {
			type: String,
		},
	},
	avatar: {
		type: String,
		default:
			'/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABAAEADASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAMEBgUBB//EACoQAAICAQMDAwIHAAAAAAAAAAABAgMEERIhBTFREzJBYXEzQlKRocHh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APrYAAAtYOHLKk+dta7yOxVgY1a0Vak/MuQM6DQ29PxrF+GoPzHg42ZizxbNJcxftl5ArgAAAANNiVKnGrgvhc/cmI6JqymE12lFMkAFbqNStxLF8pbl90WSDNmq8W2T/S0BmgAAALODiSyrNO1a90v6AtdIyZxl6LjKUHymlrt/w7JHTVCmChXFRiSADh9WyZ2WentlCEfhrTX6ncIr6a74bLY6r+UBmAT5uNLFt2vmL9svJAB7FOUlGK1beiNLi0rHojXH47vyzi9Jr35sW+0U5GgAAAAAAK+bQsjHlD83eL+pm3w9H3NYZzqVarzbEuze79wP/9k',
	},
	password: {
		type: String,
		required: true,
	},
	mail: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		validate: [validateMail, 'Please provide a valid eMail address'],
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please provide a valid eMail address',
		],
	},
	loginAttempts: {
		type: Number,
		required: true,
		default: 0,
	},
	lockUntil: {
		type: Number,
		default: null,
	},
})

user.virtual('isLocked').get(function () {
	return !!(this.lockUntil && this.lockUntil > Date.now())
})

user.pre('save', function (next) {
	var thisUser = this

	if (!thisUser.isModified('password')) return next()
	bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) return next(err)
		bcrypt.hash(thisUser.password, salt, function (err, hash) {
			if (err) return next(err)
			thisUser.password = hash
			next()
		})
	})
})

/**
 * Saves the avatar after resizing it
 * @param {Buffer} avatar The image buffer
 */
user.methods.saveAvatar = async function (avatar) {
	let newAvatar = await sharp(avatar).resize(64, 64).toBuffer()

	this.avatar = newAvatar
}

user.methods.comparePassword = function (pwd) {
	let userpwd = this.password
	return new Promise(function (resolve, reject) {
		if (typeof pwd == 'undefined') {
			reject('Please provide password')
		}
		bcrypt.compare(pwd, userpwd, function (err, isMatch) {
			if (err) {
				reject(err)
			} else {
				resolve(isMatch)
			}
		})
	})
}

user.methods.incLoginAttempts = function () {
	return new Promise((resolve, reject) => {
		try {
			if (this.lockUntil && this.lockUntil < Date.now()) {
				return resolve(
					this.update({
						$set: { loginAttempts: 1 },
						$unset: { lockUntil: 1 },
					})
				)
			}

			var updates = { $inc: { loginAttempts: 1 } }
			if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
				updates.$set = { lockUntil: Date.now() + LOCK_TIME }
			}

			return resolve(this.update(updates))
		} catch (error) {
			reject(new Error(error.message))
		}
	})
}

user.statics.getAuthenticated = async function (username, password) {
	return new Promise((resolve, reject) => {
		this.findOne({ username: username }, async function (err, thisUser) {
			if (err) return reject(new Error(err))

			if (!thisUser) {
				return reject(new Error('User could not be found'))
			}

			if (thisUser.isLocked) {
				await thisUser.incLoginAttempts
				return reject(new Error('User is locked'))
			}

			if (!password) {
				return reject(new Error('Password missing'))
			}

			let compareResult = await thisUser.comparePassword(password)
			if (compareResult) {
				if (thisUser.isLocked && thisUser.lockUntil > Date.now()) {
					await thisUser.update({ $set: { loginAttempts: 0 } })
					return reject(new Error('User is locked'))
				}

				var updates = {
					$set: { loginAttempts: 0 },
					$unset: { lockUntil: 1 },
				}

				return thisUser.update(updates, function (err) {
					if (err) return reject(err)
					return resolve(thisUser)
				})
			}

			await thisUser.incLoginAttempts()
			return reject(new Error('Password incorrect'))
		})
	})
}

function validateMail(mail) {
	var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	return re.test(mail)
}

module.exports = { user: mongoose.model('User', user) }
