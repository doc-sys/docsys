import { Socket } from 'socket.io'

interface IPopulatedSocket extends Socket {
    username?: string
    _id?: string
}

export default IPopulatedSocket