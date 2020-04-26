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

var _expressValidator = require("express-validator");

//ModelOperations
var authenticateUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var errors, username, password, result, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            errors = (0, _expressValidator.validationResult)(req).formatWith(function (_ref2) {
              var msg = _ref2.msg,
                  param = _ref2.param;
              return "[".concat(param, "]: ").concat(msg);
            });

            if (errors.isEmpty()) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next(new _error.ErrorHandler(400, errors.array()[0])));

          case 3:
            username = req.body.username || req.params.username || res.locals.user.username;
            password = req.body.password || req.params.password || res.locals.user.password;
            _context.prev = 5;
            _context.next = 8;
            return _user.user.getAuthenticated(username, password);

          case 8:
            result = _context.sent;
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](5);
            return _context.abrupt("return", next(new _error.ErrorHandler(501, "Error authenticating user: ".concat(_context.t0.message))));

          case 14:
            _context.prev = 14;
            _context.next = 17;
            return jwt.sign(result.toJSON(), process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES
            });

          case 17:
            token = _context.sent;
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t1 = _context["catch"](14);
            return _context.abrupt("return", next(new _error.ErrorHandler(501, "Error token signing: ".concat(_context.t1.message))));

          case 23:
            res.locals.user = result;
            res.locals.token = token;
            next();

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 11], [14, 20]]);
  }));

  return function authenticateUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.authenticateUser = authenticateUser;

var addUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
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
    return _ref3.apply(this, arguments);
  };
}();

exports.addUser = addUser;

var updateUser = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var updatedUser;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            delete req.body.lockUntil, req.body.loginAttempts, req.body.admin;
            _context3.next = 4;
            return _user.user.findOneAndUpdate({
              username: req.body.username || req.params.username
            }, req.body, {
              "new": true
            });

          case 4:
            updatedUser = _context3.sent;
            res.locals.user = updatedUser;
            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", next(new _error.ErrorHandler(500, "Error updating user: ".concat(_context3.t0.message))));

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));

  return function updateUser(_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}(); // FindOperations


exports.updateUser = updateUser;

var findUser = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
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
    return _ref5.apply(this, arguments);
  };
}();

exports.findUser = findUser;

var getAllUser = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
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
    return _ref6.apply(this, arguments);
  };
}(); // Model Admin Functions


exports.getAllUser = getAllUser;

var deleteUser = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
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
    return _ref7.apply(this, arguments);
  };
}();

exports.deleteUser = deleteUser;

var unlockUser = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
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
    return _ref8.apply(this, arguments);
  };
}();

