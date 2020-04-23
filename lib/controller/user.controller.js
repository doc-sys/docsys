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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL3VzZXIuY29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJjaGVja1Byb3BlcnR5VXNlcm5hbWUiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm9keSIsImhhc093blByb3BlcnR5IiwicGFyYW1zIiwiRXJyb3JIYW5kbGVyIiwiY2hlY2tQcm9wZXJ0eVBhc3N3b3JkIiwiY2hlY2tQcm9wZXJ0eU1haWwiLCJjaGVja1Byb3BlcnR5TmFtZSIsImF1dGhlbnRpY2F0ZVVzZXIiLCJ1c2VybmFtZSIsImxvY2FscyIsInVzZXIiLCJwYXNzd29yZCIsInVuZGVmaW5lZCIsImdldEF1dGhlbnRpY2F0ZWQiLCJyZXN1bHQiLCJtZXNzYWdlIiwiand0Iiwic2lnbiIsInRvSlNPTiIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwiZXhwaXJlc0luIiwiSldUX0VYUElSRVMiLCJ0b2tlbiIsImFkZFVzZXIiLCJuZXdVc2VyIiwibWFpbCIsInNldHRpbmdzIiwibGFuZ3VhZ2UiLCJkaXNwbGF5TmFtZSIsInNhdmUiLCJ1cGRhdGVVc2VyIiwibG9ja1VudGlsIiwibG9naW5BdHRlbXB0cyIsImFkbWluIiwiZmluZE9uZUFuZFVwZGF0ZSIsInVwZGF0ZWRVc2VyIiwiZmluZFVzZXIiLCJmaW5kT25lIiwic2VsZWN0IiwidGhpc1VzZXIiLCJnZXRBbGxVc2VyIiwiZmluZCIsImFsbFVzZXIiLCJkZWxldGVVc2VyIiwiZmluZE9uZUFuZERlbGV0ZSIsImRlbGV0ZWRVc2VyIiwidW5sb2NrVXNlciIsInVwZGF0ZU9uZSIsIiRzZXQiLCJ1bmxvY2tlZFVzZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUVBO0FBQ08sSUFBTUEscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QixDQUFDQyxHQUFELEVBQWVDLEdBQWYsRUFBOEJDLElBQTlCLEVBQTJEO0FBQzVGRixFQUFBQSxHQUFHLENBQUNHLElBQUosQ0FB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RU9XLFdBQUt1QyxTQUFMLENBQWU7QUFBRXpDLGNBQUFBLFFBQVEsRUFBRVgsR0FBRyxDQUFDRyxJQUFKLENBQVNRLFFBQVQsSUFBcUJYLEdBQUcsQ0FBQ0ssTUFBSixDQUFXTTtBQUE1QyxhQUFmLEVBQXVFO0FBQUUwQyxjQUFBQSxJQUFJLEVBQUU7QUFBRWhCLGdCQUFBQSxhQUFhLEVBQUUsQ0FBakI7QUFBb0JELGdCQUFBQSxTQUFTLEVBQUU7QUFBL0I7QUFBUixhQUF2RSxFQUF3SE8sTUFBeEgsQ0FBK0gsdURBQS9ILENBRlA7O0FBQUE7QUFFZFcsWUFBQUEsWUFGYztBQUdsQnJELFlBQUFBLEdBQUcsQ0FBQ1csTUFBSixDQUFXQyxJQUFYLEdBQWtCeUMsWUFBbEI7QUFIa0I7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FLWHBELElBQUksQ0FBQyxJQUFJSSxtQkFBSixDQUFpQixHQUFqQixrQ0FBK0MsYUFBaUJZLE9BQWhFLEVBQUQsQ0FMTzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFWaUMsVUFBVTtBQUFBO0FBQUE7QUFBQSxHQUFoQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyBFcnJvckhhbmRsZXIgfSBmcm9tICcuLi9saWIvaGVscGVycy9lcnJvcic7XHJcbmltcG9ydCB7IHVzZXIgfSBmcm9tICcuLi9tb2RlbHMvdXNlcidcclxuaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcclxuXHJcbi8vQ2hlY2tQcm9wZXJ0eUhhbmRsZXJcclxuZXhwb3J0IGNvbnN0IGNoZWNrUHJvcGVydHlVc2VybmFtZSA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbik6IHZvaWQgPT4ge1xyXG4gICAgcmVxLmJvZHkuaGFzT3duUHJvcGVydHkoJ3VzZXJuYW1lJykgfHwgcmVxLnBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndXNlcm5hbWUnKSA/IG5leHQoKSA6IG5leHQobmV3IEVycm9ySGFuZGxlcig0MDAsICdQbGVhc2UgcHJvdmlkZSBhIHVzZXJuYW1lJykpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja1Byb3BlcnR5UGFzc3dvcmQgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pOiB2b2lkID0+IHtcclxuICAgIHJlcS5ib2R5Lmhhc093blByb3BlcnR5KCdwYXNzd29yZCcpIHx8IHJlcS5wYXJhbXMuaGFzT3duUHJvcGVydHkoJ3Bhc3N3b3JkJykgPyBuZXh0KCkgOiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAwLCAnUGxlYXNlIHByb3ZpZGUgYSBwYXNzd29yZCcpKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2hlY2tQcm9wZXJ0eU1haWwgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pOiB2b2lkID0+IHtcclxuICAgIHJlcS5ib2R5Lmhhc093blByb3BlcnR5KCdtYWlsJykgfHwgcmVxLnBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnbWFpbCcpID8gbmV4dCgpIDogbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMCwgJ1BsZWFzZSBwcm92aWRlIGEgbWFpbCBhZGRyZXNzJykpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja1Byb3BlcnR5TmFtZSA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbik6IHZvaWQgPT4ge1xyXG4gICAgcmVxLmJvZHkuaGFzT3duUHJvcGVydHkoJ2Rpc3BsYXlOYW1lJykgfHwgcmVxLnBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnZGlzcGxheW5hbWUnKSA/IG5leHQoKSA6IG5leHQobmV3IEVycm9ySGFuZGxlcig0MDAsICdQbGVhc2UgcHJvdmlkZSBhIGRpc3BsYXkgbmFtZScpKVxyXG59XHJcblxyXG4vL01vZGVsT3BlcmF0aW9uc1xyXG5leHBvcnQgY29uc3QgYXV0aGVudGljYXRlVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgbGV0IHVzZXJuYW1lID0gcmVxLmJvZHkudXNlcm5hbWUgfHwgcmVxLnBhcmFtcy51c2VybmFtZSB8fCByZXMubG9jYWxzLnVzZXIudXNlcm5hbWVcclxuICAgIGxldCBwYXNzd29yZCA9IHJlcS5ib2R5LnBhc3N3b3JkIHx8IHJlcS5wYXJhbXMucGFzc3dvcmQgfHwgcmVzLmxvY2Fscy51c2VyLnBhc3N3b3JkXHJcblxyXG4gICAgaWYgKHVzZXJuYW1lID09PSB1bmRlZmluZWQpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAwLCAnUGxlYXNlIHByb3ZpZGUgYSB1c2VybmFtZScpKVxyXG4gICAgaWYgKHBhc3N3b3JkID09PSB1bmRlZmluZWQpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAwLCAnUGxlYXNlIHByb3ZpZGUgYSBwYXNzd29yZCcpKVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IHVzZXIuZ2V0QXV0aGVudGljYXRlZChcclxuICAgICAgICAgICAgdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkXHJcbiAgICAgICAgKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMSwgYEVycm9yIGF1dGhlbnRpY2F0aW5nIHVzZXI6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXdhaXQgand0LnNpZ24ocmVzdWx0LnRvSlNPTigpLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVULCB7XHJcbiAgICAgICAgICAgIGV4cGlyZXNJbjogcHJvY2Vzcy5lbnYuSldUX0VYUElSRVMsXHJcbiAgICAgICAgfSlcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDEsIGBFcnJvciB0b2tlbiBzaWduaW5nOiAke2Vycm9yLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmxvY2Fscy51c2VyID0gcmVzdWx0XHJcbiAgICByZXMubG9jYWxzLnRva2VuID0gdG9rZW5cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFkZFVzZXIgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIG5ld1VzZXIgPSBuZXcgdXNlcih7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS51c2VybmFtZSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxyXG4gICAgICAgICAgICBtYWlsOiByZXEuYm9keS5tYWlsLFxyXG4gICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6ICdlbicsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogcmVxLmJvZHkuZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgYXdhaXQgbmV3VXNlci5zYXZlKClcclxuXHJcbiAgICAgICAgcmVzLmxvY2Fscy51c2VyID0gbmV3VXNlclxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGNyZWF0aW5nIHVzZXI6ICR7ZXJyb3IubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZVVzZXIgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZGVsZXRlIHJlcS5ib2R5LmxvY2tVbnRpbCwgcmVxLmJvZHkubG9naW5BdHRlbXB0cywgcmVxLmJvZHkuYWRtaW5cclxuICAgICAgICBsZXQgdXBkYXRlZFVzZXIgPSBhd2FpdCB1c2VyLmZpbmRPbmVBbmRVcGRhdGUoeyB1c2VybmFtZTogcmVxLmJvZHkudXNlcm5hbWUgfHwgcmVxLnBhcmFtcy51c2VybmFtZSB9LCByZXEuYm9keSwgeyBuZXc6IHRydWUgfSlcclxuICAgICAgICByZXMubG9jYWxzLnVzZXIgPSB1cGRhdGVkVXNlclxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIHVwZGF0aW5nIHVzZXI6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBGaW5kT3BlcmF0aW9uc1xyXG5leHBvcnQgY29uc3QgZmluZFVzZXIgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHRoaXNVc2VyID0gYXdhaXQgdXNlci5maW5kT25lKHsgdXNlcm5hbWU6IHJlcS5ib2R5LnVzZXJuYW1lIHx8IHJlcS5wYXJhbXMudXNlcm5hbWUgfSkuc2VsZWN0KCd1c2VybmFtZSBhdmF0YXIgc2V0dGluZ3MgbG9naW5BdHRlbXB0cyBtYWlsIGxvY2tVbnRpbCBpc0xvY2tlZCcpXHJcbiAgICAgICAgcmVzLmxvY2Fscy51c2VyID0gdGhpc1VzZXJcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDEsICdVc2VyIG5vdCBmb3VuZCcpKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgYWxsVXNlciA9IGF3YWl0IHVzZXIuZmluZCh7fSkuc2VsZWN0KCd1c2VybmFtZSBhdmF0YXIgc2V0dGluZ3MgbG9naW5BdHRlbXB0cyBtYWlsIGxvY2tVbnRpbCBpc0xvY2tlZCcpXHJcbiAgICAgICAgcmVzLmxvY2Fscy51c2VyID0gYWxsVXNlclxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGZpbmRpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vIE1vZGVsIEFkbWluIEZ1bmN0aW9uc1xyXG5leHBvcnQgY29uc3QgZGVsZXRlVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgZGVsZXRlZFVzZXIgPSBhd2FpdCB1c2VyLmZpbmRPbmVBbmREZWxldGUoeyB1c2VybmFtZTogcmVxLmJvZHkudXNlcm5hbWUgfHwgcmVxLnBhcmFtcy51c2VybmFtZSB9LCB7IHNlbGVjdDogJ3VzZXJuYW1lJyB9KVxyXG4gICAgICAgIHJlcy5sb2NhbHMudXNlciA9IGRlbGV0ZWRVc2VyXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZGVsZXRpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1bmxvY2tVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCB1bmxvY2tlZFVzZXIgPSBhd2FpdCB1c2VyLnVwZGF0ZU9uZSh7IHVzZXJuYW1lOiByZXEuYm9keS51c2VybmFtZSB8fCByZXEucGFyYW1zLnVzZXJuYW1lIH0sIHsgJHNldDogeyBsb2dpbkF0dGVtcHRzOiAwLCBsb2NrVW50aWw6IG51bGwgfSB9KS5zZWxlY3QoJ3VzZXJuYW1lIGF2YXRhciBzZXR0aW5ncyBsb2dpbkF0dGVtcHRzIG1haWwgbG9ja1VudGlsJylcclxuICAgICAgICByZXMubG9jYWxzLnVzZXIgPSB1bmxvY2tlZFVzZXJcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciB1bmxvY2tpbmcgdXNlcjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcbn0iXX0=