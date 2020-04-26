let express = require('express')
import { checkSchema } from 'express-validator'

import authenticate, { requireAdmin } from '../lib/helpers/authenticate'
import { authenticateUser, addUser, findUser, getAllUser, deleteUser, unlockUser, updateUser } from '../controller/user.controller';

import signup from '../lib/requestSchemas/user.createNew.json'
import login from '../lib/requestSchemas/user.login.json'
import username from '../lib/requestSchemas/user.username.json'
import { checkSchemaValidation } from '../lib/helpers/validator';

let router = express.Router()

router.route('/')
    /**
     * @api {get} /user/ Get All Users
     * @apiName UserNameAutoComplete
     * @apiGroup User
     * @apiDescription Gives back the full user list
     * @apiSuccess {Array} user List of user profiles
     * @apiError (500) {String} InternalError Something went wrong.
     */
    .get([authenticate, getAllUser], (req, res) => {
        res.status(200).json({ user: res.locals.user })
    })

router.route('/login')
    /**
     * @api {post} /user/login User login
     * @apiName userLogin
     * @apiGroup User
     * @apiDescription Logs user in and returns the user and API token
     * @apiParam {String} username
     * @apiParam {String} password
     * @apiSuccess {Object} user User profile
     * @apiSuccess {String} token API token
     * @apiError (401) {String} LoginFailed
     */
    .post([checkSchema(login as any), checkSchemaValidation, authenticateUser], (req, res) => {
        res.status(200).json({ user: res.locals.user, token: res.locals.token })
    })

router.route('/signup')
    /**
     * @api {post} /user/signup User signup
     * @apiName userSignup
     * @apiGroup User
     * @apiDescription Signs user up and logs in automatically
     * @apiParam {String} username Username
     * @apiParam {String} password Password according to policy
     * @apiParam {String} mail Valid email
     * @apiParam {String} displayName Full name
     * @apiSuccess {Object} user User profile
     * @apiSuccess {String} token API token
     * @apiError (500) {String} InternalError Something went wrong during signup. Most likely to be during validation.
     * @apiDeprecated Users should not be allowed to sign up by themselfes but rather be invited to use docSys
     */
    .post([checkSchema(signup as any), checkSchemaValidation, addUser, authenticateUser], (req, res) => {
        res.status(200).json({ user: res.locals.user, token: res.locals.token })
    })

router.route('/unlock/:username')
    /**
         * @api {post} /user/unlock/:username Unlock locked user
         * @apiName userUnlock
         * @apiGroup User
         * @apiDescription Unlocks user and sets login attempts to 0
         * @apiParam {String} username Username
         * @apiSuccess {Object} user User profile
         * @apiError (401) {String} AuthentificationError Not allowed to access ressource
         */
    .post([authenticate, requireAdmin, checkSchema(username as any), checkSchemaValidation, unlockUser], (req, res) => {
        res.status(200).json({ user: res.locals.user })
    })


router.route('/:username')
    /**
     * @api {get} /user/:username Get single user
     * @apiName userGetSingle
     * @apiGroup User
     * @apiDescription Returns a single user object without password
     * @apiParam {String} username
     * @apiSuccess {Object} user User profile
     * @apiError (401) {String} AuthentificationError Not allowed to access ressource
     */
    .get([authenticate, checkSchema(username as any), checkSchemaValidation, findUser], (req, res) => {
        res.status(200).json({ user: res.locals.user })
    })
    /**
     * @api {delete} /user/:username Delete user
     * @apiName userDeleteSingle
     * @apiGroup User
     * @apiDescription Deletes a single user
     * @apiParam {String} username
     * @apiSuccess {Object} user Username
     * @apiError (401) {String} AuthentificationError Not allowed to access ressource
     */
    .delete([authenticate, requireAdmin, checkSchema(username as any), checkSchemaValidation, deleteUser], (req, res) => {
        res.status(200).json({ user: res.locals.user })
    })
    /**
     * @api {post} /user/:username Update user
     * @apiName userUpdateSingle
     * @apiGroup User
     * @apiDescription Updates a single user. Changes every property that is set in the request body.
     * @apiParam {String} username
     * @apiSuccess {Object} user Updated user object
     * @apiError (401) {String} AuthentificationError Not allowed to access ressource
     */
    .post([authenticate, checkSchema(username as any), checkSchemaValidation, updateUser], (req, res) => {
        res.status(200).json({ user: res.locals.user })
    })

module.exports = router