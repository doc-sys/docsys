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

var _user = require("../..//models/user");

// TYPES
//DEPS
var _require = require('./error'),
    ErrorHandler = _require.ErrorHandler;

function authenticate(_x, _x2, _x3) {
  return _authenticate.apply(this, arguments);
}

function _authenticate() {
  _authenticate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var token, result, fullUser;
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
            _context.next = 9;
            return _user.user.findOne({
              username: result.username
            });

          case 9:
            fullUser = _context.sent;
            res.locals.auth_user = fullUser;
            next();
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", next(new ErrorHandler(500, "Error checking permission: ".concat(_context.t0.message))));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 14]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVycy9hdXRoZW50aWNhdGUudHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIkVycm9ySGFuZGxlciIsImF1dGhlbnRpY2F0ZSIsInJlcSIsInJlcyIsIm5leHQiLCJ0b2tlbiIsInF1ZXJ5IiwiaGVhZGVycyIsImF1dGhvcml6YXRpb24iLCJzcGxpdCIsInVuZGVmaW5lZCIsImp3dCIsInZlcmlmeSIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwicmVzdWx0IiwidXNlciIsImZpbmRPbmUiLCJ1c2VybmFtZSIsImZ1bGxVc2VyIiwibG9jYWxzIiwiYXV0aF91c2VyIiwibWVzc2FnZSIsInJlcXVpcmVBZG1pbiIsImlzQWRtaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQTs7QUFFQTs7QUFOQTtBQUdBO2VBRXVCQSxPQUFPLENBQUMsU0FBRCxDO0lBQXhCQyxZLFlBQUFBLFk7O1NBR3dCQyxZOzs7OztnR0FBZixpQkFBNEJDLEdBQTVCLEVBQXNDQyxHQUF0QyxFQUFxREMsSUFBckQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHSEMsWUFBQUEsS0FIRyxHQUdLSCxHQUFHLENBQUNJLEtBQUosQ0FBVUQsS0FBVixJQUFtQkgsR0FBRyxDQUFDSyxPQUFKLENBQVlDLGFBQVosQ0FBMkJDLEtBQTNCLENBQWlDLEdBQWpDLEVBQXNDLENBQXRDLENBQW5CLElBQStEQyxTQUhwRTs7QUFBQSxrQkFLSEwsS0FBSyxLQUFLSyxTQUFWLElBQXVCTCxLQUFLLEtBQUssSUFMOUI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsNkNBTUlELElBQUksQ0FBQyxJQUFJSixZQUFKLENBQWlCLEdBQWpCLEVBQXNCLHdEQUF0QixDQUFELENBTlI7O0FBQUE7QUFBQTtBQUFBLG1CQVNZVyxHQUFHLENBQUNDLE1BQUosQ0FBV1AsS0FBWCxFQUFrQlEsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFVBQTlCLENBVFo7O0FBQUE7QUFTSEMsWUFBQUEsTUFURztBQUFBO0FBQUEsbUJBV2NDLFdBQUtDLE9BQUwsQ0FBYTtBQUFFQyxjQUFBQSxRQUFRLEVBQUVILE1BQU0sQ0FBQ0c7QUFBbkIsYUFBYixDQVhkOztBQUFBO0FBV0hDLFlBQUFBLFFBWEc7QUFhUGpCLFlBQUFBLEdBQUcsQ0FBQ2tCLE1BQUosQ0FBV0MsU0FBWCxHQUF1QkYsUUFBdkI7QUFDQWhCLFlBQUFBLElBQUk7QUFkRztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQWdCQUEsSUFBSSxDQUFDLElBQUlKLFlBQUosQ0FBaUIsR0FBakIsdUNBQW9ELFlBQWlCdUIsT0FBckUsRUFBRCxDQWhCSjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O1NBb0JPQyxZOzs7OztnR0FBZixrQkFBNEJ0QixHQUE1QixFQUEwQ0MsR0FBMUMsRUFBeURDLElBQXpEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDSEQsWUFBQUEsR0FBRyxDQUFDa0IsTUFBSixDQUFXQyxTQUFYLENBQXFCRyxPQUFyQixHQUErQnJCLElBQUksRUFBbkMsR0FBd0NBLElBQUksQ0FBQyxJQUFJSixZQUFKLENBQWlCLEdBQWpCLEVBQXNCLDZDQUF0QixDQUFELENBQTVDOztBQURHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUWVBFU1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnO1xuXG4vL0RFUFNcbmltcG9ydCAqIGFzIGp3dCBmcm9tICdqc29ud2VidG9rZW4nXG52YXIgeyBFcnJvckhhbmRsZXIgfSA9IHJlcXVpcmUoJy4vZXJyb3InKVxuaW1wb3J0IHsgdXNlciB9IGZyb20gJy4uLy4uLy9tb2RlbHMvdXNlcidcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXV0aGVudGljYXRlKHJlcTogYW55LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICB0cnkge1xuXG4gICAgICAgIGxldCB0b2tlbiA9IHJlcS5xdWVyeS50b2tlbiB8fCByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uIS5zcGxpdCgnICcpWzFdIHx8IHVuZGVmaW5lZFxuXG4gICAgICAgIGlmICh0b2tlbiA9PT0gdW5kZWZpbmVkIHx8IHRva2VuID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMiwgJ0FQSSBUb2tlbiBtdXN0IGVpdGhlciBiZSBzZXQgYXMgaGVhZGVyIG9yIHF1ZXJ5IHN0cmluZycpKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGp3dC52ZXJpZnkodG9rZW4sIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQpXG5cbiAgICAgICAgbGV0IGZ1bGxVc2VyID0gYXdhaXQgdXNlci5maW5kT25lKHsgdXNlcm5hbWU6IHJlc3VsdC51c2VybmFtZSB9KVxuXG4gICAgICAgIHJlcy5sb2NhbHMuYXV0aF91c2VyID0gZnVsbFVzZXJcbiAgICAgICAgbmV4dCgpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjaGVja2luZyBwZXJtaXNzaW9uOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlQWRtaW4ocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICByZXMubG9jYWxzLmF1dGhfdXNlci5pc0FkbWluID8gbmV4dCgpIDogbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMSwgJ1lvdSBoYXZlIHRvIGJlIGFuIGFkbWluaXN0cmF0b3IgdG8gZG8gdGhpcy4nKSlcbn0iXX0=