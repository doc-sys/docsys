"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _socket = _interopRequireDefault(require("./socket"));

/**
 * Module dependencies.
 */
var app = require('./app');

var debug = require('debug')('docsys:server');

var http = require('http');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);
/**
 * Create HTTP server.
 */

var server = http.createServer(app); // /**
//  * Create WebSocket server
//  */

_socket["default"].attach(server);
/**
 * Listen on provided port, on all network interfaces.
 */


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port; // handle specific listen errors with friendly messages

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJhcHAiLCJyZXF1aXJlIiwiZGVidWciLCJodHRwIiwicG9ydCIsIm5vcm1hbGl6ZVBvcnQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsInNldCIsInNlcnZlciIsImNyZWF0ZVNlcnZlciIsImlvIiwiYXR0YWNoIiwibGlzdGVuIiwib24iLCJvbkVycm9yIiwib25MaXN0ZW5pbmciLCJ2YWwiLCJwYXJzZUludCIsImlzTmFOIiwiZXJyb3IiLCJzeXNjYWxsIiwiYmluZCIsImNvZGUiLCJjb25zb2xlIiwiZXhpdCIsImFkZHIiLCJhZGRyZXNzIl0sIm1hcHBpbmdzIjoiOzs7O0FBUUE7O0FBUkE7OztBQUlBLElBQUlBLEdBQUcsR0FBR0MsT0FBTyxDQUFDLE9BQUQsQ0FBakI7O0FBQ0EsSUFBSUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsT0FBRCxDQUFQLENBQWlCLGVBQWpCLENBQVo7O0FBQ0EsSUFBSUUsSUFBSSxHQUFHRixPQUFPLENBQUMsTUFBRCxDQUFsQjs7QUFJQTs7O0FBSUEsSUFBSUcsSUFBSSxHQUFHQyxhQUFhLENBQUNDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxJQUFaLElBQW9CLE1BQXJCLENBQXhCO0FBQ0FSLEdBQUcsQ0FBQ1MsR0FBSixDQUFRLE1BQVIsRUFBZ0JMLElBQWhCO0FBRUE7Ozs7QUFJQSxJQUFJTSxNQUFNLEdBQUdQLElBQUksQ0FBQ1EsWUFBTCxDQUFrQlgsR0FBbEIsQ0FBYixDLENBRUE7QUFDQTtBQUNBOztBQUVBWSxtQkFBR0MsTUFBSCxDQUFVSCxNQUFWO0FBRUE7Ozs7O0FBSUFBLE1BQU0sQ0FBQ0ksTUFBUCxDQUFjVixJQUFkO0FBQ0FNLE1BQU0sQ0FBQ0ssRUFBUCxDQUFVLE9BQVYsRUFBbUJDLE9BQW5CO0FBQ0FOLE1BQU0sQ0FBQ0ssRUFBUCxDQUFVLFdBQVYsRUFBdUJFLFdBQXZCO0FBRUE7Ozs7QUFJQSxTQUFTWixhQUFULENBQXVCYSxHQUF2QixFQUFpQztBQUNoQyxNQUFJZCxJQUFJLEdBQUdlLFFBQVEsQ0FBQ0QsR0FBRCxFQUFNLEVBQU4sQ0FBbkI7O0FBR0EsTUFBSUUsS0FBSyxDQUFDaEIsSUFBRCxDQUFULEVBQWlCO0FBQ2hCO0FBQ0EsV0FBT2MsR0FBUDtBQUNBOztBQUVELE1BQUlkLElBQUksSUFBSSxDQUFaLEVBQWU7QUFDZDtBQUNBLFdBQU9BLElBQVA7QUFDQTs7QUFFRCxTQUFPLEtBQVA7QUFDQTtBQUVEOzs7OztBQUlBLFNBQVNZLE9BQVQsQ0FBaUJLLEtBQWpCLEVBQTZCO0FBQzVCLE1BQUlBLEtBQUssQ0FBQ0MsT0FBTixLQUFrQixRQUF0QixFQUFnQztBQUMvQixVQUFNRCxLQUFOO0FBQ0E7O0FBRUQsTUFBSUUsSUFBSSxHQUFHLE9BQU9uQixJQUFQLEtBQWdCLFFBQWhCLEdBQTJCLFVBQVVBLElBQXJDLEdBQTRDLFVBQVVBLElBQWpFLENBTDRCLENBTzVCOztBQUNBLFVBQVFpQixLQUFLLENBQUNHLElBQWQ7QUFDQyxTQUFLLFFBQUw7QUFDQ0MsTUFBQUEsT0FBTyxDQUFDSixLQUFSLENBQWNFLElBQUksR0FBRywrQkFBckI7QUFDQWpCLE1BQUFBLE9BQU8sQ0FBQ29CLElBQVIsQ0FBYSxDQUFiO0FBQ0E7O0FBQ0QsU0FBSyxZQUFMO0FBQ0NELE1BQUFBLE9BQU8sQ0FBQ0osS0FBUixDQUFjRSxJQUFJLEdBQUcsb0JBQXJCO0FBQ0FqQixNQUFBQSxPQUFPLENBQUNvQixJQUFSLENBQWEsQ0FBYjtBQUNBOztBQUNEO0FBQ0MsWUFBTUwsS0FBTjtBQVZGO0FBWUE7QUFFRDs7Ozs7QUFJQSxTQUFTSixXQUFULEdBQXVCO0FBQ3RCLE1BQUlVLElBQUksR0FBR2pCLE1BQU0sQ0FBQ2tCLE9BQVAsRUFBWDtBQUNBLE1BQUlMLElBQUksR0FBRyxPQUFPSSxJQUFQLEtBQWdCLFFBQWhCLEdBQTJCLFVBQVVBLElBQXJDLEdBQTRDLFVBQVVBLElBQUksQ0FBQ3ZCLElBQXRFO0FBQ0FGLEVBQUFBLEtBQUssQ0FBQyxrQkFBa0JxQixJQUFuQixDQUFMO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cclxuICovXHJcblxyXG52YXIgYXBwID0gcmVxdWlyZSgnLi9hcHAnKVxyXG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdkb2NzeXM6c2VydmVyJylcclxudmFyIGh0dHAgPSByZXF1aXJlKCdodHRwJylcclxuXHJcbmltcG9ydCBpbyBmcm9tICcuL3NvY2tldCc7XHJcblxyXG4vKipcclxuICogR2V0IHBvcnQgZnJvbSBlbnZpcm9ubWVudCBhbmQgc3RvcmUgaW4gRXhwcmVzcy5cclxuICovXHJcblxyXG52YXIgcG9ydCA9IG5vcm1hbGl6ZVBvcnQocHJvY2Vzcy5lbnYuUE9SVCB8fCAnMzAwMScpXHJcbmFwcC5zZXQoJ3BvcnQnLCBwb3J0KVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBIVFRQIHNlcnZlci5cclxuICovXHJcblxyXG52YXIgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwKVxyXG5cclxuLy8gLyoqXHJcbi8vICAqIENyZWF0ZSBXZWJTb2NrZXQgc2VydmVyXHJcbi8vICAqL1xyXG5cclxuaW8uYXR0YWNoKHNlcnZlcilcclxuXHJcbi8qKlxyXG4gKiBMaXN0ZW4gb24gcHJvdmlkZWQgcG9ydCwgb24gYWxsIG5ldHdvcmsgaW50ZXJmYWNlcy5cclxuICovXHJcblxyXG5zZXJ2ZXIubGlzdGVuKHBvcnQpXHJcbnNlcnZlci5vbignZXJyb3InLCBvbkVycm9yKVxyXG5zZXJ2ZXIub24oJ2xpc3RlbmluZycsIG9uTGlzdGVuaW5nKVxyXG5cclxuLyoqXHJcbiAqIE5vcm1hbGl6ZSBhIHBvcnQgaW50byBhIG51bWJlciwgc3RyaW5nLCBvciBmYWxzZS5cclxuICovXHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVQb3J0KHZhbDogYW55KSB7XHJcblx0dmFyIHBvcnQgPSBwYXJzZUludCh2YWwsIDEwKVxyXG5cclxuXHJcblx0aWYgKGlzTmFOKHBvcnQpKSB7XHJcblx0XHQvLyBuYW1lZCBwaXBlXHJcblx0XHRyZXR1cm4gdmFsXHJcblx0fVxyXG5cclxuXHRpZiAocG9ydCA+PSAwKSB7XHJcblx0XHQvLyBwb3J0IG51bWJlclxyXG5cdFx0cmV0dXJuIHBvcnRcclxuXHR9XHJcblxyXG5cdHJldHVybiBmYWxzZVxyXG59XHJcblxyXG4vKipcclxuICogRXZlbnQgbGlzdGVuZXIgZm9yIEhUVFAgc2VydmVyIFwiZXJyb3JcIiBldmVudC5cclxuICovXHJcblxyXG5mdW5jdGlvbiBvbkVycm9yKGVycm9yOiBhbnkpIHtcclxuXHRpZiAoZXJyb3Iuc3lzY2FsbCAhPT0gJ2xpc3RlbicpIHtcclxuXHRcdHRocm93IGVycm9yXHJcblx0fVxyXG5cclxuXHR2YXIgYmluZCA9IHR5cGVvZiBwb3J0ID09PSAnc3RyaW5nJyA/ICdQaXBlICcgKyBwb3J0IDogJ1BvcnQgJyArIHBvcnRcclxuXHJcblx0Ly8gaGFuZGxlIHNwZWNpZmljIGxpc3RlbiBlcnJvcnMgd2l0aCBmcmllbmRseSBtZXNzYWdlc1xyXG5cdHN3aXRjaCAoZXJyb3IuY29kZSkge1xyXG5cdFx0Y2FzZSAnRUFDQ0VTJzpcclxuXHRcdFx0Y29uc29sZS5lcnJvcihiaW5kICsgJyByZXF1aXJlcyBlbGV2YXRlZCBwcml2aWxlZ2VzJylcclxuXHRcdFx0cHJvY2Vzcy5leGl0KDEpXHJcblx0XHRcdGJyZWFrXHJcblx0XHRjYXNlICdFQUREUklOVVNFJzpcclxuXHRcdFx0Y29uc29sZS5lcnJvcihiaW5kICsgJyBpcyBhbHJlYWR5IGluIHVzZScpXHJcblx0XHRcdHByb2Nlc3MuZXhpdCgxKVxyXG5cdFx0XHRicmVha1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0dGhyb3cgZXJyb3JcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJsaXN0ZW5pbmdcIiBldmVudC5cclxuICovXHJcblxyXG5mdW5jdGlvbiBvbkxpc3RlbmluZygpIHtcclxuXHR2YXIgYWRkciA9IHNlcnZlci5hZGRyZXNzKClcclxuXHR2YXIgYmluZCA9IHR5cGVvZiBhZGRyID09PSAnc3RyaW5nJyA/ICdwaXBlICcgKyBhZGRyIDogJ3BvcnQgJyArIGFkZHIucG9ydFxyXG5cdGRlYnVnKCdMaXN0ZW5pbmcgb24gJyArIGJpbmQpXHJcbn1cclxuIl19