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
            res.locals.user.isAdmin ? next() : next(new ErrorHandler(401, 'You have to be an administrator to do this.'));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _requireAdmin.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVycy9hdXRoZW50aWNhdGUudHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIkVycm9ySGFuZGxlciIsImF1dGhlbnRpY2F0ZSIsInJlcSIsInJlcyIsIm5leHQiLCJ0b2tlbiIsInF1ZXJ5IiwiaGVhZGVycyIsImF1dGhvcml6YXRpb24iLCJzcGxpdCIsInVuZGVmaW5lZCIsImp3dCIsInZlcmlmeSIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwicmVzdWx0IiwibG9jYWxzIiwiYXV0aF91c2VyIiwibWVzc2FnZSIsInJlcXVpcmVBZG1pbiIsInVzZXIiLCJpc0FkbWluIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBSUE7O0FBSkE7QUFHQTtlQUV1QkEsT0FBTyxDQUFDLFNBQUQsQztJQUF4QkMsWSxZQUFBQSxZOztTQUV3QkMsWTs7Ozs7Z0dBQWYsaUJBQTRCQyxHQUE1QixFQUFzQ0MsR0FBdEMsRUFBcURDLElBQXJEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0hDLFlBQUFBLEtBSEcsR0FHS0gsR0FBRyxDQUFDSSxLQUFKLENBQVVELEtBQVYsSUFBbUJILEdBQUcsQ0FBQ0ssT0FBSixDQUFZQyxhQUFaLENBQTJCQyxLQUEzQixDQUFpQyxHQUFqQyxFQUFzQyxDQUF0QyxDQUFuQixJQUErREMsU0FIcEU7O0FBQUEsa0JBS0hMLEtBQUssS0FBS0ssU0FBVixJQUF1QkwsS0FBSyxLQUFLLElBTDlCO0FBQUE7QUFBQTtBQUFBOztBQUFBLDZDQU1JRCxJQUFJLENBQUMsSUFBSUosWUFBSixDQUFpQixHQUFqQixFQUFzQix3REFBdEIsQ0FBRCxDQU5SOztBQUFBO0FBQUE7QUFBQSxtQkFTWVcsR0FBRyxDQUFDQyxNQUFKLENBQVdQLEtBQVgsRUFBa0JRLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxVQUE5QixDQVRaOztBQUFBO0FBU0hDLFlBQUFBLE1BVEc7QUFXUGIsWUFBQUEsR0FBRyxDQUFDYyxNQUFKLENBQVdDLFNBQVgsR0FBdUJGLE1BQXZCO0FBRUFaLFlBQUFBLElBQUk7QUFiRztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQWVBQSxJQUFJLENBQUMsSUFBSUosWUFBSixDQUFpQixHQUFqQix1Q0FBb0QsWUFBaUJtQixPQUFyRSxFQUFELENBZko7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztTQW1CT0MsWTs7Ozs7Z0dBQWYsa0JBQTRCbEIsR0FBNUIsRUFBMENDLEdBQTFDLEVBQXlEQyxJQUF6RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0hELFlBQUFBLEdBQUcsQ0FBQ2MsTUFBSixDQUFXSSxJQUFYLENBQWdCQyxPQUFoQixHQUEwQmxCLElBQUksRUFBOUIsR0FBbUNBLElBQUksQ0FBQyxJQUFJSixZQUFKLENBQWlCLEdBQWpCLEVBQXNCLDZDQUF0QixDQUFELENBQXZDOztBQURHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUWVBFU1xyXG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XHJcblxyXG4vL0RFUFNcclxuaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcclxudmFyIHsgRXJyb3JIYW5kbGVyIH0gPSByZXF1aXJlKCcuL2Vycm9yJylcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dGhlbnRpY2F0ZShyZXE6IGFueSwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgICBsZXQgdG9rZW4gPSByZXEucXVlcnkudG9rZW4gfHwgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiEuc3BsaXQoJyAnKVsxXSB8fCB1bmRlZmluZWRcclxuXHJcbiAgICAgICAgaWYgKHRva2VuID09PSB1bmRlZmluZWQgfHwgdG9rZW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDIsICdBUEkgVG9rZW4gbXVzdCBlaXRoZXIgYmUgc2V0IGFzIGhlYWRlciBvciBxdWVyeSBzdHJpbmcnKSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBqd3QudmVyaWZ5KHRva2VuLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVUKVxyXG5cclxuICAgICAgICByZXMubG9jYWxzLmF1dGhfdXNlciA9IHJlc3VsdFxyXG5cclxuICAgICAgICBuZXh0KClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjaGVja2luZyBwZXJtaXNzaW9uOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVBZG1pbihyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gICAgcmVzLmxvY2Fscy51c2VyLmlzQWRtaW4gPyBuZXh0KCkgOiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAxLCAnWW91IGhhdmUgdG8gYmUgYW4gYWRtaW5pc3RyYXRvciB0byBkbyB0aGlzLicpKVxyXG59Il19