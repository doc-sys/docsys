"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlockUser = exports.deleteUser = exports.getAllUser = exports.findUser = exports.updateUser = exports.addUser = exports.authenticateUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _error = require("../lib/helpers/error");

var _user = require("../models/user");

var jwt = _interopRequireWildcard(require("jsonwebtoken"));

var sharp = require('sharp');

//ModelOperations
var authenticateUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var username, password, result, cleanResult, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            username = req.body.username || req.params.username || res.locals.user.username;
            password = req.body.password || req.params.password || res.locals.user.password;
            _context.prev = 2;
            _context.next = 5;
            return _user.user.getAuthenticated(username, password);

          case 5:
            result = _context.sent;
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](2);
            return _context.abrupt("return", next(new _error.ErrorHandler(501, "Error authenticating user: ".concat(_context.t0.message))));

          case 11:
            cleanResult = result.toJSON();
            _context.next = 14;
            return delete cleanResult.avatar;

          case 14:
            _context.next = 16;
            return delete cleanResult.password;

          case 16:
            _context.next = 18;
            return delete result.password;

          case 18:
            _context.prev = 18;
            _context.next = 21;
            return jwt.sign(cleanResult, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES
            });

          case 21:
            token = _context.sent;
            _context.next = 27;
            break;

          case 24:
            _context.prev = 24;
            _context.t1 = _context["catch"](18);
            return _context.abrupt("return", next(new _error.ErrorHandler(501, "Error token signing: ".concat(_context.t1.message))));

          case 27:
            res.locals.user = result;
            res.locals.token = token;
            next();

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 8], [18, 24]]);
  }));

  return function authenticateUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.authenticateUser = authenticateUser;

var addUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var newUser;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            newUser = new _user.user({
              username: req.body.username,
              password: req.body.password,
              mail: req.body.mail,
              settings: {
                language: 'en',
                displayName: req.body.displayName
              }
            });
            _context2.next = 4;
            return newUser.save();

          case 4:
            res.locals.user = newUser;
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", next(new _error.ErrorHandler(500, "Error creating user: ".concat(_context2.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function addUser(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.addUser = addUser;

var updateUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var newAvatar, updatedUser;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            delete req.body.lockUntil, req.body.loginAttempts, req.body.admin;

            if (!req.file) {
              _context3.next = 9;
              break;
            }

            _context3.next = 5;
            return sharp(req.file.buffer).resize(64, 64).toBuffer();

          case 5:
            newAvatar = _context3.sent;
            _context3.next = 8;
            return Buffer.from(newAvatar).toString('base64');

          case 8:
            req.body.avatar = _context3.sent;

          case 9:
            _context3.next = 11;
            return _user.user.findOneAndUpdate({
              username: req.body.username || req.params.username
            }, req.body, {
              "new": true
            });

          case 11:
            updatedUser = _context3.sent;
            res.locals.user = updatedUser;
            _context3.next = 18;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", next(new _error.ErrorHandler(500, "Error updating user: ".concat(_context3.t0.message))));

          case 18:
            next();

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 15]]);
  }));

  return function updateUser(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}(); // FindOperations


exports.updateUser = updateUser;

var findUser = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var thisUser;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _user.user.findOne({
              username: req.body.username || req.params.username
            }).select('username avatar settings loginAttempts mail lockUntil isLocked');

          case 3:
            thisUser = _context4.sent;
            res.locals.user = thisUser;
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            return _context4.abrupt("return", next(new _error.ErrorHandler(401, 'User not found')));

          case 10:
            next();

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function findUser(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.findUser = findUser;

var getAllUser = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var allUser;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _user.user.find({}).select('username avatar settings loginAttempts mail lockUntil isLocked');

          case 3:
            allUser = _context5.sent;
            res.locals.user = allUser;
            _context5.next = 10;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            return _context5.abrupt("return", next(new _error.ErrorHandler(500, "Error finding user: ".concat(_context5.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 7]]);
  }));

  return function getAllUser(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}(); // Model Admin Functions


exports.getAllUser = getAllUser;

