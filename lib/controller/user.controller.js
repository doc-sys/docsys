"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addUser = exports.findUser = exports.authenticateUser = exports.checkPropertyName = exports.checkPropertyMail = exports.checkPropertyPassword = exports.checkPropertyUsername = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _error = require("../lib/helpers/error");

var _user = require("../models/user");

var jwt = _interopRequireWildcard(require("jsonwebtoken"));

//CheckPropertyHandler
var checkPropertyUsername = function checkPropertyUsername(req, res, next) {
  req.body.hasOwnProperty('username') ? next() : next(new _error.ErrorHandler(400, 'Please provide a username'));
};

exports.checkPropertyUsername = checkPropertyUsername;

var checkPropertyPassword = function checkPropertyPassword(req, res, next) {
  req.body.hasOwnProperty('password') ? next() : next(new _error.ErrorHandler(400, 'Please provide a password'));
};

exports.checkPropertyPassword = checkPropertyPassword;

var checkPropertyMail = function checkPropertyMail(req, res, next) {
  req.body.hasOwnProperty('mail') ? next() : next(new _error.ErrorHandler(400, 'Please provide a mail address'));
};

exports.checkPropertyMail = checkPropertyMail;

var checkPropertyName = function checkPropertyName(req, res, next) {
  req.body.hasOwnProperty('displayName') ? next() : next(new _error.ErrorHandler(400, 'Please provide a display name'));
}; //ModelOperations


exports.checkPropertyName = checkPropertyName;

var authenticateUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var username, password, result, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            username = req.body.username || res.locals.user.username;
            password = req.body.password || res.locals.user.password;
            username === undefined && next(new _error.ErrorHandler(400, 'Please provide a username'));
            password === undefined && next(new _error.ErrorHandler(400, 'Please provide a password'));
            _context.prev = 4;
            _context.next = 7;
            return _user.user.getAuthenticated(username, password);

          case 7:
            result = _context.sent;
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](4);
            next(_context.t0);

          case 13:
            _context.prev = 13;
            _context.next = 16;
            return jwt.sign(result.toJSON(), process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES
            });

          case 16:
            token = _context.sent;
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t1 = _context["catch"](13);
            next(new _error.ErrorHandler(501, "Error token signing: ".concat(_context.t1.message)));

          case 22:
            res.locals.user = result;
            res.locals.token = token;
            next();

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 10], [13, 19]]);
  }));

  return function authenticateUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.authenticateUser = authenticateUser;

var findUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var thisUser;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _user.user.findOne({
              username: req.body.username
            });

          case 3:
            thisUser = _context2.sent;
            res.locals.user = thisUser;
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            next(new _error.ErrorHandler(401, 'User not found'));

          case 10:
            next();

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function findUser(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.findUser = findUser;

var addUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var newUser;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            newUser = new _user.user({
              username: req.body.username,
              password: req.body.password,
              mail: req.body.mail,
              settings: {
                language: 'en',
                displayName: req.body.displayName
              }
            });
            _context3.next = 4;
            return newUser.save();

          case 4:
            res.locals.user = newUser;
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            next(new _error.ErrorHandler(500, "Error creating user: ".concat(_context3.t0.message)));

          case 10:
            next();

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function addUser(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.addUser = addUser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL3VzZXIuY29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJjaGVja1Byb3BlcnR5VXNlcm5hbWUiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm9keSIsImhhc093blByb3BlcnR5IiwiRXJyb3JIYW5kbGVyIiwiY2hlY2tQcm9wZXJ0eVBhc3N3b3JkIiwiY2hlY2tQcm9wZXJ0eU1haWwiLCJjaGVja1Byb3BlcnR5TmFtZSIsImF1dGhlbnRpY2F0ZVVzZXIiLCJ1c2VybmFtZSIsImxvY2FscyIsInVzZXIiLCJwYXNzd29yZCIsInVuZGVmaW5lZCIsImdldEF1dGhlbnRpY2F0ZWQiLCJyZXN1bHQiLCJqd3QiLCJzaWduIiwidG9KU09OIiwicHJvY2VzcyIsImVudiIsIkpXVF9TRUNSRVQiLCJleHBpcmVzSW4iLCJKV1RfRVhQSVJFUyIsInRva2VuIiwibWVzc2FnZSIsImZpbmRVc2VyIiwiZmluZE9uZSIsInRoaXNVc2VyIiwiYWRkVXNlciIsIm5ld1VzZXIiLCJtYWlsIiwic2V0dGluZ3MiLCJsYW5ndWFnZSIsImRpc3BsYXlOYW1lIiwic2F2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7QUFDTyxJQUFNQSxxQkFBcUIsR0FBRyxTQUF4QkEscUJBQXdCLENBQUNDLEdBQUQsRUFBZUMsR0FBZixFQUE4QkMsSUFBOUIsRUFBMkQ7QUFDNUZGLEVBQUFBLEdBQUcsQ0FBQ0csSUFBSixDQUFTQyxjQUFULENBQXdCLFVBQXhCLElBQXNDRixJQUFJLEVBQTFDLEdBQStDQSxJQUFJLENBQUMsSUFBSUcsbUJBQUosQ0FBaUIsR0FBakIsRUFBc0IsMkJBQXRCLENBQUQsQ0FBbkQ7QUFDSCxDQUZNOzs7O0FBSUEsSUFBTUMscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QixDQUFDTixHQUFELEVBQWVDLEdBQWYsRUFBOEJDLElBQTlCLEVBQTJEO0FBQzVGRixFQUFBQSxHQUFHLENBQUNHLElBQUos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QUFrQm1CLE9BQWxCO0FBZGU7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFnQmY3QixZQUFBQSxJQUFJLENBQUMsSUFBSUcsbUJBQUosQ0FBaUIsR0FBakIsaUNBQThDLGFBQU1xQixPQUFwRCxFQUFELENBQUo7O0FBaEJlO0FBbUJuQnhCLFlBQUFBLElBQUk7O0FBbkJlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUg7O0FBQUEsa0JBQVA0QixPQUFPO0FBQUE7QUFBQTtBQUFBLEdBQWIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvZXJyb3InXHJcbmltcG9ydCB7IHVzZXIgfSBmcm9tICcuLi9tb2RlbHMvdXNlcidcclxuaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcclxuXHJcbi8vQ2hlY2tQcm9wZXJ0eUhhbmRsZXJcclxuZXhwb3J0IGNvbnN0IGNoZWNrUHJvcGVydHlVc2VybmFtZSA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbik6IHZvaWQgPT4ge1xyXG4gICAgcmVxLmJvZHkuaGFzT3duUHJvcGVydHkoJ3VzZXJuYW1lJykgPyBuZXh0KCkgOiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAwLCAnUGxlYXNlIHByb3ZpZGUgYSB1c2VybmFtZScpKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2hlY2tQcm9wZXJ0eVBhc3N3b3JkID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKTogdm9pZCA9PiB7XHJcbiAgICByZXEuYm9keS5oYXNPd25Qcm9wZXJ0eSgncGFzc3dvcmQnKSA/IG5leHQoKSA6IG5leHQobmV3IEVycm9ySGFuZGxlcig0MDAsICdQbGVhc2UgcHJvdmlkZSBhIHBhc3N3b3JkJykpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja1Byb3BlcnR5TWFpbCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbik6IHZvaWQgPT4ge1xyXG4gICAgcmVxLmJvZHkuaGFzT3duUHJvcGVydHkoJ21haWwnKSA/IG5leHQoKSA6IG5leHQobmV3IEVycm9ySGFuZGxlcig0MDAsICdQbGVhc2UgcHJvdmlkZSBhIG1haWwgYWRkcmVzcycpKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2hlY2tQcm9wZXJ0eU5hbWUgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pOiB2b2lkID0+IHtcclxuICAgIHJlcS5ib2R5Lmhhc093blByb3BlcnR5KCdkaXNwbGF5TmFtZScpID8gbmV4dCgpIDogbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMCwgJ1BsZWFzZSBwcm92aWRlIGEgZGlzcGxheSBuYW1lJykpXHJcbn1cclxuXHJcbi8vTW9kZWxPcGVyYXRpb25zXHJcbmV4cG9ydCBjb25zdCBhdXRoZW50aWNhdGVVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBsZXQgdXNlcm5hbWUgPSByZXEuYm9keS51c2VybmFtZSB8fCByZXMubG9jYWxzLnVzZXIudXNlcm5hbWVcclxuICAgIGxldCBwYXNzd29yZCA9IHJlcS5ib2R5LnBhc3N3b3JkIHx8IHJlcy5sb2NhbHMudXNlci5wYXNzd29yZFxyXG5cclxuICAgIHVzZXJuYW1lID09PSB1bmRlZmluZWQgJiYgbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMCwgJ1BsZWFzZSBwcm92aWRlIGEgdXNlcm5hbWUnKSlcclxuICAgIHBhc3N3b3JkID09PSB1bmRlZmluZWQgJiYgbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMCwgJ1BsZWFzZSBwcm92aWRlIGEgcGFzc3dvcmQnKSlcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCB1c2VyLmdldEF1dGhlbnRpY2F0ZWQoXHJcbiAgICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgICBwYXNzd29yZFxyXG4gICAgICAgIClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcilcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHZhciB0b2tlbiA9IGF3YWl0IGp3dC5zaWduKHJlc3VsdC50b0pTT04oKSwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCwge1xyXG4gICAgICAgICAgICBleHBpcmVzSW46IHByb2Nlc3MuZW52LkpXVF9FWFBJUkVTLFxyXG4gICAgICAgIH0pXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDEsIGBFcnJvciB0b2tlbiBzaWduaW5nOiAke2Vycm9yLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmxvY2Fscy51c2VyID0gcmVzdWx0XHJcbiAgICByZXMubG9jYWxzLnRva2VuID0gdG9rZW5cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGZpbmRVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCB0aGlzVXNlciA9IGF3YWl0IHVzZXIuZmluZE9uZSh7IHVzZXJuYW1lOiByZXEuYm9keS51c2VybmFtZSB9KVxyXG4gICAgICAgIHJlcy5sb2NhbHMudXNlciA9IHRoaXNVc2VyXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDEsICdVc2VyIG5vdCBmb3VuZCcpKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYWRkVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgbmV3VXNlciA9IG5ldyB1c2VyKHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5LnVzZXJuYW1lLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXHJcbiAgICAgICAgICAgIG1haWw6IHJlcS5ib2R5Lm1haWwsXHJcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICBsYW5ndWFnZTogJ2VuJyxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiByZXEuYm9keS5kaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBhd2FpdCBuZXdVc2VyLnNhdmUoKVxyXG5cclxuICAgICAgICByZXMubG9jYWxzLnVzZXIgPSBuZXdVc2VyXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjcmVhdGluZyB1c2VyOiAke2Vycm9yLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn0iXX0=