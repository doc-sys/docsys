import Kevy from 'keyv'

export const socketStore = new Kevy(process.env.REDIS_URL, { namespace: 'socket' })
export const inviteStore = new Kevy(process.env.REDIS_URL, { namespace: 'invite' }) 