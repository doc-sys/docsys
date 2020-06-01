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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zb2NrZXQudHMiXSwibmFtZXMiOlsic2lvIiwicmVxdWlyZSIsImlvIiwib3JpZ2lucyIsIm8iLCJjYiIsInVzZSIsInNvY2tldCIsIm5leHQiLCJ0b2tlbiIsImhhbmRzaGFrZSIsInF1ZXJ5Iiwiand0IiwidmVyaWZ5IiwicHJvY2VzcyIsImVudiIsIkpXVF9TRUNSRVQiLCJ1c2VyIiwidXNlcm5hbWUiLCJFcnJvciIsIm5vdGlmaWNhdGlvbl9jaGFubmVsIiwib2YiLCJtZXNzYWdlX2NoYW5uZWwiLCJvbiIsInNvY2tldFN0b3JlIiwic2V0IiwiaWQiLCJjb25zb2xlIiwibG9nIiwiZGF0YSIsImpvaW4iLCJjb252b0lkIiwidG8iLCJlbWl0IiwibWVzc2FnZSIsImxlYXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFGQSxJQUFNQSxHQUFHLEdBQUdDLE9BQU8sQ0FBQyxXQUFELENBQW5COztBQUtBLElBQU1DLEVBQW1CLEdBQUcsSUFBSUYsR0FBSixFQUE1QixDLENBRUE7O0FBQ0FFLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLFVBQUNDLENBQUQsRUFBSUMsRUFBSixFQUFXO0FBQ2xCQSxFQUFBQSxFQUFFLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FBRjtBQUNILENBRkQsRSxDQUlBOztBQUNBSCxFQUFFLENBQUNJLEdBQUg7QUFBQSwyRkFBTyxpQkFBT0MsTUFBUCxFQUF1QkMsSUFBdkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0NDLFlBQUFBLEtBREQsR0FDU0YsTUFBTSxDQUFDRyxTQUFQLENBQWlCQyxLQUFqQixDQUF1QkYsS0FEaEM7O0FBQUEsaUJBRUNBLEtBRkQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLG1CQUlzQkcsR0FBRyxDQUFDQyxNQUFKLENBQVdKLEtBQVgsRUFBa0JLLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxVQUE5QixDQUp0Qjs7QUFBQTtBQUlTQyxZQUFBQSxJQUpUO0FBS0tWLFlBQUFBLE1BQU0sQ0FBQ1csUUFBUCxHQUFrQkQsSUFBSSxDQUFDQyxRQUF2QjtBQUxMLDZDQU1ZVixJQUFJLEVBTmhCOztBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQVFZQSxJQUFJLENBQUMsSUFBSVcsS0FBSixDQUFVLGFBQVYsQ0FBRCxDQVJoQjs7QUFBQTtBQUFBLDZDQVdJWCxJQUFJLENBQUMsSUFBSVcsS0FBSixDQUFVLGdCQUFWLENBQUQsQ0FYUjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFQOztBQUFBO0FBQUE7QUFBQTtBQUFBLEssQ0FjQTs7QUFDTyxJQUFNQyxvQkFBK0IsR0FBR2xCLEVBQUUsQ0FBQ21CLEVBQUgsQ0FBTSxnQkFBTixDQUF4Qzs7QUFDQSxJQUFNQyxlQUEwQixHQUFHcEIsRUFBRSxDQUFDbUIsRUFBSCxDQUFNLFVBQU4sQ0FBbkMsQyxDQUVQOzs7QUFDQW5CLEVBQUUsQ0FBQ3FCLEVBQUgsQ0FBTSxZQUFOO0FBQUEsNEZBQW9CLGtCQUFPaEIsTUFBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFDVmlCLHNCQUFZQyxHQUFaLENBQWdCbEIsTUFBTSxDQUFDVyxRQUF2QixFQUFpQ1gsTUFBTSxDQUFDbUIsRUFBeEMsQ0FEVTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFwQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlBeEIsRUFBRSxDQUFDcUIsRUFBSCxDQUFNLFlBQU47QUFBQSw0RkFBb0Isa0JBQU9oQixNQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUNWaUIsZ0NBQW1CakIsTUFBTSxDQUFDVyxRQUExQixDQURVOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQXBCOztBQUFBO0FBQUE7QUFBQTtBQUFBLEssQ0FJQTtBQUNBO0FBQ0E7QUFFQTs7QUFDQUksZUFBZSxDQUFDQyxFQUFoQixDQUFtQixZQUFuQixFQUFpQyxVQUFDaEIsTUFBRCxFQUFZO0FBQ3pDb0IsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlyQixNQUFNLENBQUNFLEtBQW5CLEVBRHlDLENBR3pDOztBQUNBRixFQUFBQSxNQUFNLENBQUNnQixFQUFQLENBQVUsTUFBVixFQUFrQixVQUFDTSxJQUFELEVBQVU7QUFDeEJ0QixJQUFBQSxNQUFNLENBQUN1QixJQUFQLENBQVlELElBQUksQ0FBQ0UsT0FBakI7QUFDSCxHQUZELEVBSnlDLENBUXpDOztBQUNBeEIsRUFBQUEsTUFBTSxDQUFDZ0IsRUFBUCxDQUFVLFNBQVYsRUFBcUIsVUFBQ00sSUFBRCxFQUFVO0FBQzNCO0FBQ0E7QUFDQXRCLElBQUFBLE1BQU0sQ0FBQ3lCLEVBQVAsQ0FBVUgsSUFBSSxDQUFDRSxPQUFmLEVBQXdCRSxJQUF4QixDQUE2QkosSUFBSSxDQUFDSyxPQUFsQztBQUNILEdBSkQsRUFUeUMsQ0FlekM7O0FBQ0EzQixFQUFBQSxNQUFNLENBQUNnQixFQUFQLENBQVUsT0FBVixFQUFtQixVQUFDTSxJQUFELEVBQVU7QUFDekJ0QixJQUFBQSxNQUFNLENBQUM0QixLQUFQLENBQWFOLElBQUksQ0FBQ0UsT0FBbEI7QUFDSCxHQUZEO0FBR0gsQ0FuQkQ7ZUFxQmU3QixFIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2lvID0gcmVxdWlyZSgnc29ja2V0LmlvJylcclxuaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcclxuaW1wb3J0IHsgc29ja2V0U3RvcmUgfSBmcm9tICcuL2xpYi9oZWxwZXJzL2tleXN0b3JlJztcclxuaW1wb3J0IHsgTmFtZXNwYWNlLCBTb2NrZXQgfSBmcm9tICdzb2NrZXQuaW8nO1xyXG5cclxuY29uc3QgaW86IFNvY2tldElPLlNlcnZlciA9IG5ldyBzaW8oKVxyXG5cclxuLy8gUGVybWl0IGFsbCBvcmlnaW5zXHJcbmlvLm9yaWdpbnMoKG8sIGNiKSA9PiB7XHJcbiAgICBjYihudWxsLCB0cnVlKVxyXG59KVxyXG5cclxuLy8gVmVyaWZ5IHRva2VuIG9uIHJlcXVlc3QgaGFuZHNoYWtlXHJcbmlvLnVzZShhc3luYyAoc29ja2V0OiBTb2NrZXQsIG5leHQpID0+IHtcclxuICAgIGxldCB0b2tlbiA9IHNvY2tldC5oYW5kc2hha2UucXVlcnkudG9rZW5cclxuICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCB1c2VyID0gYXdhaXQgand0LnZlcmlmeSh0b2tlbiwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVClcclxuICAgICAgICAgICAgc29ja2V0LnVzZXJuYW1lID0gdXNlci51c2VybmFtZVxyXG4gICAgICAgICAgICByZXR1cm4gbmV4dCgpXHJcbiAgICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcignQXV0aCBmYWlsZWQnKSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV4dChuZXcgRXJyb3IoJ0F1dGggbm90IHZhbGlkJykpXHJcbn0pXHJcblxyXG4vLyBFeHBvcnQgbmFtZXNwYWNlcyBmb3IgbWVzc2FnaW5nIGFuZCBub3RpZmljYXRpb25zXHJcbmV4cG9ydCBjb25zdCBub3RpZmljYXRpb25fY2hhbm5lbDogTmFtZXNwYWNlID0gaW8ub2YoJy9ub3RpZmljYXRpb25zJylcclxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VfY2hhbm5lbDogTmFtZXNwYWNlID0gaW8ub2YoJy9tZXNzYWdlJylcclxuXHJcbi8vIFVwZGF0ZSBrZXkvdmFsdWUgc3RvcmUgaG9sZGluZyBzb2NrZXQgSURzIG9uIGNvbm5lY3QvZGlzY29ubmVjdFxyXG5pby5vbignY29ubmVjdGlvbicsIGFzeW5jIChzb2NrZXQpID0+IHtcclxuICAgIGF3YWl0IHNvY2tldFN0b3JlLnNldChzb2NrZXQudXNlcm5hbWUsIHNvY2tldC5pZClcclxufSlcclxuXHJcbmlvLm9uKCdkaXNjb25uZWN0JywgYXN5bmMgKHNvY2tldCkgPT4ge1xyXG4gICAgYXdhaXQgc29ja2V0U3RvcmUuZGVsZXRlKHNvY2tldC51c2VybmFtZSlcclxufSlcclxuXHJcbi8vIG5vdGlmaWNhdGlvbl9jaGFubmVsLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xyXG4vLyAgICAgbm90aWZpY2F0aW9uX2NoYW5uZWwudG8oc29ja2V0LmlkKS5lbWl0KCdub3RpZmljYXRpb24nLCAnWU9VIENPTkVDVEVEJylcclxuLy8gfSlcclxuXHJcbi8vIERpc3RyaWJ1dGUgbWVzc2FnZXNcclxubWVzc2FnZV9jaGFubmVsLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coc29ja2V0LnRva2VuKVxyXG5cclxuICAgIC8vSGFuZGxlIGNvbnZvIGpvaW5cclxuICAgIHNvY2tldC5vbignam9pbicsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgc29ja2V0LmpvaW4oZGF0YS5jb252b0lkKVxyXG4gICAgfSlcclxuXHJcbiAgICAvL0hhbmRsZSBuZXcgbWVzc2FnZVxyXG4gICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgKGRhdGEpID0+IHtcclxuICAgICAgICAvL3NhdmUgaW4gZGJcclxuICAgICAgICAvL2VtaXQgdG8gb3RoZXIgcmVjcHNcclxuICAgICAgICBzb2NrZXQudG8oZGF0YS5jb252b0lkKS5lbWl0KGRhdGEubWVzc2FnZSlcclxuICAgIH0pXHJcblxyXG4gICAgLy9MZWF2ZSBjb252ZXJzYXRpb25cclxuICAgIHNvY2tldC5vbignbGVhdmUnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHNvY2tldC5sZWF2ZShkYXRhLmNvbnZvSWQpXHJcbiAgICB9KVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW8iXX0=