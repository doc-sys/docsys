const sio = require('socket.io')
import * as jwt from 'jsonwebtoken'
import { socketStore } from './lib/helpers/keystore';
import { Namespace, Socket } from 'socket.io';

const io: SocketIO.Server = new sio()

// Permit all origins
io.origins((o, cb) => {
    cb(null, true)
})

// Verify token on request handshake
io.use(async (socket: Socket, next) => {
    let token = socket.handshake.query.token
    if (token) {
        try {
            let user = await jwt.verify(token, process.env.JWT_SECRET)
            socket.username = user.username
            return next()
        } catch {
            return next(new Error('Auth failed'))
        }
    }
    return next(new Error('Auth not valid'))
})

// Export namespaces for messaging and notifications
export const notification_channel: Namespace = io.of('/notifications')
export const message_channel: Namespace = io.of('/message')

// Update key/value store holding socket IDs on connect/disconnect
io.on('connection', async (socket) => {
    socket.on('disconnect', async () => {
        console.log(`removing ${socket.username} from redis`)
        await socketStore.delete(socket.username)
    })

    if (!await socketStore.get(socket.username)) {
        console.log(`adding to redis: ${socket.username} with ${socket.id}`)
        await socketStore.set(socket.username, socket.id)
    }

})

// Distribute messages
message_channel.on('connection', (socket) => {
    console.log(socket.token)

    //Handle convo join
    socket.on('join', (data) => {
        socket.join(data.convoId)
    })

    //Handle new message
    socket.on('message', (data) => {
        //save in db
        //emit to other recps
        socket.to(data.convoId).emit(data.message)
    })

    //Leave conversation
    socket.on('leave', (data) => {
        socket.leave(data.convoId)
    })
})

export default io