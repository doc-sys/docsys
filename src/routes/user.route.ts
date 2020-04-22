let express = require('express')

import authenticate, { requireAdmin } from '../lib/helpers/authenticate'
import { checkPropertyMail, checkPropertyName, checkPropertyPassword, checkPropertyUsername, authenticateUser, addUser, findUser, getAllUser, deleteUser, unlockUser, updateUser } from '../controller/user.controller';

let router = express.Router()

router.route('/').get([getAllUser], (req, res) => {
    res.status(200).json({ user: res.locals.user })
})

router.route('/:username').get([authenticate, checkPropertyUsername, findUser], (req, res) => {
    res.status(200).json({ user: res.locals.user })
}).delete([authenticate, requireAdmin, checkPropertyUsername, deleteUser], (req, res) => {
    res.status(200).json({ user: res.locals.user })
}).post([authenticate, checkPropertyUsername, updateUser], (req, res) => {
    res.status(200).json({ user: res.locals.user })
})

router.route('/login').post([checkPropertyUsername, checkPropertyPassword, authenticateUser], (req, res) => {
    res.status(200).json({ user: res.locals.user, token: res.locals.token })
})

router.route('/signup').post([checkPropertyUsername, checkPropertyMail, checkPropertyName, checkPropertyPassword, addUser, authenticateUser], (req, res) => {
    res.status(200).json({ user: res.locals.user, token: res.locals.token })
})

router.route('/unlock/:username').post([authenticate, requireAdmin, checkPropertyUsername, unlockUser], (req, res) => {
    res.status(200).json({ user: res.locals.user })
})

module.exports = router