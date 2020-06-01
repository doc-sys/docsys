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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVycy9hdXRoZW50aWNhdGUudHMiXSwibmFtZXMiOlsicmVxdWlyZSIsIkVycm9ySGFuZGxlciIsImF1dGhlbnRpY2F0ZSIsInJlcSIsInJlcyIsIm5leHQiLCJ0b2tlbiIsInF1ZXJ5IiwiaGVhZGVycyIsImF1dGhvcml6YXRpb24iLCJzcGxpdCIsInVuZGVmaW5lZCIsImp3dCIsInZlcmlmeSIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwicmVzdWx0IiwidXNlciIsImZpbmRPbmUiLCJ1c2VybmFtZSIsImZ1bGxVc2VyIiwibG9jYWxzIiwiYXV0aF91c2VyIiwibWVzc2FnZSIsInJlcXVpcmVBZG1pbiIsImlzQWRtaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQTs7QUFFQTs7QUFOQTtBQUdBO2VBRXVCQSxPQUFPLENBQUMsU0FBRCxDO0lBQXhCQyxZLFlBQUFBLFk7O1NBR3dCQyxZOzs7OztnR0FBZixpQkFBNEJDLEdBQTVCLEVBQXNDQyxHQUF0QyxFQUFxREMsSUFBckQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHSEMsWUFBQUEsS0FIRyxHQUdLSCxHQUFHLENBQUNJLEtBQUosQ0FBVUQsS0FBVixJQUFtQkgsR0FBRyxDQUFDSyxPQUFKLENBQVlDLGFBQVosQ0FBMkJDLEtBQTNCLENBQWlDLEdBQWpDLEVBQXNDLENBQXRDLENBQW5CLElBQStEQyxTQUhwRTs7QUFBQSxrQkFLSEwsS0FBSyxLQUFLSyxTQUFWLElBQXVCTCxLQUFLLEtBQUssSUFMOUI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsNkNBTUlELElBQUksQ0FBQyxJQUFJSixZQUFKLENBQWlCLEdBQWpCLEVBQXNCLHdEQUF0QixDQUFELENBTlI7O0FBQUE7QUFBQTtBQUFBLG1CQVNZVyxHQUFHLENBQUNDLE1BQUosQ0FBV1AsS0FBWCxFQUFrQlEsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFVBQTlCLENBVFo7O0FBQUE7QUFTSEMsWUFBQUEsTUFURztBQUFBO0FBQUEsbUJBV2NDLFdBQUtDLE9BQUwsQ0FBYTtBQUFFQyxjQUFBQSxRQUFRLEVBQUVILE1BQU0sQ0FBQ0c7QUFBbkIsYUFBYixDQVhkOztBQUFBO0FBV0hDLFlBQUFBLFFBWEc7QUFhUGpCLFlBQUFBLEdBQUcsQ0FBQ2tCLE1BQUosQ0FBV0MsU0FBWCxHQUF1QkYsUUFBdkI7QUFDQWhCLFlBQUFBLElBQUk7QUFkRztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQWdCQUEsSUFBSSxDQUFDLElBQUlKLFlBQUosQ0FBaUIsR0FBakIsdUNBQW9ELFlBQWlCdUIsT0FBckUsRUFBRCxDQWhCSjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O1NBb0JPQyxZOzs7OztnR0FBZixrQkFBNEJ0QixHQUE1QixFQUEwQ0MsR0FBMUMsRUFBeURDLElBQXpEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDSEQsWUFBQUEsR0FBRyxDQUFDa0IsTUFBSixDQUFXQyxTQUFYLENBQXFCRyxPQUFyQixHQUErQnJCLElBQUksRUFBbkMsR0FBd0NBLElBQUksQ0FBQyxJQUFJSixZQUFKLENBQWlCLEdBQWpCLEVBQXNCLDZDQUF0QixDQUFELENBQTVDOztBQURHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUWVBFU1xyXG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XHJcblxyXG4vL0RFUFNcclxuaW1wb3J0ICogYXMgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcclxudmFyIHsgRXJyb3JIYW5kbGVyIH0gPSByZXF1aXJlKCcuL2Vycm9yJylcclxuaW1wb3J0IHsgdXNlciB9IGZyb20gJy4uLy4uLy9tb2RlbHMvdXNlcidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dGhlbnRpY2F0ZShyZXE6IGFueSwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgICBsZXQgdG9rZW4gPSByZXEucXVlcnkudG9rZW4gfHwgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiEuc3BsaXQoJyAnKVsxXSB8fCB1bmRlZmluZWRcclxuXHJcbiAgICAgICAgaWYgKHRva2VuID09PSB1bmRlZmluZWQgfHwgdG9rZW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDIsICdBUEkgVG9rZW4gbXVzdCBlaXRoZXIgYmUgc2V0IGFzIGhlYWRlciBvciBxdWVyeSBzdHJpbmcnKSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBqd3QudmVyaWZ5KHRva2VuLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVUKVxyXG5cclxuICAgICAgICBsZXQgZnVsbFVzZXIgPSBhd2FpdCB1c2VyLmZpbmRPbmUoeyB1c2VybmFtZTogcmVzdWx0LnVzZXJuYW1lIH0pXHJcblxyXG4gICAgICAgIHJlcy5sb2NhbHMuYXV0aF91c2VyID0gZnVsbFVzZXJcclxuICAgICAgICBuZXh0KClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjaGVja2luZyBwZXJtaXNzaW9uOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVBZG1pbihyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gICAgcmVzLmxvY2Fscy5hdXRoX3VzZXIuaXNBZG1pbiA/IG5leHQoKSA6IG5leHQobmV3IEVycm9ySGFuZGxlcig0MDEsICdZb3UgaGF2ZSB0byBiZSBhbiBhZG1pbmlzdHJhdG9yIHRvIGRvIHRoaXMuJykpXHJcbn0iXX0=