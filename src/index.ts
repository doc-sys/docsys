/* eslint-disable no-console */
/**
 * Module dependencies.
 */

import app from './app';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('docsys:server')
import http from 'http';

import io from './socket';

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3001')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

// /**
//  * Create WebSocket server
//  */

io.attach(server)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: number | string) {
	const port = parseInt(val as string, 10)


	if (isNaN(port)) {
		// named pipe
		return val
	}

	if (port >= 0) {
		// port number
		return port
	}

	return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error
	}

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges')
			process.exit(1)
			break
		case 'EADDRINUSE':
			console.error(bind + ' is already in use')
			process.exit(1)
			break
		default:
			throw error
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const addr: any = server.address()
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
	debug('Listening on ' + bind)
}
