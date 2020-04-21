"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = authenticate;

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

            throw new ErrorHandler(402, 'API Token must either be set as header or query string');

          case 4:
            _context.next = 6;
            return jwt.verify(token, process.env.JWT_SECRET);

          case 6:
            result = _context.sent;
            req.user = result;
            next();
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));
  return _authenticate.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVycy9hdXRoZW50aWNhdGUudHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIkVycm9ySGFuZGxlciIsImF1dGhlbnRpY2F0ZSIsInJlcSIsInJlcyIsIm5leHQiLCJ0b2tlbiIsInF1ZXJ5IiwiaGVhZGVycyIsImF1dGhvcml6YXRpb24iLCJzcGxpdCIsInVuZGVmaW5lZCIsImp3dCIsInZlcmlmeSIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwicmVzdWx0IiwidXNlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBSUE7O0FBSkE7QUFHQTtlQUV1QkEsT0FBTyxDQUFDLFNBQUQsQztJQUF4QkMsWSxZQUFBQSxZOztTQUV3QkMsWTs7Ozs7Z0dBQWYsaUJBQTRCQyxHQUE1QixFQUFzQ0MsR0FBdEMsRUFBcURDLElBQXJEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0hDLFlBQUFBLEtBSEcsR0FHS0gsR0FBRyxDQUFDSSxLQUFKLENBQVVELEtBQVYsSUFBbUJILEdBQUcsQ0FBQ0ssT0FBSixDQUFZQyxhQUFaLENBQTJCQyxLQUEzQixDQUFpQyxHQUFqQyxFQUFzQyxDQUF0QyxDQUFuQixJQUErREMsU0FIcEU7O0FBQUEsa0JBS0hMLEtBQUssS0FBS0ssU0FBVixJQUF1QkwsS0FBSyxLQUFLLElBTDlCO0FBQUE7QUFBQTtBQUFBOztBQUFBLGtCQU1HLElBQUlMLFlBQUosQ0FBaUIsR0FBakIsRUFBc0Isd0RBQXRCLENBTkg7O0FBQUE7QUFBQTtBQUFBLG1CQVNZVyxHQUFHLENBQUNDLE1BQUosQ0FBV1AsS0FBWCxFQUFrQlEsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFVBQTlCLENBVFo7O0FBQUE7QUFTSEMsWUFBQUEsTUFURztBQVdQZCxZQUFBQSxHQUFHLENBQUNlLElBQUosR0FBV0QsTUFBWDtBQUVBWixZQUFBQSxJQUFJO0FBYkc7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFlUEEsWUFBQUEsSUFBSSxhQUFKOztBQWZPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUWVBFU1xyXG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XHJcblxyXG4vL0RFUFNcclxuaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcclxudmFyIHsgRXJyb3JIYW5kbGVyIH0gPSByZXF1aXJlKCcuL2Vycm9yJylcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dGhlbnRpY2F0ZShyZXE6IGFueSwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgICBsZXQgdG9rZW4gPSByZXEucXVlcnkudG9rZW4gfHwgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiEuc3BsaXQoJyAnKVsxXSB8fCB1bmRlZmluZWRcclxuXHJcbiAgICAgICAgaWYgKHRva2VuID09PSB1bmRlZmluZWQgfHwgdG9rZW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9ySGFuZGxlcig0MDIsICdBUEkgVG9rZW4gbXVzdCBlaXRoZXIgYmUgc2V0IGFzIGhlYWRlciBvciBxdWVyeSBzdHJpbmcnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGp3dC52ZXJpZnkodG9rZW4sIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQpXHJcblxyXG4gICAgICAgIHJlcS51c2VyID0gcmVzdWx0XHJcblxyXG4gICAgICAgIG5leHQoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKVxyXG4gICAgfVxyXG59Il19