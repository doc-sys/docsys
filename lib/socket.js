"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.message_channel = exports.notification_channel = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var jwt = _interopRequireWildcard(require("jsonwebtoken"));

var _keystore = require("./lib/helpers/keystore");

var _conversation = require("./models/conversation");

var _user4 = require("./models/user");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var sio = require('socket.io');

var io = new sio(); // Permit all origins

io.origins(function (o, cb) {
  cb(null, true);
}); // Verify token on request handshake

io.use( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(socket, next) {
    var token, _user;

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
            _user = _context.sent;
            socket.username = _user.username;
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

var notification_channel = io.of('/api/notifications');
exports.notification_channel = notification_channel;
var message_channel = io.of('/api/message'); // Auth for each namespace

exports.message_channel = message_channel;
notification_channel.use( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(socket, next) {
    var token, _user2;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            token = socket.handshake.query.token;

            if (!token) {
              _context2.next = 13;
              break;
            }

            _context2.prev = 2;
            _context2.next = 5;
            return jwt.verify(token, process.env.JWT_SECRET);

          case 5:
            _user2 = _context2.sent;
            socket.username = _user2.username;
            return _context2.abrupt("return", next());

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](2);
            return _context2.abrupt("return", next(new Error('Auth failed')));

          case 13:
            return _context2.abrupt("return", next(new Error('Auth not valid')));

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 10]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
message_channel.use( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(socket, next) {
    var token, _user3;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            token = socket.handshake.query.token;

            if (!token) {
              _context3.next = 14;
              break;
            }

            _context3.prev = 2;
            _context3.next = 5;
            return jwt.verify(token, process.env.JWT_SECRET);

          case 5:
            _user3 = _context3.sent;
            socket.username = _user3.username;
            socket._id = _user3._id;
            return _context3.abrupt("return", next());

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](2);
            return _context3.abrupt("return", next(new Error('Auth failed')));

          case 14:
            return _context3.abrupt("return", next(new Error('Auth not valid')));

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 11]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()); // Update key/value store holding socket IDs on connect/disconnect

io.on('connection', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(socket) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            socket.on('disconnect', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
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
            })));
            _context5.next = 3;
            return _keystore.socketStore.get(socket.username);

          case 3:
            if (_context5.sent) {
              _context5.next = 7;
              break;
            }

            console.log("adding to redis: ".concat(socket.username, " with ").concat(socket.id));
            _context5.next = 7;
            return _keystore.socketStore.set(socket.username, socket.id);

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x7) {
    return _ref4.apply(this, arguments);
  };
}());
notification_channel.on('connection', function (socket) {
  console.log("".concat(socket.username, " connected to notification channel"));
}); // Distribute messages

message_channel.on('connection', function (socket) {
  console.log("".concat(socket.username, " connected to message channel")); //Handle convo join

  socket.on('join', function (data) {
    socket.join(data.convoId);
  }); //Handle new message

  socket.on('message', /*#__PURE__*/function () {
    var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(type, data) {
      var convo, us, payload;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _conversation.conversation.findOne({
                convoId: data.convoId
              }).populate('participants');

            case 2:
              convo = _context6.sent;
              _context6.next = 5;
              return _user4.user.findOne({
                _id: socket._id
              });

            case 5:
              us = _context6.sent;
              delete us.password, us.loginAttempts, us.lockUntil;
              convo.messages.push({
                from: socket._id,
                content: data.message,
                timestamp: Date.now()
              });
              _context6.next = 10;
              return convo.save();

            case 10:
              payload = convo.messages[convo.messages.length - 1];
              payload.from = us;
              _context6.next = 14;
              return emitMessage((0, _toConsumableArray2["default"])(convo.participants.map(function (e) {
                return e.username;
              })), {
                payload: payload,
                convoId: data.convoId
              });

            case 14:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x8, _x9) {
      return _ref6.apply(this, arguments);
    };
  }()); //Leave conversation

  socket.on('leave', function (data) {
    socket.leave(data.convoId);
  });
});

// helper function
function emitMessage(_x10, _x11) {
  return _emitMessage.apply(this, arguments);
}

function _emitMessage() {
  _emitMessage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(recps, message) {
    var _iterator, _step, recp, recp_adress;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _iterator = _createForOfIteratorHelper(recps);
            _context7.prev = 1;

            _iterator.s();

          case 3:
            if ((_step = _iterator.n()).done) {
              _context7.next = 11;
              break;
            }

            recp = _step.value;
            _context7.next = 7;
            return _keystore.socketStore.get(recp);

          case 7:
            recp_adress = _context7.sent;

            if (recp_adress) {
              console.log("emitting to ".concat(recp_adress));
              message_channel.to("/api/message#".concat(recp_adress)).emit('message', message);
            }

          case 9:
            _context7.next = 3;
            break;

          case 11:
            _context7.next = 16;
            break;

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](1);

            _iterator.e(_context7.t0);

          case 16:
            _context7.prev = 16;

            _iterator.f();

            return _context7.finish(16);

          case 19:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 13, 16, 19]]);
  }));
  return _emitMessage.apply(this, arguments);
}

var _default = io;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zb2NrZXQudHMiXSwibmFtZXMiOlsic2lvIiwicmVxdWlyZSIsImlvIiwib3JpZ2lucyIsIm8iLCJjYiIsInVzZSIsInNvY2tldCIsIm5leHQiLCJ0b2tlbiIsImhhbmRzaGFrZSIsInF1ZXJ5Iiwiand0IiwidmVyaWZ5IiwicHJvY2VzcyIsImVudiIsIkpXVF9TRUNSRVQiLCJ1c2VyIiwidXNlcm5hbWUiLCJFcnJvciIsIm5vdGlmaWNhdGlvbl9jaGFubmVsIiwib2YiLCJtZXNzYWdlX2NoYW5uZWwiLCJfaWQiLCJvbiIsImNvbnNvbGUiLCJsb2ciLCJzb2NrZXRTdG9yZSIsImdldCIsImlkIiwic2V0IiwiZGF0YSIsImpvaW4iLCJjb252b0lkIiwidHlwZSIsImNvbnZlcnNhdGlvbiIsImZpbmRPbmUiLCJwb3B1bGF0ZSIsImNvbnZvIiwidXMiLCJwYXNzd29yZCIsImxvZ2luQXR0ZW1wdHMiLCJsb2NrVW50aWwiLCJtZXNzYWdlcyIsInB1c2giLCJmcm9tIiwiY29udGVudCIsIm1lc3NhZ2UiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93Iiwic2F2ZSIsInBheWxvYWQiLCJsZW5ndGgiLCJlbWl0TWVzc2FnZSIsInBhcnRpY2lwYW50cyIsIm1hcCIsImUiLCJsZWF2ZSIsInJlY3BzIiwicmVjcCIsInJlY3BfYWRyZXNzIiwidG8iLCJlbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7OztBQU5BLElBQU1BLEdBQUcsR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBbkI7O0FBUUEsSUFBTUMsRUFBbUIsR0FBRyxJQUFJRixHQUFKLEVBQTVCLEMsQ0FFQTs7QUFDQUUsRUFBRSxDQUFDQyxPQUFILENBQVcsVUFBQ0MsQ0FBRCxFQUFJQyxFQUFKLEVBQVc7QUFDbEJBLEVBQUFBLEVBQUUsQ0FBQyxJQUFELEVBQU8sSUFBUCxDQUFGO0FBQ0gsQ0FGRCxFLENBSUE7O0FBQ0FILEVBQUUsQ0FBQ0ksR0FBSDtBQUFBLDJGQUFPLGlCQUFPQyxNQUFQLEVBQXVCQyxJQUF2QjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0NDLFlBQUFBLEtBREQsR0FDU0YsTUFBTSxDQUFDRyxTQUFQLENBQWlCQyxLQUFqQixDQUF1QkYsS0FEaEM7O0FBQUEsaUJBRUNBLEtBRkQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLG1CQUlzQkcsR0FBRyxDQUFDQyxNQUFKLENBQVdKLEtBQVgsRUFBa0JLLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxVQUE5QixDQUp0Qjs7QUFBQTtBQUlTQyxZQUFBQSxLQUpUO0FBS0tWLFlBQUFBLE1BQU0sQ0FBQ1csUUFBUCxHQUFrQkQsS0FBSSxDQUFDQyxRQUF2QjtBQUxMLDZDQU1ZVixJQUFJLEVBTmhCOztBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQVFZQSxJQUFJLENBQUMsSUFBSVcsS0FBSixDQUFVLGFBQVYsQ0FBRCxDQVJoQjs7QUFBQTtBQUFBLDZDQVdJWCxJQUFJLENBQUMsSUFBSVcsS0FBSixDQUFVLGdCQUFWLENBQUQsQ0FYUjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFQOztBQUFBO0FBQUE7QUFBQTtBQUFBLEssQ0FjQTs7QUFDTyxJQUFNQyxvQkFBK0IsR0FBR2xCLEVBQUUsQ0FBQ21CLEVBQUgsQ0FBTSxvQkFBTixDQUF4Qzs7QUFDQSxJQUFNQyxlQUEwQixHQUFHcEIsRUFBRSxDQUFDbUIsRUFBSCxDQUFNLGNBQU4sQ0FBbkMsQyxDQUVQOzs7QUFDQUQsb0JBQW9CLENBQUNkLEdBQXJCO0FBQUEsNEZBQXlCLGtCQUFPQyxNQUFQLEVBQXVCQyxJQUF2QjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2pCQyxZQUFBQSxLQURpQixHQUNURixNQUFNLENBQUNHLFNBQVAsQ0FBaUJDLEtBQWpCLENBQXVCRixLQURkOztBQUFBLGlCQUVqQkEsS0FGaUI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLG1CQUlJRyxHQUFHLENBQUNDLE1BQUosQ0FBV0osS0FBWCxFQUFrQkssT0FBTyxDQUFDQyxHQUFSLENBQVlDLFVBQTlCLENBSko7O0FBQUE7QUFJVEMsWUFBQUEsTUFKUztBQUtiVixZQUFBQSxNQUFNLENBQUNXLFFBQVAsR0FBa0JELE1BQUksQ0FBQ0MsUUFBdkI7QUFMYSw4Q0FNTlYsSUFBSSxFQU5FOztBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQVFOQSxJQUFJLENBQUMsSUFBSVcsS0FBSixDQUFVLGFBQVYsQ0FBRCxDQVJFOztBQUFBO0FBQUEsOENBV2RYLElBQUksQ0FBQyxJQUFJVyxLQUFKLENBQVUsZ0JBQVYsQ0FBRCxDQVhVOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQXpCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBY0FHLGVBQWUsQ0FBQ2hCLEdBQWhCO0FBQUEsNEZBQW9CLGtCQUFPQyxNQUFQLEVBQXVCQyxJQUF2QjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1pDLFlBQUFBLEtBRFksR0FDSkYsTUFBTSxDQUFDRyxTQUFQLENBQWlCQyxLQUFqQixDQUF1QkYsS0FEbkI7O0FBQUEsaUJBRVpBLEtBRlk7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLG1CQUlTRyxHQUFHLENBQUNDLE1BQUosQ0FBV0osS0FBWCxFQUFrQkssT0FBTyxDQUFDQyxHQUFSLENBQVlDLFVBQTlCLENBSlQ7O0FBQUE7QUFJSkMsWUFBQUEsTUFKSTtBQUtSVixZQUFBQSxNQUFNLENBQUNXLFFBQVAsR0FBa0JELE1BQUksQ0FBQ0MsUUFBdkI7QUFDQVgsWUFBQUEsTUFBTSxDQUFDZ0IsR0FBUCxHQUFhTixNQUFJLENBQUNNLEdBQWxCO0FBTlEsOENBT0RmLElBQUksRUFQSDs7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FTREEsSUFBSSxDQUFDLElBQUlXLEtBQUosQ0FBVSxhQUFWLENBQUQsQ0FUSDs7QUFBQTtBQUFBLDhDQVlUWCxJQUFJLENBQUMsSUFBSVcsS0FBSixDQUFVLGdCQUFWLENBQUQsQ0FaSzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFwQjs7QUFBQTtBQUFBO0FBQUE7QUFBQSxLLENBZUE7O0FBQ0FqQixFQUFFLENBQUNzQixFQUFILENBQU0sWUFBTjtBQUFBLDRGQUFvQixrQkFBT2pCLE1BQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNoQkEsWUFBQUEsTUFBTSxDQUFDaUIsRUFBUCxDQUFVLFlBQVYsNkZBQXdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDcEJDLHNCQUFBQSxPQUFPLENBQUNDLEdBQVIsb0JBQXdCbkIsTUFBTSxDQUFDVyxRQUEvQjtBQURvQjtBQUFBLDZCQUVkUyxnQ0FBbUJwQixNQUFNLENBQUNXLFFBQTFCLENBRmM7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBeEI7QUFEZ0I7QUFBQSxtQkFNTFMsc0JBQVlDLEdBQVosQ0FBZ0JyQixNQUFNLENBQUNXLFFBQXZCLENBTks7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFPWk8sWUFBQUEsT0FBTyxDQUFDQyxHQUFSLDRCQUFnQ25CLE1BQU0sQ0FBQ1csUUFBdkMsbUJBQXdEWCxNQUFNLENBQUNzQixFQUEvRDtBQVBZO0FBQUEsbUJBUU5GLHNCQUFZRyxHQUFaLENBQWdCdkIsTUFBTSxDQUFDVyxRQUF2QixFQUFpQ1gsTUFBTSxDQUFDc0IsRUFBeEMsQ0FSTTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFwQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVlBVCxvQkFBb0IsQ0FBQ0ksRUFBckIsQ0FBd0IsWUFBeEIsRUFBc0MsVUFBQ2pCLE1BQUQsRUFBWTtBQUM5Q2tCLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixXQUFlbkIsTUFBTSxDQUFDVyxRQUF0QjtBQUNILENBRkQsRSxDQUlBOztBQUNBSSxlQUFlLENBQUNFLEVBQWhCLENBQW1CLFlBQW5CLEVBQWlDLFVBQUNqQixNQUFELEVBQVk7QUFDekNrQixFQUFBQSxPQUFPLENBQUNDLEdBQVIsV0FBZW5CLE1BQU0sQ0FBQ1csUUFBdEIsb0NBRHlDLENBR3pDOztBQUNBWCxFQUFBQSxNQUFNLENBQUNpQixFQUFQLENBQVUsTUFBVixFQUFrQixVQUFDTyxJQUFELEVBQVU7QUFDeEJ4QixJQUFBQSxNQUFNLENBQUN5QixJQUFQLENBQVlELElBQUksQ0FBQ0UsT0FBakI7QUFDSCxHQUZELEVBSnlDLENBUXpDOztBQUNBMUIsRUFBQUEsTUFBTSxDQUFDaUIsRUFBUCxDQUFVLFNBQVY7QUFBQSw4RkFBcUIsa0JBQU9VLElBQVAsRUFBYUgsSUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUdDSSwyQkFBYUMsT0FBYixDQUFxQjtBQUFFSCxnQkFBQUEsT0FBTyxFQUFFRixJQUFJLENBQUNFO0FBQWhCLGVBQXJCLEVBQWdESSxRQUFoRCxDQUF5RCxjQUF6RCxDQUhEOztBQUFBO0FBR2JDLGNBQUFBLEtBSGE7QUFBQTtBQUFBLHFCQUlGckIsWUFBS21CLE9BQUwsQ0FBYTtBQUFFYixnQkFBQUEsR0FBRyxFQUFFaEIsTUFBTSxDQUFDZ0I7QUFBZCxlQUFiLENBSkU7O0FBQUE7QUFJYmdCLGNBQUFBLEVBSmE7QUFLakIscUJBQU9BLEVBQUUsQ0FBQ0MsUUFBVixFQUFvQkQsRUFBRSxDQUFDRSxhQUF2QixFQUFzQ0YsRUFBRSxDQUFDRyxTQUF6QztBQUVBSixjQUFBQSxLQUFLLENBQUNLLFFBQU4sQ0FBZUMsSUFBZixDQUFvQjtBQUNoQkMsZ0JBQUFBLElBQUksRUFBRXRDLE1BQU0sQ0FBQ2dCLEdBREc7QUFFaEJ1QixnQkFBQUEsT0FBTyxFQUFFZixJQUFJLENBQUNnQixPQUZFO0FBR2hCQyxnQkFBQUEsU0FBUyxFQUFFQyxJQUFJLENBQUNDLEdBQUw7QUFISyxlQUFwQjtBQVBpQjtBQUFBLHFCQVlYWixLQUFLLENBQUNhLElBQU4sRUFaVzs7QUFBQTtBQWNiQyxjQUFBQSxPQWRhLEdBY0hkLEtBQUssQ0FBQ0ssUUFBTixDQUFlTCxLQUFLLENBQUNLLFFBQU4sQ0FBZVUsTUFBZixHQUF3QixDQUF2QyxDQWRHO0FBZWpCRCxjQUFBQSxPQUFPLENBQUNQLElBQVIsR0FBZU4sRUFBZjtBQWZpQjtBQUFBLHFCQWlCWGUsV0FBVyxxQ0FBS2hCLEtBQUssQ0FBQ2lCLFlBQU4sQ0FBbUJDLEdBQW5CLENBQXVCLFVBQUFDLENBQUM7QUFBQSx1QkFBSUEsQ0FBQyxDQUFDdkMsUUFBTjtBQUFBLGVBQXhCLENBQUwsR0FBeUQ7QUFDdEVrQyxnQkFBQUEsT0FBTyxFQUFFQSxPQUQ2RDtBQUV0RW5CLGdCQUFBQSxPQUFPLEVBQUVGLElBQUksQ0FBQ0U7QUFGd0QsZUFBekQsQ0FqQkE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBckI7O0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FUeUMsQ0FnQ3pDOztBQUNBMUIsRUFBQUEsTUFBTSxDQUFDaUIsRUFBUCxDQUFVLE9BQVYsRUFBbUIsVUFBQ08sSUFBRCxFQUFVO0FBQ3pCeEIsSUFBQUEsTUFBTSxDQUFDbUQsS0FBUCxDQUFhM0IsSUFBSSxDQUFDRSxPQUFsQjtBQUNILEdBRkQ7QUFHSCxDQXBDRDs7QUEyQ0E7U0FDZXFCLFc7Ozs7OytGQUFmLGtCQUEyQkssS0FBM0IsRUFBNENaLE9BQTVDO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtREFDcUJZLEtBRHJCO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDYUMsWUFBQUEsSUFEYjtBQUFBO0FBQUEsbUJBRXdDakMsc0JBQVlDLEdBQVosQ0FBZ0JnQyxJQUFoQixDQUZ4Qzs7QUFBQTtBQUVZQyxZQUFBQSxXQUZaOztBQUdRLGdCQUFJQSxXQUFKLEVBQWlCO0FBQ2JwQyxjQUFBQSxPQUFPLENBQUNDLEdBQVIsdUJBQTJCbUMsV0FBM0I7QUFDQXZDLGNBQUFBLGVBQWUsQ0FBQ3dDLEVBQWhCLHdCQUFtQ0QsV0FBbkMsR0FBa0RFLElBQWxELENBQXVELFNBQXZELEVBQWtFaEIsT0FBbEU7QUFDSDs7QUFOVDtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7Ozs7ZUFVZTdDLEUiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzaW8gPSByZXF1aXJlKCdzb2NrZXQuaW8nKVxuaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcbmltcG9ydCB7IHNvY2tldFN0b3JlIH0gZnJvbSAnLi9saWIvaGVscGVycy9rZXlzdG9yZSdcbmltcG9ydCB7IE5hbWVzcGFjZSwgU29ja2V0IH0gZnJvbSAnc29ja2V0LmlvJ1xuXG5pbXBvcnQgeyBjb252ZXJzYXRpb24gfSBmcm9tICcuL21vZGVscy9jb252ZXJzYXRpb24nXG5pbXBvcnQgeyB1c2VyIH0gZnJvbSAnLi9tb2RlbHMvdXNlcidcblxuY29uc3QgaW86IFNvY2tldElPLlNlcnZlciA9IG5ldyBzaW8oKVxuXG4vLyBQZXJtaXQgYWxsIG9yaWdpbnNcbmlvLm9yaWdpbnMoKG8sIGNiKSA9PiB7XG4gICAgY2IobnVsbCwgdHJ1ZSlcbn0pXG5cbi8vIFZlcmlmeSB0b2tlbiBvbiByZXF1ZXN0IGhhbmRzaGFrZVxuaW8udXNlKGFzeW5jIChzb2NrZXQ6IFNvY2tldCwgbmV4dCkgPT4ge1xuICAgIGxldCB0b2tlbiA9IHNvY2tldC5oYW5kc2hha2UucXVlcnkudG9rZW5cbiAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCB1c2VyID0gYXdhaXQgand0LnZlcmlmeSh0b2tlbiwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVClcbiAgICAgICAgICAgIHNvY2tldC51c2VybmFtZSA9IHVzZXIudXNlcm5hbWVcbiAgICAgICAgICAgIHJldHVybiBuZXh0KClcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3IoJ0F1dGggZmFpbGVkJykpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5leHQobmV3IEVycm9yKCdBdXRoIG5vdCB2YWxpZCcpKVxufSlcblxuLy8gRXhwb3J0IG5hbWVzcGFjZXMgZm9yIG1lc3NhZ2luZyBhbmQgbm90aWZpY2F0aW9uc1xuZXhwb3J0IGNvbnN0IG5vdGlmaWNhdGlvbl9jaGFubmVsOiBOYW1lc3BhY2UgPSBpby5vZignL2FwaS9ub3RpZmljYXRpb25zJylcbmV4cG9ydCBjb25zdCBtZXNzYWdlX2NoYW5uZWw6IE5hbWVzcGFjZSA9IGlvLm9mKCcvYXBpL21lc3NhZ2UnKVxuXG4vLyBBdXRoIGZvciBlYWNoIG5hbWVzcGFjZVxubm90aWZpY2F0aW9uX2NoYW5uZWwudXNlKGFzeW5jIChzb2NrZXQ6IFNvY2tldCwgbmV4dCkgPT4ge1xuICAgIGxldCB0b2tlbiA9IHNvY2tldC5oYW5kc2hha2UucXVlcnkudG9rZW5cbiAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCB1c2VyID0gYXdhaXQgand0LnZlcmlmeSh0b2tlbiwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVClcbiAgICAgICAgICAgIHNvY2tldC51c2VybmFtZSA9IHVzZXIudXNlcm5hbWVcbiAgICAgICAgICAgIHJldHVybiBuZXh0KClcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3IoJ0F1dGggZmFpbGVkJykpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5leHQobmV3IEVycm9yKCdBdXRoIG5vdCB2YWxpZCcpKVxufSlcblxubWVzc2FnZV9jaGFubmVsLnVzZShhc3luYyAoc29ja2V0OiBTb2NrZXQsIG5leHQpID0+IHtcbiAgICBsZXQgdG9rZW4gPSBzb2NrZXQuaGFuZHNoYWtlLnF1ZXJ5LnRva2VuXG4gICAgaWYgKHRva2VuKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgdXNlciA9IGF3YWl0IGp3dC52ZXJpZnkodG9rZW4sIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQpXG4gICAgICAgICAgICBzb2NrZXQudXNlcm5hbWUgPSB1c2VyLnVzZXJuYW1lXG4gICAgICAgICAgICBzb2NrZXQuX2lkID0gdXNlci5faWRcbiAgICAgICAgICAgIHJldHVybiBuZXh0KClcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3IoJ0F1dGggZmFpbGVkJykpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5leHQobmV3IEVycm9yKCdBdXRoIG5vdCB2YWxpZCcpKVxufSlcblxuLy8gVXBkYXRlIGtleS92YWx1ZSBzdG9yZSBob2xkaW5nIHNvY2tldCBJRHMgb24gY29ubmVjdC9kaXNjb25uZWN0XG5pby5vbignY29ubmVjdGlvbicsIGFzeW5jIChzb2NrZXQpID0+IHtcbiAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGByZW1vdmluZyAke3NvY2tldC51c2VybmFtZX0gZnJvbSByZWRpc2ApXG4gICAgICAgIGF3YWl0IHNvY2tldFN0b3JlLmRlbGV0ZShzb2NrZXQudXNlcm5hbWUpXG4gICAgfSlcblxuICAgIGlmICghYXdhaXQgc29ja2V0U3RvcmUuZ2V0KHNvY2tldC51c2VybmFtZSkpIHtcbiAgICAgICAgY29uc29sZS5sb2coYGFkZGluZyB0byByZWRpczogJHtzb2NrZXQudXNlcm5hbWV9IHdpdGggJHtzb2NrZXQuaWR9YClcbiAgICAgICAgYXdhaXQgc29ja2V0U3RvcmUuc2V0KHNvY2tldC51c2VybmFtZSwgc29ja2V0LmlkKVxuICAgIH1cbn0pXG5cbm5vdGlmaWNhdGlvbl9jaGFubmVsLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGAke3NvY2tldC51c2VybmFtZX0gY29ubmVjdGVkIHRvIG5vdGlmaWNhdGlvbiBjaGFubmVsYClcbn0pXG5cbi8vIERpc3RyaWJ1dGUgbWVzc2FnZXNcbm1lc3NhZ2VfY2hhbm5lbC5vbignY29ubmVjdGlvbicsIChzb2NrZXQpID0+IHtcbiAgICBjb25zb2xlLmxvZyhgJHtzb2NrZXQudXNlcm5hbWV9IGNvbm5lY3RlZCB0byBtZXNzYWdlIGNoYW5uZWxgKVxuXG4gICAgLy9IYW5kbGUgY29udm8gam9pblxuICAgIHNvY2tldC5vbignam9pbicsIChkYXRhKSA9PiB7XG4gICAgICAgIHNvY2tldC5qb2luKGRhdGEuY29udm9JZClcbiAgICB9KVxuXG4gICAgLy9IYW5kbGUgbmV3IG1lc3NhZ2VcbiAgICBzb2NrZXQub24oJ21lc3NhZ2UnLCBhc3luYyAodHlwZSwgZGF0YSkgPT4ge1xuICAgICAgICAvL3NhdmUgaW4gZGJcbiAgICAgICAgLy9lbWl0IHRvIG90aGVyIHJlY3BzXG4gICAgICAgIGxldCBjb252byA9IGF3YWl0IGNvbnZlcnNhdGlvbi5maW5kT25lKHsgY29udm9JZDogZGF0YS5jb252b0lkIH0pLnBvcHVsYXRlKCdwYXJ0aWNpcGFudHMnKVxuICAgICAgICBsZXQgdXMgPSBhd2FpdCB1c2VyLmZpbmRPbmUoeyBfaWQ6IHNvY2tldC5faWQgfSlcbiAgICAgICAgZGVsZXRlIHVzLnBhc3N3b3JkLCB1cy5sb2dpbkF0dGVtcHRzLCB1cy5sb2NrVW50aWxcblxuICAgICAgICBjb252by5tZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICAgIGZyb206IHNvY2tldC5faWQsXG4gICAgICAgICAgICBjb250ZW50OiBkYXRhLm1lc3NhZ2UsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KClcbiAgICAgICAgfSlcbiAgICAgICAgYXdhaXQgY29udm8uc2F2ZSgpXG5cbiAgICAgICAgbGV0IHBheWxvYWQgPSBjb252by5tZXNzYWdlc1tjb252by5tZXNzYWdlcy5sZW5ndGggLSAxXVxuICAgICAgICBwYXlsb2FkLmZyb20gPSB1c1xuXG4gICAgICAgIGF3YWl0IGVtaXRNZXNzYWdlKFsuLi5jb252by5wYXJ0aWNpcGFudHMubWFwKGUgPT4gZS51c2VybmFtZSBhcyBTdHJpbmcpXSwge1xuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgICAgIGNvbnZvSWQ6IGRhdGEuY29udm9JZFxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICAvL0xlYXZlIGNvbnZlcnNhdGlvblxuICAgIHNvY2tldC5vbignbGVhdmUnLCAoZGF0YSkgPT4ge1xuICAgICAgICBzb2NrZXQubGVhdmUoZGF0YS5jb252b0lkKVxuICAgIH0pXG59KVxuXG5pbnRlcmZhY2UgbWVzc2FnZUlmIHtcbiAgICBwYXlsb2FkOiBhbnksXG4gICAgY29udm9JZDogU3RyaW5nXG59XG5cbi8vIGhlbHBlciBmdW5jdGlvblxuYXN5bmMgZnVuY3Rpb24gZW1pdE1lc3NhZ2UocmVjcHM6IFtTdHJpbmddLCBtZXNzYWdlOiBtZXNzYWdlSWYpIHtcbiAgICBmb3IgKGxldCByZWNwIG9mIHJlY3BzKSB7XG4gICAgICAgIGxldCByZWNwX2FkcmVzczogU3RyaW5nID0gYXdhaXQgc29ja2V0U3RvcmUuZ2V0KHJlY3ApXG4gICAgICAgIGlmIChyZWNwX2FkcmVzcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYGVtaXR0aW5nIHRvICR7cmVjcF9hZHJlc3N9YClcbiAgICAgICAgICAgIG1lc3NhZ2VfY2hhbm5lbC50byhgL2FwaS9tZXNzYWdlIyR7cmVjcF9hZHJlc3N9YCkuZW1pdCgnbWVzc2FnZScsIG1lc3NhZ2UpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlvIl19