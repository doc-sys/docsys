let mongoose = require('mongoose')
let bcrypt = require('bcrypt')

SALT_FACTOR = 10
MAX_LOGIN_ATTEMPTS = 10
LOCK_TIME = 2 * 60 * 60 * 1000

let user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        mail: {
            type: String,
            required: true
        },
        loginAttempts: {
            type: Number,
            required: true,
            default: 0
        },
        lockUntil: {
            type: Number
        }
    }
})

var reasons = user.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
}

user.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

user.pre('save', (next) => {
    var user = this

    if(!user.isModified('password')) return next()
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if(err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err)
            user.password = hash
            next()
        })
    })
})

user.methods.comparePassword = function(pwd) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(pwd, this.password, function(err, isMatch) {
            if(err) {
                reject(err)
            } else {
                resolve(isMatch)
            } 
        })
    })
}

user.methods.incLoginAttempts = function() {
    return new Promise(function(resolve, reject) {
        if(this.lockUntil && this.lockUntil < Date.now()) {
            return resolve(this.update({
                $set: { loginAttempts: 1 },
                $unset: { lockUntil: 1 }
            }))
        }

        var updates = { $inc: { loginAttempts: 1 } }
        if(this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
            updates.$set = { lockUntil: Date.now() + LOCK_TIME }
        }

        return resolve(this.update(updates))
    })
}

user.statics.getAuthenticated = async function(username, password) {
    this.findOne({ username: username }, function(err, thisUser) {
        if(err) return reject(err)

        if(!thisUser) return reject(reasons.NOT_FOUND)

        if(thisUser.isLocked) {
            await thisUser.incLoginAttempts
            return reject(reasons.MAX_ATTEMPTS)
        }

        let compareResult = await thisUser.comparePassword(password)
        if(compareResult) {
            if(!thisUser.loginAttempts && !user.lockUntil) return resolve(thisUser)

            var updates = {
                $set: { loginAttempts: 0 },
                $unset: { lockUntil: 1 }
            }

            return thisUser.update(updates, function(err) {
                if(err) return reject(err)
                return resolve(thisUser)
            })
        }

        await thisUser.incLoginAttempts
        return reject(reasons.PASSWORD_INCORRECT)
    })
}

module.exports = mongoose.model('User', user)