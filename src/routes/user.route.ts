let express = require('express')
//import { Router } from 'express'
import { checkPropertyMail, checkPropertyName, checkPropertyPassword, checkPropertyUsername, authenticateUser, addUser, findUser } from '../controller/user.controller';

let router = express.Router()

router.route('/').get([checkPropertyUsername, findUser], (req, res) => {
    res.status(200).json({ user: res.locals.user })
})


router.route('/login').post([checkPropertyUsername, checkPropertyPassword, authenticateUser], (req, res) => {
    res.status(200).json({ user: res.locals.user, token: res.locals.token })
})

router.route('/signup').post([checkPropertyUsername, checkPropertyMail, checkPropertyName, checkPropertyPassword, addUser, authenticateUser], (req, res) => {
    res.status(200).json({ user: res.locals.user, token: res.locals.token })
})

export { router }