"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.message_channel = exports.notification_channel = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var jwt = _interopRequireWildcard(require("jsonwebtoken"));

var _keystore = require("./lib/helpers/keystore");

var sio = require('socket.io');

var io = new sio(); // Permit all origins

io.origins(function (o, cb) {
  cb(null, true);
}); // Verify token on request handshake

io.use( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(socket, next) {
    var token, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = socket.handshake.query.token;

            if (!token) {
              _context.next = 13;
              break;
            }

            _context.prev = 2;
            _context.next = 5;
            return jwt.verify(token, process.env.JWT_SECRET);

          case 5:
            user = _context.sent;
            socket.username = user.username;
            return _context.abrupt("return", next());

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](2);
            return _context.abrupt("return", next(new Error('Auth failed')));

          case 13:
            return _context.abrupt("return", next(new Error('Auth not valid')));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 10]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); // Export namespaces for messaging and notifications

var notification_channel = io.of('/notifications');
exports.notification_channel = notification_channel;
var message_channel = io.of('/message'); // Update key/value store holding socket IDs on connect/disconnect

exports.message_channel = message_channel;
io.on('connection', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(socket) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _keystore.socketStore.set(socket.username, socket.id);

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}());
io.on('disconnect', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(socket) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _keystore.socketStore["delete"](socket.username);

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x4) {
    return _ref3.apply(this, arguments);
  };
}()); // notification_channel.on('connection', (socket) => {
//     notification_channel.to(socket.id).emit('notification', 'YOU CONECTED')
// })
// Distribute messages

message_channel.on('connection', function (socket) {
  console.log(socket.token); //Handle convo join

  socket.on('join', function (data) {
    socket.join(data.convoId);
  }); //Handle new message

  socket.on('message', function (data) {
    //save in db
    //emit to other recps
    socket.to(data.convoId).emit(data.message);
  }); //Leave conversation

  socket.on('leave', function (data) {
    socket.leave(data.convoId);
  });
});
var _default = io;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zb2NrZXQudHMiXSwibmFtZXMiOlsic2lvIiwicmVxdWlyZSIsImlvIiwib3JpZ2lucyIsIm8iLCJjYiIsInVzZSIsInNvY2tldCIsIm5leHQiLCJ0b2tlbiIsImhhbmRzaGFrZSIsInF1ZXJ5Iiwiand0IiwidmVyaWZ5IiwicHJvY2VzcyIsImVudiIsIkpXVF9TRUNSRVQiLCJ1c2VyIiwidXNlcm5hbWUiLCJFcnJvciIsIm5vdGlmaWNhdGlvbl9jaGFubmVsIiwib2YiLCJtZXNzYWdlX2NoYW5uZWwiLCJvbiIsInNvY2tldFN0b3JlIiwic2V0IiwiaWQiLCJjb25zb2xlIiwibG9nIiwiZGF0YSIsImpvaW4iLCJjb252b0lkIiwidG8iLCJlbWl0IiwibWVzc2FnZSIsImxlYXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFGQSxJQUFNQSxHQUFHLEdBQUdDLE9BQU8sQ0FBQyxXQUFELENBQW5COztBQUtBLElBQU1DLEVBQW1CLEdBQUcsSUFBSUYsR0FBSixFQUE1QixDLENBRUE7O0FBQ0FFLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLFVBQUNDLENBQUQsRUFBSUMsRUFBSixFQUFXO0FBQ2xCQSxFQUFBQSxFQUFFLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FBRjtBQUNILENBRkQsRSxDQUlBOztBQUNBSCxFQUFFLENBQUNJLEdBQUg7QUFBQSwyRkFBTyxpQkFBT0MsTUFBUCxFQUF1QkMsSUFBdkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0NDLFlBQUFBLEtBREQsR0FDU0YsTUFBTSxDQUFDRyxTQUFQLENBQWlCQyxLQUFqQixDQUF1QkYsS0FEaEM7O0FBQUEsaUJBRUNBLEtBRkQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLG1CQUlzQkcsR0FBRyxDQUFDQyxNQUFKLENBQVdKLEtBQVgsRUFBa0JLLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxVQUE5QixDQUp0Qjs7QUFBQTtBQUlTQyxZQUFBQSxJQUpUO0FBS0tWLFlBQUFBLE1BQU0sQ0FBQ1csUUFBUCxHQUFrQkQsSUFBSSxDQUFDQyxRQUF2QjtBQUxMLDZDQU1ZVixJQUFJLEVBTmhCOztBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQVFZQSxJQUFJLENBQUMsSUFBSVcsS0FBSixDQUFVLGFBQVYsQ0FBRCxDQVJoQjs7QUFBQTtBQUFBLDZDQVdJWCxJQUFJLENBQUMsSUFBSVcsS0FBSixDQUFVLGdCQUFWLENBQUQsQ0FYUjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFQOztBQUFBO0FBQUE7QUFBQTtBQUFBLEssQ0FjQTs7QUFDTyxJQUFNQyxvQkFBK0IsR0FBR2xCLEVBQUUsQ0FBQ21CLEVBQUgsQ0FBTSxnQkFBTixDQUF4Qzs7QUFDQSxJQUFNQyxlQUEwQixHQUFHcEIsRUFBRSxDQUFDbUIsRUFBSCxDQUFNLFVBQU4sQ0FBbkMsQyxDQUVQOzs7QUFDQW5CLEVBQUUsQ0FBQ3FCLEVBQUgsQ0FBTSxZQUFOO0FBQUEsNEZBQW9CLGtCQUFPaEIsTUFBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFDVmlCLHNCQUFZQyxHQUFaLENBQWdCbEIsTUFBTSxDQUFDVyxRQUF2QixFQUFpQ1gsTUFBTSxDQUFDbUIsRUFBeEMsQ0FEVTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFwQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBeEIsRUFBRSxDQUFDcUIsRUFBSCxDQUFNLFlBQU47QUFBQSw0RkFBb0Isa0JBQU9oQixNQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUNWaUIsZ0NBQW1CakIsTUFBTSxDQUFDVyxRQUExQixDQURVOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQXBCOztBQUFBO0FBQUE7QUFBQTtBQUFBLEssQ0FJQTtBQUNBO0FBQ0E7QUFFQTs7QUFDQUksZUFBZSxDQUFDQyxFQUFoQixDQUFtQixZQUFuQixFQUFpQyxVQUFDaEIsTUFBRCxFQUFZO0FBQ3pDb0IsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlyQixNQUFNLENBQUNFLEtBQW5CLEVBRHlDLENBR3pDOztBQUNBRixFQUFBQSxNQUFNLENBQUNnQixFQUFQLENBQVUsTUFBVixFQUFrQixVQUFDTSxJQUFELEVBQVU7QUFDeEJ0QixJQUFBQSxNQUFNLENBQUN1QixJQUFQLENBQVlELElBQUksQ0FBQ0UsT0FBakI7QUFDSCxHQUZELEVBSnlDLENBUXpDOztBQUNBeEIsRUFBQUEsTUFBTSxDQUFDZ0IsRUFBUCxDQUFVLFNBQVYsRUFBcUIsVUFBQ00sSUFBRCxFQUFVO0FBQzNCO0FBQ0E7QUFDQXRCLElBQUFBLE1BQU0sQ0FBQ3lCLEVBQVAsQ0FBVUgsSUFBSSxDQUFDRSxPQUFmLEVBQXdCRSxJQUF4QixDQUE2QkosSUFBSSxDQUFDSyxPQUFsQztBQUNILEdBSkQsRUFUeUMsQ0FlekM7O0FBQ0EzQixFQUFBQSxNQUFNLENBQUNnQixFQUFQLENBQVUsT0FBVixFQUFtQixVQUFDTSxJQUFELEVBQVU7QUFDekJ0QixJQUFBQSxNQUFNLENBQUM0QixLQUFQLENBQWFOLElBQUksQ0FBQ0UsT0FBbEI7QUFDSCxHQUZEO0FBR0gsQ0FuQkQ7ZUFxQmU3QixFIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2lvID0gcmVxdWlyZSgnc29ja2V0LmlvJylcbmltcG9ydCAqIGFzIGp3dCBmcm9tICdqc29ud2VidG9rZW4nXG5pbXBvcnQgeyBzb2NrZXRTdG9yZSB9IGZyb20gJy4vbGliL2hlbHBlcnMva2V5c3RvcmUnO1xuaW1wb3J0IHsgTmFtZXNwYWNlLCBTb2NrZXQgfSBmcm9tICdzb2NrZXQuaW8nO1xuXG5jb25zdCBpbzogU29ja2V0SU8uU2VydmVyID0gbmV3IHNpbygpXG5cbi8vIFBlcm1pdCBhbGwgb3JpZ2luc1xuaW8ub3JpZ2lucygobywgY2IpID0+IHtcbiAgICBjYihudWxsLCB0cnVlKVxufSlcblxuLy8gVmVyaWZ5IHRva2VuIG9uIHJlcXVlc3QgaGFuZHNoYWtlXG5pby51c2UoYXN5bmMgKHNvY2tldDogU29ja2V0LCBuZXh0KSA9PiB7XG4gICAgbGV0IHRva2VuID0gc29ja2V0LmhhbmRzaGFrZS5xdWVyeS50b2tlblxuICAgIGlmICh0b2tlbikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHVzZXIgPSBhd2FpdCBqd3QudmVyaWZ5KHRva2VuLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVUKVxuICAgICAgICAgICAgc29ja2V0LnVzZXJuYW1lID0gdXNlci51c2VybmFtZVxuICAgICAgICAgICAgcmV0dXJuIG5leHQoKVxuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcignQXV0aCBmYWlsZWQnKSlcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV4dChuZXcgRXJyb3IoJ0F1dGggbm90IHZhbGlkJykpXG59KVxuXG4vLyBFeHBvcnQgbmFtZXNwYWNlcyBmb3IgbWVzc2FnaW5nIGFuZCBub3RpZmljYXRpb25zXG5leHBvcnQgY29uc3Qgbm90aWZpY2F0aW9uX2NoYW5uZWw6IE5hbWVzcGFjZSA9IGlvLm9mKCcvbm90aWZpY2F0aW9ucycpXG5leHBvcnQgY29uc3QgbWVzc2FnZV9jaGFubmVsOiBOYW1lc3BhY2UgPSBpby5vZignL21lc3NhZ2UnKVxuXG4vLyBVcGRhdGUga2V5L3ZhbHVlIHN0b3JlIGhvbGRpbmcgc29ja2V0IElEcyBvbiBjb25uZWN0L2Rpc2Nvbm5lY3RcbmlvLm9uKCdjb25uZWN0aW9uJywgYXN5bmMgKHNvY2tldCkgPT4ge1xuICAgIGF3YWl0IHNvY2tldFN0b3JlLnNldChzb2NrZXQudXNlcm5hbWUsIHNvY2tldC5pZClcbn0pXG5cbmlvLm9uKCdkaXNjb25uZWN0JywgYXN5bmMgKHNvY2tldCkgPT4ge1xuICAgIGF3YWl0IHNvY2tldFN0b3JlLmRlbGV0ZShzb2NrZXQudXNlcm5hbWUpXG59KVxuXG4vLyBub3RpZmljYXRpb25fY2hhbm5lbC5vbignY29ubmVjdGlvbicsIChzb2NrZXQpID0+IHtcbi8vICAgICBub3RpZmljYXRpb25fY2hhbm5lbC50byhzb2NrZXQuaWQpLmVtaXQoJ25vdGlmaWNhdGlvbicsICdZT1UgQ09ORUNURUQnKVxuLy8gfSlcblxuLy8gRGlzdHJpYnV0ZSBtZXNzYWdlc1xubWVzc2FnZV9jaGFubmVsLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHNvY2tldC50b2tlbilcblxuICAgIC8vSGFuZGxlIGNvbnZvIGpvaW5cbiAgICBzb2NrZXQub24oJ2pvaW4nLCAoZGF0YSkgPT4ge1xuICAgICAgICBzb2NrZXQuam9pbihkYXRhLmNvbnZvSWQpXG4gICAgfSlcblxuICAgIC8vSGFuZGxlIG5ldyBtZXNzYWdlXG4gICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgKGRhdGEpID0+IHtcbiAgICAgICAgLy9zYXZlIGluIGRiXG4gICAgICAgIC8vZW1pdCB0byBvdGhlciByZWNwc1xuICAgICAgICBzb2NrZXQudG8oZGF0YS5jb252b0lkKS5lbWl0KGRhdGEubWVzc2FnZSlcbiAgICB9KVxuXG4gICAgLy9MZWF2ZSBjb252ZXJzYXRpb25cbiAgICBzb2NrZXQub24oJ2xlYXZlJywgKGRhdGEpID0+IHtcbiAgICAgICAgc29ja2V0LmxlYXZlKGRhdGEuY29udm9JZClcbiAgICB9KVxufSlcblxuZXhwb3J0IGRlZmF1bHQgaW8iXX0=