var deleteUser = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var deletedUser;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _user.user.findOneAndDelete({
              username: req.body.username || req.params.username
            }, {
              select: 'username'
            });

          case 3:
            deletedUser = _context6.sent;
            res.locals.user = deletedUser;
            _context6.next = 10;
            break;

          case 7:
            _context6.prev = 7;
            _context6.t0 = _context6["catch"](0);
            return _context6.abrupt("return", next(new _error.ErrorHandler(500, "Error deleting user: ".concat(_context6.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 7]]);
  }));

  return function deleteUser(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.deleteUser = deleteUser;

var unlockUser = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var unlockedUser;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return _user.user.updateOne({
              username: req.body.username || req.params.username
            }, {
              $set: {
                loginAttempts: 0,
                lockUntil: null
              }
            }).select('username avatar settings loginAttempts mail lockUntil');

          case 3:
            unlockedUser = _context7.sent;
            res.locals.user = unlockedUser;
            _context7.next = 10;
            break;

          case 7:
            _context7.prev = 7;
            _context7.t0 = _context7["catch"](0);
            return _context7.abrupt("return", next(new _error.ErrorHandler(500, "Error unlocking user: ".concat(_context7.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 7]]);
  }));

  return function unlockUser(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

exports.unlockUser = unlockUser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL3VzZXIuY29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJzaGFycCIsInJlcXVpcmUiLCJhdXRoZW50aWNhdGVVc2VyIiwicmVxIiwicmVzIiwibmV4dCIsInVzZXJuYW1lIiwiYm9keSIsInBhcmFtcyIsImxvY2FscyIsInVzZXIiLCJwYXNzd29yZCIsImdldEF1dGhlbnRpY2F0ZWQiLCJyZXN1bHQiLCJFcnJvckhhbmRsZXIiLCJtZXNzYWdlIiwiY2xlYW5SZXN1bHQiLCJ0b0pTT04iLCJhdmF0YXIiLCJqd3QiLCJzaWduIiwicHJvY2VzcyIsImVudiIsIkpXVF9TRUNSRVQiLCJleHBpcmVzSW4iLCJKV1RfRVhQSVJFUyIsInRva2VuIiwiYWRkVXNlciIsIm5ld1VzZXIiLCJtYWlsIiwic2V0dGluZ3MiLCJsYW5ndWFnZSIsImRpc3BsYXlOYW1lIiwic2F2ZSIsInVwZGF0ZVVzZXIiLCJsb2NrVW50aWwiLCJsb2dpbkF0dGVtcHRzIiwiYWRtaW4iLCJmaWxlIiwiYnVmZmVyIiwicmVzaXplIiwidG9CdWZmZXIiLCJuZXdBdmF0YXIiLCJCdWZmZXIiLCJmcm9tIiwidG9TdHJpbmciLCJmaW5kT25lQW5kVXBkYXRlIiwidXBkYXRlZFVzZXIiLCJmaW5kVXNlciIsImZpbmRPbmUiLCJzZWxlY3QiLCJ0aGlzVXNlciIsImdldEFsbFVzZXIiLCJmaW5kIiwiYWxsVXNlciIsImRlbGV0ZVVzZXIiLCJmaW5kT25lQW5kRGVsZXRlIiwiZGVsZXRlZFVzZXIiLCJ1bmxvY2tVc2VyIiwidXBkYXRlT25lIiwiJHNldCIsInVubG9ja2VkVXNlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0EsSUFBSUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsT0FBRCxDQUFuQjs7QUFJQTtBQUNPLElBQU1DLGdCQUFnQjtBQUFBLDJGQUFHLGlCQUFPQyxHQUFQLEVBQXFCQyxHQUFyQixFQUFvQ0MsSUFBcEM7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LGtCQUFPdkQsR0FBUCxFQUFxQkMsR0FBckIsRUFBb0NDLElBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFFT0ssV0FBS2lELFNBQUwsQ0FBZTtBQUFFckQsY0FBQUEsUUFBUSxFQUFFSCxHQUFHLENBQUNJLElBQUosQ0FBU0QsUUFBVCxJQUFxQkgsR0FBRyxDQUFDSyxNQUFKLENBQVdGO0FBQTVDLGFBQWYsRUFBdUU7QUFBRXNELGNBQUFBLElBQUksRUFBRTtBQUFFeEIsZ0JBQUFBLGFBQWEsRUFBRSxDQUFqQjtBQUFvQkQsZ0JBQUFBLFNBQVMsRUFBRTtBQUEvQjtBQUFSLGFBQXZFLEVBQXdIZSxNQUF4SCxDQUErSCx1REFBL0gsQ0FGUDs7QUFBQTtBQUVkVyxZQUFBQSxZQUZjO0FBR2xCekQsWUFBQUEsR0FBRyxDQUFDSyxNQUFKLENBQVdDLElBQVgsR0FBa0JtRCxZQUFsQjtBQUhrQjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUtYeEQsSUFBSSxDQUFDLElBQUlTLG1CQUFKLENBQWlCLEdBQWpCLGtDQUErQyxhQUFpQkMsT0FBaEUsRUFBRCxDQUxPOztBQUFBO0FBUXRCVixZQUFBQSxJQUFJOztBQVJrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFWcUQsVUFBVTtBQUFBO0FBQUE7QUFBQSxHQUFoQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyBFcnJvckhhbmRsZXIgfSBmcm9tICcuLi9saWIvaGVscGVycy9lcnJvcic7XHJcbmltcG9ydCB7IHVzZXIgfSBmcm9tICcuLi9tb2RlbHMvdXNlcidcclxuaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcclxubGV0IHNoYXJwID0gcmVxdWlyZSgnc2hhcnAnKVxyXG5cclxuaW1wb3J0IHsgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJ1xyXG5cclxuLy9Nb2RlbE9wZXJhdGlvbnNcclxuZXhwb3J0IGNvbnN0IGF1dGhlbnRpY2F0ZVVzZXIgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGxldCB1c2VybmFtZSA9IHJlcS5ib2R5LnVzZXJuYW1lIHx8IHJlcS5wYXJhbXMudXNlcm5hbWUgfHwgcmVzLmxvY2Fscy51c2VyLnVzZXJuYW1lXHJcbiAgICBsZXQgcGFzc3dvcmQgPSByZXEuYm9keS5wYXNzd29yZCB8fCByZXEucGFyYW1zLnBhc3N3b3JkIHx8IHJlcy5sb2NhbHMudXNlci5wYXNzd29yZFxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IHVzZXIuZ2V0QXV0aGVudGljYXRlZChcclxuICAgICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkXHJcbiAgICAgICAgKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMSwgYEVycm9yIGF1dGhlbnRpY2F0aW5nIHVzZXI6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBjbGVhblJlc3VsdCA9IHJlc3VsdC50b0pTT04oKVxyXG4gICAgYXdhaXQgZGVsZXRlIGNsZWFuUmVzdWx0LmF2YXRhclxyXG4gICAgYXdhaXQgZGVsZXRlIGNsZWFuUmVzdWx0LnBhc3N3b3JkXHJcbiAgICBhd2FpdCBkZWxldGUgcmVzdWx0LnBhc3N3b3JkXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhd2FpdCBqd3Quc2lnbihjbGVhblJlc3VsdCwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCwge1xyXG4gICAgICAgICAgICBleHBpcmVzSW46IHByb2Nlc3MuZW52LkpXVF9FWFBJUkVTLFxyXG4gICAgICAgIH0pXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAxLCBgRXJyb3IgdG9rZW4gc2lnbmluZzogJHtlcnJvci5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIHJlcy5sb2NhbHMudXNlciA9IHJlc3VsdFxyXG4gICAgcmVzLmxvY2Fscy50b2tlbiA9IHRva2VuXHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBhZGRVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHZhciBuZXdVc2VyID0gbmV3IHVzZXIoe1xyXG4gICAgICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkudXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuICAgICAgICAgICAgbWFpbDogcmVxLmJvZHkubWFpbCxcclxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiAnZW4nLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IHJlcS5ib2R5LmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGF3YWl0IG5ld1VzZXIuc2F2ZSgpXHJcblxyXG4gICAgICAgIHJlcy5sb2NhbHMudXNlciA9IG5ld1VzZXJcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjcmVhdGluZyB1c2VyOiAke2Vycm9yLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGRlbGV0ZSByZXEuYm9keS5sb2NrVW50aWwsIHJlcS5ib2R5LmxvZ2luQXR0ZW1wdHMsIHJlcS5ib2R5LmFkbWluXHJcbiAgICAgICAgaWYgKHJlcS5maWxlKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdBdmF0YXIgPSBhd2FpdCBzaGFycChyZXEuZmlsZS5idWZmZXIpLnJlc2l6ZSg2NCwgNjQpLnRvQnVmZmVyKClcclxuICAgICAgICAgICAgcmVxLmJvZHkuYXZhdGFyID0gYXdhaXQgQnVmZmVyLmZyb20obmV3QXZhdGFyKS50b1N0cmluZygnYmFzZTY0JylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB1cGRhdGVkVXNlciA9IGF3YWl0IHVzZXIuZmluZE9uZUFuZFVwZGF0ZSh7IHVzZXJuYW1lOiByZXEuYm9keS51c2VybmFtZSB8fCByZXEucGFyYW1zLnVzZXJuYW1lIH0sIHJlcS5ib2R5LCB7IG5ldzogdHJ1ZSB9KVxyXG4gICAgICAgIHJlcy5sb2NhbHMudXNlciA9IHVwZGF0ZWRVc2VyXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgdXBkYXRpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vIEZpbmRPcGVyYXRpb25zXHJcbmV4cG9ydCBjb25zdCBmaW5kVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgdGhpc1VzZXIgPSBhd2FpdCB1c2VyLmZpbmRPbmUoeyB1c2VybmFtZTogcmVxLmJvZHkudXNlcm5hbWUgfHwgcmVxLnBhcmFtcy51c2VybmFtZSB9KS5zZWxlY3QoJ3VzZXJuYW1lIGF2YXRhciBzZXR0aW5ncyBsb2dpbkF0dGVtcHRzIG1haWwgbG9ja1VudGlsIGlzTG9ja2VkJylcclxuICAgICAgICByZXMubG9jYWxzLnVzZXIgPSB0aGlzVXNlclxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMSwgJ1VzZXIgbm90IGZvdW5kJykpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBhbGxVc2VyID0gYXdhaXQgdXNlci5maW5kKHt9KS5zZWxlY3QoJ3VzZXJuYW1lIGF2YXRhciBzZXR0aW5ncyBsb2dpbkF0dGVtcHRzIG1haWwgbG9ja1VudGlsIGlzTG9ja2VkJylcclxuICAgICAgICByZXMubG9jYWxzLnVzZXIgPSBhbGxVc2VyXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZmluZGluZyB1c2VyOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuLy8gTW9kZWwgQWRtaW4gRnVuY3Rpb25zXHJcbmV4cG9ydCBjb25zdCBkZWxldGVVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBkZWxldGVkVXNlciA9IGF3YWl0IHVzZXIuZmluZE9uZUFuZERlbGV0ZSh7IHVzZXJuYW1lOiByZXEuYm9keS51c2VybmFtZSB8fCByZXEucGFyYW1zLnVzZXJuYW1lIH0sIHsgc2VsZWN0OiAndXNlcm5hbWUnIH0pXHJcbiAgICAgICAgcmVzLmxvY2Fscy51c2VyID0gZGVsZXRlZFVzZXJcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBkZWxldGluZyB1c2VyOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVubG9ja1VzZXIgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHVubG9ja2VkVXNlciA9IGF3YWl0IHVzZXIudXBkYXRlT25lKHsgdXNlcm5hbWU6IHJlcS5ib2R5LnVzZXJuYW1lIHx8IHJlcS5wYXJhbXMudXNlcm5hbWUgfSwgeyAkc2V0OiB7IGxvZ2luQXR0ZW1wdHM6IDAsIGxvY2tVbnRpbDogbnVsbCB9IH0pLnNlbGVjdCgndXNlcm5hbWUgYXZhdGFyIHNldHRpbmdzIGxvZ2luQXR0ZW1wdHMgbWFpbCBsb2NrVW50aWwnKVxyXG4gICAgICAgIHJlcy5sb2NhbHMudXNlciA9IHVubG9ja2VkVXNlclxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIHVubG9ja2luZyB1c2VyOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufSJdfQ==