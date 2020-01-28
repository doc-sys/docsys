let mongoose = require('mongoose')
let bcrypt = require('bcrypt')

SALT_FACTOR = 10

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
        }
    }
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

module.exports = mongoose.model('User', user)