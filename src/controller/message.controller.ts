import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from '../lib/helpers/error';
import { conversation } from '../models/conversation'

import { v4 as uuid } from 'uuid'

export const createNewConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversationBody = {
            convoId: uuid(),
            participants: [
                ...req.body.participants,
                res.locals.auth_user._id
            ],
            messages: [
                {
                    from: res.locals.auth_user._id,
                    content: req.body.message
                }
            ]
        }
        let newConversation = new conversation(conversationBody)
        await newConversation.save()
        newConversation = await newConversation.populate('participants')
        res.locals.conversationId = newConversation
    } catch (error) {
        return next(new ErrorHandler(500, `Error creating conversation: ${(error as Error).message}`))
    }

    next()
}

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversations = await conversation.find({ participants: { '$in': [res.locals.auth_user._id] } }).populate('participants').sort([['lastMessage', -1]]).select('convoId lastMessage participants').exec()
        res.locals.conversations = conversations
    } catch (error) {
        return next(new ErrorHandler(500, `Error creating conversation: ${(error as Error).message}`))
    }

    next()
}

export const getConversationHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const history = await conversation.find({ convoId: req.params.convoid || req.body.convoid }).populate('messages.from').sort([['messages.timestamp', 1]]).select('messages convoId').exec()
        console.log(history)
        res.locals.history = history[0]
    } catch (error) {
        return next(new ErrorHandler(500, `Error creating conversation: ${(error as Error).message}`))
    }

    next()
}