exports.unlockUser = unlockUser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL3VzZXIuY29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJhdXRoZW50aWNhdGVVc2VyIiwicmVxIiwicmVzIiwibmV4dCIsImVycm9ycyIsImZvcm1hdFdpdGgiLCJtc2ciLCJwYXJhbSIsImlzRW1wdHkiLCJFcnJvckhhbmRsZXIiLCJhcnJheSIsInVzZXJuYW1lIiwiYm9keSIsInBhcmFtcyIsImxvY2FscyIsInVzZXIiLCJwYXNzd29yZCIsImdldEF1dGhlbnRpY2F0ZWQiLCJyZXN1bHQiLCJtZXNzYWdlIiwiand0Iiwic2lnbiIsInRvSlNPTiIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwiZXhwaXJlc0luIiwiSldUX0VYUElSRVMiLCJ0b2tlbiIsImFkZFVzZXIiLCJuZXdVc2VyIiwibWFpbCIsInNldHRpbmdzIiwibGFuZ3VhZ2UiLCJkaXNwbGF5TmFtZSIsInNhdmUiLCJ1cGRhdGVVc2VyIiwibG9ja1VudGlsIiwibG9naW5BdHRlbXB0cyIsImFkbWluIiwiZmluZE9uZUFuZFVwZGF0ZSIsInVwZGF0ZWRVc2VyIiwiZmluZFVzZXIiLCJmaW5kT25lIiwic2VsZWN0IiwidGhpc1VzZXIiLCJnZXRBbGxVc2VyIiwiZmluZCIsImFsbFVzZXIiLCJkZWxldGVVc2VyIiwiZmluZE9uZUFuZERlbGV0ZSIsImRlbGV0ZWRVc2VyIiwidW5sb2NrVXNlciIsInVwZGF0ZU9uZSIsIiRzZXQiLCJ1bmxvY2tlZFVzZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUVBO0FBQ08sSUFBTUEsZ0JBQWdCO0FBQUEsMkZBQUcsaUJBQU9DLEdBQVAsRUFBcUJDLEdBQXJCLEVBQW9DQyxJQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDdEJDLFlBQUFBLE1BRHNCLEdBQ2Isd0NBQWlCSCxHQUFqQixFQUFzQkksVUFBdEIsQ0FBaUMsaUJBQW9CO0FBQUEsa0JBQWpC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QUFBL0I7QUFBUixhQUF2RSxFQUF3SE8sTUFBeEgsQ0FBK0gsdURBQS9ILENBRlA7O0FBQUE7QUFFZFcsWUFBQUEsWUFGYztBQUdsQnJELFlBQUFBLEdBQUcsQ0FBQ1ksTUFBSixDQUFXQyxJQUFYLEdBQWtCd0MsWUFBbEI7QUFIa0I7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FLWHBELElBQUksQ0FBQyxJQUFJTSxtQkFBSixDQUFpQixHQUFqQixrQ0FBK0MsYUFBaUJVLE9BQWhFLEVBQUQsQ0FMTzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFWaUMsVUFBVTtBQUFBO0FBQUE7QUFBQSxHQUFoQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyBFcnJvckhhbmRsZXIgfSBmcm9tICcuLi9saWIvaGVscGVycy9lcnJvcic7XHJcbmltcG9ydCB7IHVzZXIgfSBmcm9tICcuLi9tb2RlbHMvdXNlcidcclxuaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcclxuXHJcbmltcG9ydCB7IHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcidcclxuXHJcbi8vTW9kZWxPcGVyYXRpb25zXHJcbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGVVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBjb25zdCBlcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSkuZm9ybWF0V2l0aCgoeyBtc2csIHBhcmFtIH0pID0+IHsgcmV0dXJuIGBbJHtwYXJhbX1dOiAke21zZ31gIH0pXHJcbiAgICBpZiAoIWVycm9ycy5pc0VtcHR5KCkpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMCwgZXJyb3JzLmFycmF5KClbMF0pKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCB1c2VybmFtZSA9IHJlcS5ib2R5LnVzZXJuYW1lIHx8IHJlcS5wYXJhbXMudXNlcm5hbWUgfHwgcmVzLmxvY2Fscy51c2VyLnVzZXJuYW1lXHJcbiAgICBsZXQgcGFzc3dvcmQgPSByZXEuYm9keS5wYXNzd29yZCB8fCByZXEucGFyYW1zLnBhc3N3b3JkIHx8IHJlcy5sb2NhbHMudXNlci5wYXNzd29yZFxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IHVzZXIuZ2V0QXV0aGVudGljYXRlZChcclxuICAgICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkXHJcbiAgICAgICAgKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMSwgYEVycm9yIGF1dGhlbnRpY2F0aW5nIHVzZXI6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXdhaXQgand0LnNpZ24ocmVzdWx0LnRvSlNPTigpLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVULCB7XHJcbiAgICAgICAgICAgIGV4cGlyZXNJbjogcHJvY2Vzcy5lbnYuSldUX0VYUElSRVMsXHJcbiAgICAgICAgfSlcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDEsIGBFcnJvciB0b2tlbiBzaWduaW5nOiAke2Vycm9yLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmxvY2Fscy51c2VyID0gcmVzdWx0XHJcbiAgICByZXMubG9jYWxzLnRva2VuID0gdG9rZW5cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFkZFVzZXIgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIG5ld1VzZXIgPSBuZXcgdXNlcih7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS51c2VybmFtZSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxyXG4gICAgICAgICAgICBtYWlsOiByZXEuYm9keS5tYWlsLFxyXG4gICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6ICdlbicsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogcmVxLmJvZHkuZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgYXdhaXQgbmV3VXNlci5zYXZlKClcclxuXHJcbiAgICAgICAgcmVzLmxvY2Fscy51c2VyID0gbmV3VXNlclxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGNyZWF0aW5nIHVzZXI6ICR7ZXJyb3IubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZVVzZXIgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZGVsZXRlIHJlcS5ib2R5LmxvY2tVbnRpbCwgcmVxLmJvZHkubG9naW5BdHRlbXB0cywgcmVxLmJvZHkuYWRtaW5cclxuICAgICAgICBsZXQgdXBkYXRlZFVzZXIgPSBhd2FpdCB1c2VyLmZpbmRPbmVBbmRVcGRhdGUoeyB1c2VybmFtZTogcmVxLmJvZHkudXNlcm5hbWUgfHwgcmVxLnBhcmFtcy51c2VybmFtZSB9LCByZXEuYm9keSwgeyBuZXc6IHRydWUgfSlcclxuICAgICAgICByZXMubG9jYWxzLnVzZXIgPSB1cGRhdGVkVXNlclxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIHVwZGF0aW5nIHVzZXI6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBGaW5kT3BlcmF0aW9uc1xyXG5leHBvcnQgY29uc3QgZmluZFVzZXIgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHRoaXNVc2VyID0gYXdhaXQgdXNlci5maW5kT25lKHsgdXNlcm5hbWU6IHJlcS5ib2R5LnVzZXJuYW1lIHx8IHJlcS5wYXJhbXMudXNlcm5hbWUgfSkuc2VsZWN0KCd1c2VybmFtZSBhdmF0YXIgc2V0dGluZ3MgbG9naW5BdHRlbXB0cyBtYWlsIGxvY2tVbnRpbCBpc0xvY2tlZCcpXHJcbiAgICAgICAgcmVzLmxvY2Fscy51c2VyID0gdGhpc1VzZXJcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDEsICdVc2VyIG5vdCBmb3VuZCcpKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgYWxsVXNlciA9IGF3YWl0IHVzZXIuZmluZCh7fSkuc2VsZWN0KCd1c2VybmFtZSBhdmF0YXIgc2V0dGluZ3MgbG9naW5BdHRlbXB0cyBtYWlsIGxvY2tVbnRpbCBpc0xvY2tlZCcpXHJcbiAgICAgICAgcmVzLmxvY2Fscy51c2VyID0gYWxsVXNlclxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGZpbmRpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vIE1vZGVsIEFkbWluIEZ1bmN0aW9uc1xyXG5leHBvcnQgY29uc3QgZGVsZXRlVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgZGVsZXRlZFVzZXIgPSBhd2FpdCB1c2VyLmZpbmRPbmVBbmREZWxldGUoeyB1c2VybmFtZTogcmVxLmJvZHkudXNlcm5hbWUgfHwgcmVxLnBhcmFtcy51c2VybmFtZSB9LCB7IHNlbGVjdDogJ3VzZXJuYW1lJyB9KVxyXG4gICAgICAgIHJlcy5sb2NhbHMudXNlciA9IGRlbGV0ZWRVc2VyXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZGVsZXRpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1bmxvY2tVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCB1bmxvY2tlZFVzZXIgPSBhd2FpdCB1c2VyLnVwZGF0ZU9uZSh7IHVzZXJuYW1lOiByZXEuYm9keS51c2VybmFtZSB8fCByZXEucGFyYW1zLnVzZXJuYW1lIH0sIHsgJHNldDogeyBsb2dpbkF0dGVtcHRzOiAwLCBsb2NrVW50aWw6IG51bGwgfSB9KS5zZWxlY3QoJ3VzZXJuYW1lIGF2YXRhciBzZXR0aW5ncyBsb2dpbkF0dGVtcHRzIG1haWwgbG9ja1VudGlsJylcclxuICAgICAgICByZXMubG9jYWxzLnVzZXIgPSB1bmxvY2tlZFVzZXJcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciB1bmxvY2tpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcbn0iXX0=