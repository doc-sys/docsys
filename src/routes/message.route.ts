import express from 'express';
import { checkSchema, ParamSchema } from 'express-validator'
import authenticate from '../lib/helpers/authenticate'
import { checkSchemaValidation } from '../lib/helpers/validator'

import { createNewConversation, getConversations, getConversationHistory } from '../controller/message.controller';

import * as initiate from '../lib/requestSchemas/message.initiateConvo.json'
import * as getHistory from '../lib/requestSchemas/message.getHistory.json'

const router = express.Router()

router.route('/')
    /**
     * @api {get} /message/ Get conversations
     * @apiName messagesGetConvos
     * @apiGroup Messages
     * @apiDescription Gets the conversations for a single user. The actual messages are not send.
     * @apiSuccess {Array} conversations All conversations involving the user
     * @apiError (401) {String} AuthentificationError Not allowed to access ressource
     */
    .get([authenticate, getConversations], (req, res) => {
        res.status(200).json(res.locals.conversations)
    })
    /**
    /**
     * @api {post} /message/ Create conversations
     * @apiName messagesCreateConvo
     * @apiGroup Messages
     * @apiDescription Initiates a new conversation.
     * @apiSuccess {String} convoId The conversation id
     * @apiError (401) {String} AuthentificationError Not allowed to access ressource
     */
    .post([authenticate, checkSchema(initiate as Record<string, ParamSchema>) as never, checkSchemaValidation, createNewConversation], (req, res) => {
        res.status(200).json(res.locals.conversationId)
    })

router.route('/:convoid')
    /**
     * @api {get} /message/:convoid Get messages
     * @apiName messagesGetMessages
     * @apiGroup Messages
     * @apiDescription Gets the actual messages of a single conversation
     * @apiSuccess {Array} messages All messages in that conversation already ordered
     * @apiError (401) {String} AuthentificationError Not allowed to access ressource
     */
    .get([authenticate, checkSchema(getHistory as Record<string, ParamSchema>) as never, checkSchemaValidation, getConversationHistory], (req, res) => {
        res.status(200).json(res.locals.history)
    })

export default router