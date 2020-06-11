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
            console.log('conn');
            token = socket.handshake.query.token;

            if (!token) {
              _context.next = 14;
              break;
            }

            _context.prev = 3;
            _context.next = 6;
            return jwt.verify(token, process.env.JWT_SECRET);

          case 6:
            user = _context.sent;
            socket.username = user.username;
            return _context.abrupt("return", next());

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", next(new Error('Auth failed')));

          case 14:
            return _context.abrupt("return", next(new Error('Auth not valid')));

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 11]]);
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
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(socket) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            socket.on('disconnect', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      console.log("removing ".concat(socket.username, " from redis"));
                      _context2.next = 3;
                      return _keystore.socketStore["delete"](socket.username);

                    case 3:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            })));
            _context3.next = 3;
            return _keystore.socketStore.get(socket.username);

          case 3:
            if (_context3.sent) {
              _context3.next = 7;
              break;
            }

            console.log("adding to redis: ".concat(socket.username, " with ").concat(socket.id));
            _context3.next = 7;
            return _keystore.socketStore.set(socket.username, socket.id);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}());
io.on('disconnect', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(socket) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("removing ".concat(socket.username, " from redis"));
            _context4.next = 3;
            return _keystore.socketStore["delete"](socket.username);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zb2NrZXQudHMiXSwibmFtZXMiOlsic2lvIiwicmVxdWlyZSIsImlvIiwib3JpZ2lucyIsIm8iLCJjYiIsInVzZSIsInNvY2tldCIsIm5leHQiLCJjb25zb2xlIiwibG9nIiwidG9rZW4iLCJoYW5kc2hha2UiLCJxdWVyeSIsImp3dCIsInZlcmlmeSIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwidXNlciIsInVzZXJuYW1lIiwiRXJyb3IiLCJub3RpZmljYXRpb25fY2hhbm5lbCIsIm9mIiwibWVzc2FnZV9jaGFubmVsIiwib24iLCJzb2NrZXRTdG9yZSIsImdldCIsImlkIiwic2V0IiwiZGF0YSIsImpvaW4iLCJjb252b0lkIiwidG8iLCJlbWl0IiwibWVzc2FnZSIsImxlYXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFGQSxJQUFNQSxHQUFHLEdBQUdDLE9BQU8sQ0FBQyxXQUFELENBQW5COztBQUtBLElBQU1DLEVBQW1CLEdBQUcsSUFBSUYsR0FBSixFQUE1QixDLENBRUE7O0FBQ0FFLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLFVBQUNDLENBQUQsRUFBSUMsRUFBSixFQUFXO0FBQ2xCQSxFQUFBQSxFQUFFLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FBRjtBQUNILENBRkQsRSxDQUlBOztBQUNBSCxFQUFFLENBQUNJLEdBQUg7QUFBQSwyRkFBTyxpQkFBT0MsTUFBUCxFQUF1QkMsSUFBdkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0hDLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLE1BQVo7QUFDSUMsWUFBQUEsS0FGRCxHQUVTSixNQUFNLENBQUNLLFNBQVAsQ0FBaUJDLEtBQWpCLENBQXVCRixLQUZoQzs7QUFBQSxpQkFHQ0EsS0FIRDtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsbUJBS3NCRyxHQUFHLENBQUNDLE1BQUosQ0FBV0osS0FBWCxFQUFrQkssT0FBTyxDQUFDQyxH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LE9BQVYsRUFBbUIsVUFBQ0ssSUFBRCxFQUFVO0FBQ3pCdkIsSUFBQUEsTUFBTSxDQUFDNkIsS0FBUCxDQUFhTixJQUFJLENBQUNFLE9BQWxCO0FBQ0gsR0FGRDtBQUdILENBbkJEO2VBcUJlOUIsRSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNpbyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpXG5pbXBvcnQgKiBhcyBqd3QgZnJvbSAnanNvbndlYnRva2VuJ1xuaW1wb3J0IHsgc29ja2V0U3RvcmUgfSBmcm9tICcuL2xpYi9oZWxwZXJzL2tleXN0b3JlJztcbmltcG9ydCB7IE5hbWVzcGFjZSwgU29ja2V0IH0gZnJvbSAnc29ja2V0LmlvJztcblxuY29uc3QgaW86IFNvY2tldElPLlNlcnZlciA9IG5ldyBzaW8oKVxuXG4vLyBQZXJtaXQgYWxsIG9yaWdpbnNcbmlvLm9yaWdpbnMoKG8sIGNiKSA9PiB7XG4gICAgY2IobnVsbCwgdHJ1ZSlcbn0pXG5cbi8vIFZlcmlmeSB0b2tlbiBvbiByZXF1ZXN0IGhhbmRzaGFrZVxuaW8udXNlKGFzeW5jIChzb2NrZXQ6IFNvY2tldCwgbmV4dCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdjb25uJylcbiAgICBsZXQgdG9rZW4gPSBzb2NrZXQuaGFuZHNoYWtlLnF1ZXJ5LnRva2VuXG4gICAgaWYgKHRva2VuKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgdXNlciA9IGF3YWl0IGp3dC52ZXJpZnkodG9rZW4sIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQpXG4gICAgICAgICAgICBzb2NrZXQudXNlcm5hbWUgPSB1c2VyLnVzZXJuYW1lXG4gICAgICAgICAgICByZXR1cm4gbmV4dCgpXG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKCdBdXRoIGZhaWxlZCcpKVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcignQXV0aCBub3QgdmFsaWQnKSlcbn0pXG5cbi8vIEV4cG9ydCBuYW1lc3BhY2VzIGZvciBtZXNzYWdpbmcgYW5kIG5vdGlmaWNhdGlvbnNcbmV4cG9ydCBjb25zdCBub3RpZmljYXRpb25fY2hhbm5lbDogTmFtZXNwYWNlID0gaW8ub2YoJy9ub3RpZmljYXRpb25zJylcbmV4cG9ydCBjb25zdCBtZXNzYWdlX2NoYW5uZWw6IE5hbWVzcGFjZSA9IGlvLm9mKCcvbWVzc2FnZScpXG5cbi8vIFVwZGF0ZSBrZXkvdmFsdWUgc3RvcmUgaG9sZGluZyBzb2NrZXQgSURzIG9uIGNvbm5lY3QvZGlzY29ubmVjdFxuaW8ub24oJ2Nvbm5lY3Rpb24nLCBhc3luYyAoc29ja2V0KSA9PiB7XG4gICAgc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgcmVtb3ZpbmcgJHtzb2NrZXQudXNlcm5hbWV9IGZyb20gcmVkaXNgKVxuICAgICAgICBhd2FpdCBzb2NrZXRTdG9yZS5kZWxldGUoc29ja2V0LnVzZXJuYW1lKVxuICAgIH0pXG5cbiAgICBpZiAoIWF3YWl0IHNvY2tldFN0b3JlLmdldChzb2NrZXQudXNlcm5hbWUpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBhZGRpbmcgdG8gcmVkaXM6ICR7c29ja2V0LnVzZXJuYW1lfSB3aXRoICR7c29ja2V0LmlkfWApXG4gICAgICAgIGF3YWl0IHNvY2tldFN0b3JlLnNldChzb2NrZXQudXNlcm5hbWUsIHNvY2tldC5pZClcbiAgICB9XG5cbn0pXG5cbmlvLm9uKCdkaXNjb25uZWN0JywgYXN5bmMgKHNvY2tldCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGByZW1vdmluZyAke3NvY2tldC51c2VybmFtZX0gZnJvbSByZWRpc2ApXG4gICAgYXdhaXQgc29ja2V0U3RvcmUuZGVsZXRlKHNvY2tldC51c2VybmFtZSlcbn0pXG5cbi8vIG5vdGlmaWNhdGlvbl9jaGFubmVsLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuLy8gICAgIG5vdGlmaWNhdGlvbl9jaGFubmVsLnRvKHNvY2tldC5pZCkuZW1pdCgnbm90aWZpY2F0aW9uJywgJ1lPVSBDT05FQ1RFRCcpXG4vLyB9KVxuXG4vLyBEaXN0cmlidXRlIG1lc3NhZ2VzXG5tZXNzYWdlX2NoYW5uZWwub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KSA9PiB7XG4gICAgY29uc29sZS5sb2coc29ja2V0LnRva2VuKVxuXG4gICAgLy9IYW5kbGUgY29udm8gam9pblxuICAgIHNvY2tldC5vbignam9pbicsIChkYXRhKSA9PiB7XG4gICAgICAgIHNvY2tldC5qb2luKGRhdGEuY29udm9JZClcbiAgICB9KVxuXG4gICAgLy9IYW5kbGUgbmV3IG1lc3NhZ2VcbiAgICBzb2NrZXQub24oJ21lc3NhZ2UnLCAoZGF0YSkgPT4ge1xuICAgICAgICAvL3NhdmUgaW4gZGJcbiAgICAgICAgLy9lbWl0IHRvIG90aGVyIHJlY3BzXG4gICAgICAgIHNvY2tldC50byhkYXRhLmNvbnZvSWQpLmVtaXQoZGF0YS5tZXNzYWdlKVxuICAgIH0pXG5cbiAgICAvL0xlYXZlIGNvbnZlcnNhdGlvblxuICAgIHNvY2tldC5vbignbGVhdmUnLCAoZGF0YSkgPT4ge1xuICAgICAgICBzb2NrZXQubGVhdmUoZGF0YS5jb252b0lkKVxuICAgIH0pXG59KVxuXG5leHBvcnQgZGVmYXVsdCBpbyJdfQ==