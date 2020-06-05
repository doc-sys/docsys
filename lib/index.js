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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJhcHAiLCJyZXF1aXJlIiwiZGVidWciLCJodHRwIiwicG9ydCIsIm5vcm1hbGl6ZVBvcnQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsInNldCIsInNlcnZlciIsImNyZWF0ZVNlcnZlciIsImlvIiwiYXR0YWNoIiwibGlzdGVuIiwib24iLCJvbkVycm9yIiwib25MaXN0ZW5pbmciLCJ2YWwiLCJwYXJzZUludCIsImlzTmFOIiwiZXJyb3IiLCJzeXNjYWxsIiwiYmluZCIsImNvZGUiLCJjb25zb2xlIiwiZXhpdCIsImFkZHIiLCJhZGRyZXNzIl0sIm1hcHBpbmdzIjoiOzs7O0FBUUE7O0FBUkE7OztBQUlBLElBQUlBLEdBQUcsR0FBR0MsT0FBTyxDQUFDLE9BQUQsQ0FBakI7O0FBQ0EsSUFBSUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsT0FBRCxDQUFQLENBQWlCLGVBQWpCLENBQVo7O0FBQ0EsSUFBSUUsSUFBSSxHQUFHRixPQUFPLENBQUMsTUFBRCxDQUFsQjs7QUFJQTs7O0FBSUEsSUFBSUcsSUFBSSxHQUFHQyxhQUFhLENBQUNDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxJQUFaLElBQW9CLE1BQXJCLENBQXhCO0FBQ0FSLEdBQUcsQ0FBQ1MsR0FBSixDQUFRLE1BQVIsRUFBZ0JMLElBQWhCO0FBRUE7Ozs7QUFJQSxJQUFJTSxNQUFNLEdBQUdQLElBQUksQ0FBQ1EsWUFBTCxDQUFrQlgsR0FBbEIsQ0FBYixDLENBRUE7QUFDQTtBQUNBOztBQUVBWSxtQkFBR0MsTUFBSCxDQUFVSCxNQUFWO0FBRUE7Ozs7O0FBSUFBLE1BQU0sQ0FBQ0ksTUFBUCxDQUFjVixJQUFkO0FBQ0FNLE1BQU0sQ0FBQ0ssRUFBUCxDQUFVLE9BQVYsRUFBbUJDLE9BQW5CO0FBQ0FOLE1BQU0sQ0FBQ0ssRUFBUCxDQUFVLFdBQVYsRUFBdUJFLFdBQXZCO0FBRUE7Ozs7QUFJQSxTQUFTWixhQUFULENBQXVCYSxHQUF2QixFQUFpQztBQUNoQyxNQUFJZCxJQUFJLEdBQUdlLFFBQVEsQ0FBQ0QsR0FBRCxFQUFNLEVBQU4sQ0FBbkI7O0FBR0EsTUFBSUUsS0FBSyxDQUFDaEIsSUFBRCxDQUFULEVBQWlCO0FBQ2hCO0FBQ0EsV0FBT2MsR0FBUDtBQUNBOztBQUVELE1BQUlkLElBQUksSUFBSSxDQUFaLEVBQWU7QUFDZDtBQUNBLFdBQU9BLElBQVA7QUFDQTs7QUFFRCxTQUFPLEtBQVA7QUFDQTtBQUVEOzs7OztBQUlBLFNBQVNZLE9BQVQsQ0FBaUJLLEtBQWpCLEVBQTZCO0FBQzVCLE1BQUlBLEtBQUssQ0FBQ0MsT0FBTixLQUFrQixRQUF0QixFQUFnQztBQUMvQixVQUFNRCxLQUFOO0FBQ0E7O0FBRUQsTUFBSUUsSUFBSSxHQUFHLE9BQU9uQixJQUFQLEtBQWdCLFFBQWhCLEdBQTJCLFVBQVVBLElBQXJDLEdBQTRDLFVBQVVBLElBQWpFLENBTDRCLENBTzVCOztBQUNBLFVBQVFpQixLQUFLLENBQUNHLElBQWQ7QUFDQyxTQUFLLFFBQUw7QUFDQ0MsTUFBQUEsT0FBTyxDQUFDSixLQUFSLENBQWNFLElBQUksR0FBRywrQkFBckI7QUFDQWpCLE1BQUFBLE9BQU8sQ0FBQ29CLElBQVIsQ0FBYSxDQUFiO0FBQ0E7O0FBQ0QsU0FBSyxZQUFMO0FBQ0NELE1BQUFBLE9BQU8sQ0FBQ0osS0FBUixDQUFjRSxJQUFJLEdBQUcsb0JBQXJCO0FBQ0FqQixNQUFBQSxPQUFPLENBQUNvQixJQUFSLENBQWEsQ0FBYjtBQUNBOztBQUNEO0FBQ0MsWUFBTUwsS0FBTjtBQVZGO0FBWUE7QUFFRDs7Ozs7QUFJQSxTQUFTSixXQUFULEdBQXVCO0FBQ3RCLE1BQUlVLElBQUksR0FBR2pCLE1BQU0sQ0FBQ2tCLE9BQVAsRUFBWDtBQUNBLE1BQUlMLElBQUksR0FBRyxPQUFPSSxJQUFQLEtBQWdCLFFBQWhCLEdBQTJCLFVBQVVBLElBQXJDLEdBQTRDLFVBQVVBLElBQUksQ0FBQ3ZCLElBQXRFO0FBQ0FGLEVBQUFBLEtBQUssQ0FBQyxrQkFBa0JxQixJQUFuQixDQUFMO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGFwcCA9IHJlcXVpcmUoJy4vYXBwJylcbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2RvY3N5czpzZXJ2ZXInKVxudmFyIGh0dHAgPSByZXF1aXJlKCdodHRwJylcblxuaW1wb3J0IGlvIGZyb20gJy4vc29ja2V0JztcblxuLyoqXG4gKiBHZXQgcG9ydCBmcm9tIGVudmlyb25tZW50IGFuZCBzdG9yZSBpbiBFeHByZXNzLlxuICovXG5cbnZhciBwb3J0ID0gbm9ybWFsaXplUG9ydChwcm9jZXNzLmVudi5QT1JUIHx8ICczMDAxJylcbmFwcC5zZXQoJ3BvcnQnLCBwb3J0KVxuXG4vKipcbiAqIENyZWF0ZSBIVFRQIHNlcnZlci5cbiAqL1xuXG52YXIgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwKVxuXG4vLyAvKipcbi8vICAqIENyZWF0ZSBXZWJTb2NrZXQgc2VydmVyXG4vLyAgKi9cblxuaW8uYXR0YWNoKHNlcnZlcilcblxuLyoqXG4gKiBMaXN0ZW4gb24gcHJvdmlkZWQgcG9ydCwgb24gYWxsIG5ldHdvcmsgaW50ZXJmYWNlcy5cbiAqL1xuXG5zZXJ2ZXIubGlzdGVuKHBvcnQpXG5zZXJ2ZXIub24oJ2Vycm9yJywgb25FcnJvcilcbnNlcnZlci5vbignbGlzdGVuaW5nJywgb25MaXN0ZW5pbmcpXG5cbi8qKlxuICogTm9ybWFsaXplIGEgcG9ydCBpbnRvIGEgbnVtYmVyLCBzdHJpbmcsIG9yIGZhbHNlLlxuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVBvcnQodmFsOiBhbnkpIHtcblx0dmFyIHBvcnQgPSBwYXJzZUludCh2YWwsIDEwKVxuXG5cblx0aWYgKGlzTmFOKHBvcnQpKSB7XG5cdFx0Ly8gbmFtZWQgcGlwZVxuXHRcdHJldHVybiB2YWxcblx0fVxuXG5cdGlmIChwb3J0ID49IDApIHtcblx0XHQvLyBwb3J0IG51bWJlclxuXHRcdHJldHVybiBwb3J0XG5cdH1cblxuXHRyZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJlcnJvclwiIGV2ZW50LlxuICovXG5cbmZ1bmN0aW9uIG9uRXJyb3IoZXJyb3I6IGFueSkge1xuXHRpZiAoZXJyb3Iuc3lzY2FsbCAhPT0gJ2xpc3RlbicpIHtcblx0XHR0aHJvdyBlcnJvclxuXHR9XG5cblx0dmFyIGJpbmQgPSB0eXBlb2YgcG9ydCA9PT0gJ3N0cmluZycgPyAnUGlwZSAnICsgcG9ydCA6ICdQb3J0ICcgKyBwb3J0XG5cblx0Ly8gaGFuZGxlIHNwZWNpZmljIGxpc3RlbiBlcnJvcnMgd2l0aCBmcmllbmRseSBtZXNzYWdlc1xuXHRzd2l0Y2ggKGVycm9yLmNvZGUpIHtcblx0XHRjYXNlICdFQUNDRVMnOlxuXHRcdFx0Y29uc29sZS5lcnJvcihiaW5kICsgJyByZXF1aXJlcyBlbGV2YXRlZCBwcml2aWxlZ2VzJylcblx0XHRcdHByb2Nlc3MuZXhpdCgxKVxuXHRcdFx0YnJlYWtcblx0XHRjYXNlICdFQUREUklOVVNFJzpcblx0XHRcdGNvbnNvbGUuZXJyb3IoYmluZCArICcgaXMgYWxyZWFkeSBpbiB1c2UnKVxuXHRcdFx0cHJvY2Vzcy5leGl0KDEpXG5cdFx0XHRicmVha1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyBlcnJvclxuXHR9XG59XG5cbi8qKlxuICogRXZlbnQgbGlzdGVuZXIgZm9yIEhUVFAgc2VydmVyIFwibGlzdGVuaW5nXCIgZXZlbnQuXG4gKi9cblxuZnVuY3Rpb24gb25MaXN0ZW5pbmcoKSB7XG5cdHZhciBhZGRyID0gc2VydmVyLmFkZHJlc3MoKVxuXHR2YXIgYmluZCA9IHR5cGVvZiBhZGRyID09PSAnc3RyaW5nJyA/ICdwaXBlICcgKyBhZGRyIDogJ3BvcnQgJyArIGFkZHIucG9ydFxuXHRkZWJ1ZygnTGlzdGVuaW5nIG9uICcgKyBiaW5kKVxufVxuIl19