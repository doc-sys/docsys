import sio from 'socket.io'
import * as jwt from 'jsonwebtoken'
import { socketStore } from './lib/helpers/keystore'
import { Namespace } from 'socket.io'
import IPopulatedSocket from './lib/interfaces/socket'

import { conversation } from './models/conversation'
import { user } from './models/user'

const io: SocketIO.Server = sio()

// Permit all origins
io.origins((o, cb) => {
    cb(null, true)
})

// Verify token on request handshake
io.use(async (socket: IPopulatedSocket, next) => {
    const token = socket.handshake.query.token
    if (token) {
        try {
            const user = await jwt.verify(token, process.env.JWT_SECRET)
            socket.username = user.username
            return next()
        } catch {
            return next(new Error('Auth failed'))
        }
    }
    return next(new Error('Auth not valid'))
})

// Export namespaces for messaging and notifications
export const notification_channel: Namespace = io.of('/api/notifications')
export const message_channel: Namespace = io.of('/api/message')

// Auth for each namespace
notification_channel.use(async (socket: IPopulatedSocket, next) => {
    const token = socket.handshake.query.token
    if (token) {
        try {
            const user = await jwt.verify(token, process.env.JWT_SECRET)
            socket.username = user.username
            return next()
        } catch {
            return next(new Error('Auth failed'))
        }
    }
    return next(new Error('Auth not valid'))
})

message_channel.use(async (socket: IPopulatedSocket, next) => {
    const token = socket.handshake.query.token
    if (token) {
        try {
            const user = await jwt.verify(token, process.env.JWT_SECRET)
            socket.username = user.username
            socket._id = user._id
            return next()
        } catch {
            return next(new Error('Auth failed'))
        }
    }
    return next(new Error('Auth not valid'))
})

// Update key/value store holding socket IDs on connect/disconnect
io.on('connection', async (socket: IPopulatedSocket) => {
    socket.on('disconnect', async () => {
        //TODO: logging console.log(`removing ${socket.username} from redis`)
        await socketStore.delete(socket.username)
    })

    if (!await socketStore.get(socket.username)) {
        //TODO: logging console.log(`adding to redis: ${socket.username} with ${socket.id}`)
        await socketStore.set(socket.username, socket.id)
    }
})

notification_channel.on('connection', () => {
    //TODO: logging console.log(`${socket.username} connected to notification channel`)
})

// Distribute messages
message_channel.on('connection', (socket: IPopulatedSocket) => {
    //TODO: logging console.log(`${socket.username} connected to message channel`)

    //Handle convo join
    socket.on('join', (data) => {
        socket.join(data.convoId)
    })

    //Handle new message
    socket.on('message', async (type, data) => {
        //save in db
        //emit to other recps
        const convo = await conversation.findOne({ convoId: data.convoId }).populate('participants')
        const us = await user.findOne({ _id: socket._id })
        delete us.password, us.loginAttempts, us.lockUntil

        convo.messages.push({
            from: socket._id,
            content: data.message,
            timestamp: Date.now()
        })
        await convo.save()

        const payload = convo.messages[convo.messages.length - 1]
        payload.from = us

        await emitMessage([...convo.participants.map(e => e.username) as [string]], {
            payload: payload,
            convoId: data.convoId
        })
    })

    //Leave conversation
    socket.on('leave', (data) => {
        socket.leave(data.convoId)
    })
})

interface messageIf {
    payload: Record<string, unknown>,
    convoId: string
}

// helper function
async function emitMessage(recps: [string], message: messageIf) {
    for (const recp of recps) {
        const recp_adress: string = await socketStore.get(recp)
        if (recp_adress) {
            //TODO: logging console.log(`emitting to ${recp_adress}`)
            message_channel.to(`/api/message#${recp_adress}`).emit('message', message)
        }
    }
}

export default io