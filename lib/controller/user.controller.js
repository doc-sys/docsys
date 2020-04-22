"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlockUser = exports.deleteUser = exports.getAllUser = exports.findUser = exports.updateUser = exports.addUser = exports.authenticateUser = exports.checkPropertyName = exports.checkPropertyMail = exports.checkPropertyPassword = exports.checkPropertyUsername = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _error = require("../lib/helpers/error");

var _user = require("../models/user");

var jwt = _interopRequireWildcard(require("jsonwebtoken"));

//CheckPropertyHandler
var checkPropertyUsername = function checkPropertyUsername(req, res, next) {
  req.body.hasOwnProperty('username') || req.params.hasOwnProperty('username') ? next() : next(new _error.ErrorHandler(400, 'Please provide a username'));
};

exports.checkPropertyUsername = checkPropertyUsername;

var checkPropertyPassword = function checkPropertyPassword(req, res, next) {
  req.body.hasOwnProperty('password') || req.params.hasOwnProperty('password') ? next() : next(new _error.ErrorHandler(400, 'Please provide a password'));
};

exports.checkPropertyPassword = checkPropertyPassword;

var checkPropertyMail = function checkPropertyMail(req, res, next) {
  req.body.hasOwnProperty('mail') || req.params.hasOwnProperty('mail') ? next() : next(new _error.ErrorHandler(400, 'Please provide a mail address'));
};

exports.checkPropertyMail = checkPropertyMail;

var checkPropertyName = function checkPropertyName(req, res, next) {
  req.body.hasOwnProperty('displayName') || req.params.hasOwnProperty('displayname') ? next() : next(new _error.ErrorHandler(400, 'Please provide a display name'));
}; //ModelOperations


exports.checkPropertyName = checkPropertyName;

var authenticateUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var username, password, result, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            username = req.body.username || req.params.username || res.locals.user.username;
            password = req.body.password || req.params.password || res.locals.user.password;

            if (!(username === undefined)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", next(new _error.ErrorHandler(400, 'Please provide a username')));

          case 4:
            if (!(password === undefined)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", next(new _error.ErrorHandler(400, 'Please provide a password')));

          case 6:
            _context.prev = 6;
            _context.next = 9;
            return _user.user.getAuthenticated(username, password);

          case 9:
            result = _context.sent;
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](6);
            return _context.abrupt("return", next(new _error.ErrorHandler(501, "Error authenticating user: ".concat(_context.t0.message))));

          case 15:
            _context.prev = 15;
            _context.next = 18;
            return jwt.sign(result.toJSON(), process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES
            });

          case 18:
            token = _context.sent;
            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t1 = _context["catch"](15);
            return _context.abrupt("return", next(new _error.ErrorHandler(501, "Error token signing: ".concat(_context.t1.message))));

          case 24:
            res.locals.user = result;
            res.locals.token = token;
            next();

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 12], [15, 21]]);
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
    var updatedUser;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _user.user.findOneAndUpdate({
              username: req.body.username || req.params.username
            }, req.body, {
              "new": true
            });

          case 3:
            updatedUser = _context3.sent;
            res.locals.user = updatedUser;
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", next(new _error.ErrorHandler(500, "Error updating user: ".concat(_context3.t0.message))));

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL3VzZXIuY29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJjaGVja1Byb3BlcnR5VXNlcm5hbWUiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm9keSIsImhhc093blByb3BlcnR5IiwicGFyYW1zIiwiRXJyb3JIYW5kbGVyIiwiY2hlY2tQcm9wZXJ0eVBhc3N3b3JkIiwiY2hlY2tQcm9wZXJ0eU1haWwiLCJjaGVja1Byb3BlcnR5TmFtZSIsImF1dGhlbnRpY2F0ZVVzZXIiLCJ1c2VybmFtZSIsImxvY2FscyIsInVzZXIiLCJwYXNzd29yZCIsInVuZGVmaW5lZCIsImdldEF1dGhlbnRpY2F0ZWQiLCJyZXN1bHQiLCJtZXNzYWdlIiwiand0Iiwic2lnbiIsInRvSlNPTiIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwiZXhwaXJlc0luIiwiSldUX0VYUElSRVMiLCJ0b2tlbiIsImFkZFVzZXIiLCJuZXdVc2VyIiwibWFpbCIsInNldHRpbmdzIiwibGFuZ3VhZ2UiLCJkaXNwbGF5TmFtZSIsInNhdmUiLCJ1cGRhdGVVc2VyIiwiZmluZE9uZUFuZFVwZGF0ZSIsInVwZGF0ZWRVc2VyIiwiZmluZFVzZXIiLCJmaW5kT25lIiwic2VsZWN0IiwidGhpc1VzZXIiLCJnZXRBbGxVc2VyIiwiZmluZCIsImFsbFVzZXIiLCJkZWxldGVVc2VyIiwiZmluZE9uZUFuZERlbGV0ZSIsImRlbGV0ZWRVc2VyIiwidW5sb2NrVXNlciIsInVwZGF0ZU9uZSIsIiRzZXQiLCJsb2dpbkF0dGVtcHRzIiwibG9ja1VudGlsIiwidW5sb2NrZWRVc2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTtBQUNPLElBQU1BLHFCQUFxQixHQUFHLFNBQXhCQSxxQkFBd0IsQ0FBQ0MsR0FBRCxFQUFlQyxHQUFmLEVBQThCQyxJQUE5QixFQUEyRDtBQUM1RkYsRUFBQUEsR0FBRyxDQUFDRyxJQUFKLENBQVNDLGNBQVQs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QUFBQSxJQUFJLEVBQUU7QUFBRUMsZ0JBQUFBLGFBQWEsRUFBRSxDQUFqQjtBQUFvQkMsZ0JBQUFBLFNBQVMsRUFBRTtBQUEvQjtBQUFSLGFBQXZFLEVBQXdIWixNQUF4SCxDQUErSCx1REFBL0gsQ0FGUDs7QUFBQTtBQUVkYSxZQUFBQSxZQUZjO0FBR2xCcEQsWUFBQUEsR0FBRyxDQUFDVyxNQUFKLENBQVdDLElBQVgsR0FBa0J3QyxZQUFsQjtBQUhrQjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUtYbkQsSUFBSSxDQUFDLElBQUlJLG1CQUFKLENBQWlCLEdBQWpCLGtDQUErQyxhQUFpQlksT0FBaEUsRUFBRCxDQUxPOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUg7O0FBQUEsa0JBQVY4QixVQUFVO0FBQUE7QUFBQTtBQUFBLEdBQWhCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCB7IEVycm9ySGFuZGxlciB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2Vycm9yJztcclxuaW1wb3J0IHsgdXNlciB9IGZyb20gJy4uL21vZGVscy91c2VyJ1xyXG5pbXBvcnQgKiBhcyBqd3QgZnJvbSAnanNvbndlYnRva2VuJ1xyXG5cclxuLy9DaGVja1Byb3BlcnR5SGFuZGxlclxyXG5leHBvcnQgY29uc3QgY2hlY2tQcm9wZXJ0eVVzZXJuYW1lID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKTogdm9pZCA9PiB7XHJcbiAgICByZXEuYm9keS5oYXNPd25Qcm9wZXJ0eSgndXNlcm5hbWUnKSB8fCByZXEucGFyYW1zLmhhc093blByb3BlcnR5KCd1c2VybmFtZScpID8gbmV4dCgpIDogbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMCwgJ1BsZWFzZSBwcm92aWRlIGEgdXNlcm5hbWUnKSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNoZWNrUHJvcGVydHlQYXNzd29yZCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbik6IHZvaWQgPT4ge1xyXG4gICAgcmVxLmJvZHkuaGFzT3duUHJvcGVydHkoJ3Bhc3N3b3JkJykgfHwgcmVxLnBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgncGFzc3dvcmQnKSA/IG5leHQoKSA6IG5leHQobmV3IEVycm9ySGFuZGxlcig0MDAsICdQbGVhc2UgcHJvdmlkZSBhIHBhc3N3b3JkJykpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja1Byb3BlcnR5TWFpbCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbik6IHZvaWQgPT4ge1xyXG4gICAgcmVxLmJvZHkuaGFzT3duUHJvcGVydHkoJ21haWwnKSB8fCByZXEucGFyYW1zLmhhc093blByb3BlcnR5KCdtYWlsJykgPyBuZXh0KCkgOiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAwLCAnUGxlYXNlIHByb3ZpZGUgYSBtYWlsIGFkZHJlc3MnKSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNoZWNrUHJvcGVydHlOYW1lID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKTogdm9pZCA9PiB7XHJcbiAgICByZXEuYm9keS5oYXNPd25Qcm9wZXJ0eSgnZGlzcGxheU5hbWUnKSB8fCByZXEucGFyYW1zLmhhc093blByb3BlcnR5KCdkaXNwbGF5bmFtZScpID8gbmV4dCgpIDogbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMCwgJ1BsZWFzZSBwcm92aWRlIGEgZGlzcGxheSBuYW1lJykpXHJcbn1cclxuXHJcbi8vTW9kZWxPcGVyYXRpb25zXHJcbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGVVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBsZXQgdXNlcm5hbWUgPSByZXEuYm9keS51c2VybmFtZSB8fCByZXEucGFyYW1zLnVzZXJuYW1lIHx8IHJlcy5sb2NhbHMudXNlci51c2VybmFtZVxyXG4gICAgbGV0IHBhc3N3b3JkID0gcmVxLmJvZHkucGFzc3dvcmQgfHwgcmVxLnBhcmFtcy5wYXNzd29yZCB8fCByZXMubG9jYWxzLnVzZXIucGFzc3dvcmRcclxuXHJcbiAgICBpZiAodXNlcm5hbWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDAsICdQbGVhc2UgcHJvdmlkZSBhIHVzZXJuYW1lJykpXHJcbiAgICBpZiAocGFzc3dvcmQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDAsICdQbGVhc2UgcHJvdmlkZSBhIHBhc3N3b3JkJykpXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgdXNlci5nZXRBdXRoZW50aWNhdGVkKFxyXG4gICAgICAgICAgICB1c2VybmFtZSxcclxuICAgICAgICAgICAgcGFzc3dvcmRcclxuICAgICAgICApXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAxLCBgRXJyb3IgYXV0aGVudGljYXRpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhd2FpdCBqd3Quc2lnbihyZXN1bHQudG9KU09OKCksIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQsIHtcclxuICAgICAgICAgICAgZXhwaXJlc0luOiBwcm9jZXNzLmVudi5KV1RfRVhQSVJFUyxcclxuICAgICAgICB9KVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMSwgYEVycm9yIHRva2VuIHNpZ25pbmc6ICR7ZXJyb3IubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICByZXMubG9jYWxzLnVzZXIgPSByZXN1bHRcclxuICAgIHJlcy5sb2NhbHMudG9rZW4gPSB0b2tlblxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYWRkVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgbmV3VXNlciA9IG5ldyB1c2VyKHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5LnVzZXJuYW1lLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXHJcbiAgICAgICAgICAgIG1haWw6IHJlcS5ib2R5Lm1haWwsXHJcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICBsYW5ndWFnZTogJ2VuJyxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiByZXEuYm9keS5kaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBhd2FpdCBuZXdVc2VyLnNhdmUoKVxyXG5cclxuICAgICAgICByZXMubG9jYWxzLnVzZXIgPSBuZXdVc2VyXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgY3JlYXRpbmcgdXNlcjogJHtlcnJvci5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgdXBkYXRlZFVzZXIgPSBhd2FpdCB1c2VyLmZpbmRPbmVBbmRVcGRhdGUoeyB1c2VybmFtZTogcmVxLmJvZHkudXNlcm5hbWUgfHwgcmVxLnBhcmFtcy51c2VybmFtZSB9LCByZXEuYm9keSwgeyBuZXc6IHRydWUgfSlcclxuICAgICAgICByZXMubG9jYWxzLnVzZXIgPSB1cGRhdGVkVXNlclxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIHVwZGF0aW5nIHVzZXI6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBGaW5kT3BlcmF0aW9uc1xyXG5leHBvcnQgY29uc3QgZmluZFVzZXIgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHRoaXNVc2VyID0gYXdhaXQgdXNlci5maW5kT25lKHsgdXNlcm5hbWU6IHJlcS5ib2R5LnVzZXJuYW1lIHx8IHJlcS5wYXJhbXMudXNlcm5hbWUgfSkuc2VsZWN0KCd1c2VybmFtZSBhdmF0YXIgc2V0dGluZ3MgbG9naW5BdHRlbXB0cyBtYWlsIGxvY2tVbnRpbCBpc0xvY2tlZCcpXHJcbiAgICAgICAgcmVzLmxvY2Fscy51c2VyID0gdGhpc1VzZXJcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDEsICdVc2VyIG5vdCBmb3VuZCcpKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgYWxsVXNlciA9IGF3YWl0IHVzZXIuZmluZCh7fSkuc2VsZWN0KCd1c2VybmFtZSBhdmF0YXIgc2V0dGluZ3MgbG9naW5BdHRlbXB0cyBtYWlsIGxvY2tVbnRpbCBpc0xvY2tlZCcpXHJcbiAgICAgICAgcmVzLmxvY2Fscy51c2VyID0gYWxsVXNlclxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGZpbmRpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vIE1vZGVsIEFkbWluIEZ1bmN0aW9uc1xyXG5leHBvcnQgY29uc3QgZGVsZXRlVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgZGVsZXRlZFVzZXIgPSBhd2FpdCB1c2VyLmZpbmRPbmVBbmREZWxldGUoeyB1c2VybmFtZTogcmVxLmJvZHkudXNlcm5hbWUgfHwgcmVxLnBhcmFtcy51c2VybmFtZSB9LCB7IHNlbGVjdDogJ3VzZXJuYW1lJyB9KVxyXG4gICAgICAgIHJlcy5sb2NhbHMudXNlciA9IGRlbGV0ZWRVc2VyXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZGVsZXRpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1bmxvY2tVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCB1bmxvY2tlZFVzZXIgPSBhd2FpdCB1c2VyLnVwZGF0ZU9uZSh7IHVzZXJuYW1lOiByZXEuYm9keS51c2VybmFtZSB8fCByZXEucGFyYW1zLnVzZXJuYW1lIH0sIHsgJHNldDogeyBsb2dpbkF0dGVtcHRzOiAwLCBsb2NrVW50aWw6IG51bGwgfSB9KS5zZWxlY3QoJ3VzZXJuYW1lIGF2YXRhciBzZXR0aW5ncyBsb2dpbkF0dGVtcHRzIG1haWwgbG9ja1VudGlsJylcclxuICAgICAgICByZXMubG9jYWxzLnVzZXIgPSB1bmxvY2tlZFVzZXJcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciB1bmxvY2tpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcbn0iXX0=