const sio = require('socket.io')


const io = new sio({
    serveClient: false,
    path: '/socket.io'
})

io.origins((o, cb) => {
    cb(null, true)
})

io.use((socket, next) => {
    let token = socket.handshake.query.token
    if (token) {
        socket.token = token
        return next()
    }
    return next(new Error('Auth not valid'))
})

const notification_channel = io.of('/notifications')
const message_channel = io.of('/message')

io.on('connection', (socket) => {
    //update socket id with username and online status
})

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