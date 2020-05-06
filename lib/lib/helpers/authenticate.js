"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = authenticate;
exports.requireAdmin = requireAdmin;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var jwt = _interopRequireWildcard(require("jsonwebtoken"));

// TYPES
//DEPS
var _require = require('./error'),
    ErrorHandler = _require.ErrorHandler;

function authenticate(_x, _x2, _x3) {
  return _authenticate.apply(this, arguments);
}

function _authenticate() {
  _authenticate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var token, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            token = req.query.token || req.headers.authorization.split(' ')[1] || undefined;

            if (!(token === undefined || token === null)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", next(new ErrorHandler(402, 'API Token must either be set as header or query string')));

          case 4:
            _context.next = 6;
            return jwt.verify(token, process.env.JWT_SECRET);

          case 6:
            result = _context.sent;
            res.locals.auth_user = result;
            next();
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", next(new ErrorHandler(500, "Error checking permission: ".concat(_context.t0.message))));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));
  return _authenticate.apply(this, arguments);
}

function requireAdmin(_x4, _x5, _x6) {
  return _requireAdmin.apply(this, arguments);
}

function _requireAdmin() {
  _requireAdmin = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.locals.auth_user.isAdmin ? next() : next(new ErrorHandler(401, 'You have to be an administrator to do this.'));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _requireAdmin.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVycy9hdXRoZW50aWNhdGUudHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIkVycm9ySGFuZGxlciIsImF1dGhlbnRpY2F0ZSIsInJlcSIsInJlcyIsIm5leHQiLCJ0b2tlbiIsInF1ZXJ5IiwiaGVhZGVycyIsImF1dGhvcml6YXRpb24iLCJzcGxpdCIsInVuZGVmaW5lZCIsImp3dCIsInZlcmlmeSIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwicmVzdWx0IiwibG9jYWxzIiwiYXV0aF91c2VyIiwibWVzc2FnZSIsInJlcXVpcmVBZG1pbiIsImlzQWRtaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQTs7QUFKQTtBQUdBO2VBRXVCQSxPQUFPLENBQUMsU0FBRCxDO0lBQXhCQyxZLFlBQUFBLFk7O1NBRXdCQyxZOzs7OztnR0FBZixpQkFBNEJDLEdBQTVCLEVBQXNDQyxHQUF0QyxFQUFxREMsSUFBckQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHSEMsWUFBQUEsS0FIRyxHQUdLSCxHQUFHLENBQUNJLEtBQUosQ0FBVUQsS0FBVixJQUFtQkgsR0FBRyxDQUFDSyxPQUFKLENBQVlDLGFBQVosQ0FBMkJDLEtBQTNCLENBQWlDLEdBQWpDLEVBQXNDLENBQXRDLENBQW5CLElBQStEQyxTQUhwRTs7QUFBQSxrQkFLSEwsS0FBSyxLQUFLSyxTQUFWLElBQXVCTCxLQUFLLEtBQUssSUFMOUI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsNkNBTUlELElBQUksQ0FBQyxJQUFJSixZQUFKLENBQWlCLEdBQWpCLEVBQXNCLHdEQUF0QixDQUFELENBTlI7O0FBQUE7QUFBQTtBQUFBLG1CQVNZVyxHQUFHLENBQUNDLE1BQUosQ0FBV1AsS0FBWCxFQUFrQlEsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFVBQTlCLENBVFo7O0FBQUE7QUFTSEMsWUFBQUEsTUFURztBQVdQYixZQUFBQSxHQUFHLENBQUNjLE1BQUosQ0FBV0MsU0FBWCxHQUF1QkYsTUFBdkI7QUFFQVosWUFBQUEsSUFBSTtBQWJHO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUEsNkNBZUFBLElBQUksQ0FBQyxJQUFJSixZQUFKLENBQWlCLEdBQWpCLHVDQUFvRCxZQUFpQm1CLE9BQXJFLEVBQUQsQ0FmSjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O1NBbUJPQyxZOzs7OztnR0FBZixrQkFBNEJsQixHQUE1QixFQUEwQ0MsR0FBMUMsRUFBeURDLElBQXpEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDSEQsWUFBQUEsR0FBRyxDQUFDYyxNQUFKLENBQVdDLFNBQVgsQ0FBcUJHLE9BQXJCLEdBQStCakIsSUFBSSxFQUFuQyxHQUF3Q0EsSUFBSSxDQUFDLElBQUlKLFlBQUosQ0FBaUIsR0FBakIsRUFBc0IsNkNBQXRCLENBQUQsQ0FBNUM7O0FBREc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRZUEVTXHJcbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJztcclxuXHJcbi8vREVQU1xyXG5pbXBvcnQgKiBhcyBqd3QgZnJvbSAnanNvbndlYnRva2VuJ1xyXG52YXIgeyBFcnJvckhhbmRsZXIgfSA9IHJlcXVpcmUoJy4vZXJyb3InKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXV0aGVudGljYXRlKHJlcTogYW55LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICAgIGxldCB0b2tlbiA9IHJlcS5xdWVyeS50b2tlbiB8fCByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uIS5zcGxpdCgnICcpWzFdIHx8IHVuZGVmaW5lZFxyXG5cclxuICAgICAgICBpZiAodG9rZW4gPT09IHVuZGVmaW5lZCB8fCB0b2tlbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMiwgJ0FQSSBUb2tlbiBtdXN0IGVpdGhlciBiZSBzZXQgYXMgaGVhZGVyIG9yIHF1ZXJ5IHN0cmluZycpKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGp3dC52ZXJpZnkodG9rZW4sIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQpXHJcblxyXG4gICAgICAgIHJlcy5sb2NhbHMuYXV0aF91c2VyID0gcmVzdWx0XHJcblxyXG4gICAgICAgIG5leHQoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGNoZWNraW5nIHBlcm1pc3Npb246ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZUFkbWluKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICByZXMubG9jYWxzLmF1dGhfdXNlci5pc0FkbWluID8gbmV4dCgpIDogbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMSwgJ1lvdSBoYXZlIHRvIGJlIGFuIGFkbWluaXN0cmF0b3IgdG8gZG8gdGhpcy4nKSlcclxufSJdfQ==