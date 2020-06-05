"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRedisHealth = exports.checkStorageHealth = exports.checkMongoDBHealth = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _error = require("../lib/helpers/error");

var mongoose = _interopRequireWildcard(require("mongoose"));

var redisStatus = _interopRequireWildcard(require("redis-status"));

var checkMongoDBHealth = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            res.locals.health.mongoose = mongoose.STATES[mongoose.connection.readyState];
            _context.next = 7;
            break;

          case 4:
            _context.prev = 4;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", next(new _error.ErrorHandler(500, "Error checking MongoDB health: ".concat(_context.t0.message))));

          case 7:
            next();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 4]]);
  }));

  return function checkMongoDBHealth(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.checkMongoDBHealth = checkMongoDBHealth;

var checkStorageHealth = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function checkStorageHealth(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.checkStorageHealth = checkStorageHealth;

var checkRedisHealth = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var redisURI, redis;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            redisURI = new URL(process.env.REDIS_URI) || {};
            redis = redisStatus({
              name: redisURI.pathname,
              port: redisURI.port,
              host: redisURI.hostname,
              password: redisURI.password
            });
            redis.checkStatus(function (err) {
              err ? res.locals.healt.redis = err : res.locals.health.redis = 'healthy';
            });
            _context3.next = 9;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", next(new _error.ErrorHandler(500, "Error checking Redis health: ".concat(_context3.t0.message))));

          case 9:
            next();

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 6]]);
  }));

  return function checkRedisHealth(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.checkRedisHealth = checkRedisHealth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2luZGV4LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsiY2hlY2tNb25nb0RCSGVhbHRoIiwicmVxIiwicmVzIiwibmV4dCIsImxvY2FscyIsImhlYWx0aCIsIm1vbmdvb3NlIiwiU1RBVEVTIiwiY29ubmVjdGlvbiIsInJlYWR5U3RhdGUiLCJFcnJvckhhbmRsZXIiLCJtZXNzYWdlIiwiY2hlY2tTdG9yYWdlSGVhbHRoIiwiY2hlY2tSZWRpc0hlYWx0aCIsInJlZGlzVVJJIiwiVVJMIiwicHJvY2VzcyIsImVudiIsIlJFRElTX1VSSSIsInJlZGlzIiwicmVkaXNTdGF0dXMiLCJuYW1lIiwicGF0aG5hbWUiLCJwb3J0IiwiaG9zdCIsImhvc3RuYW1lIiwicGFzc3dvcmQiLCJjaGVja1N0YXR1cyIsImVyciIsImhlYWx0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFFQTs7QUFDQTs7QUFFTyxJQUFNQSxrQkFBa0I7QUFBQSwyRkFBRyxpQkFBT0MsR0FBUCxFQUFxQkMsR0FBckIsRUFBb0NDLElBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUUxQkQsWUFBQUEsR0FBRyxDQUFDRSxNQUFKLENBQVdDLE1BQVgsQ0FBa0JDLFFBQWxCLEdBQTZCQSxRQUFRLENBQUNDLE1BQVQsQ0FBZ0JELFFBQVEsQ0FBQ0UsVUFBVCxDQUFvQkMsVUFBcEMsQ0FBN0I7QUFGMEI7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQSw2Q0FJbkJOLElBQUksQ0FBQyxJQUFJTyxtQkFBSixDQUFpQixHQUFqQiwyQ0FBd0QsWUFBaUJDLE9BQXpFLEVBQUQsQ0FKZTs7QUFBQTtBQU85QlIsWUFBQUEsSUFBSTs7QUFQMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBbEJILGtCQUFrQjtBQUFBO0FBQUE7QUFBQSxHQUF4Qjs7OztBQVVBLElBQU1ZLGtCQUFrQjtBQUFBLDRGQUFHLGtCQUFPWCxHQUFQLEVBQXFCQyxHQUFyQixFQUFvQ0MsSUFBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFsQlMsa0JBQWtCO0FBQUE7QUFBQTtBQUFBLEdBQXhCOzs7O0FBSUEsSUFBTUMsZ0JBQWdCO0FBQUEsNEZBQUcsa0JBQU9aLEdBQVAsRUFBcUJDLEdBQXJCLEVBQW9DQyxJQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVwQlcsWUFBQUEsUUFGb0IsR0FFVCxJQUFJQyxHQUFKLENBQVFDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxTQUFwQixLQUE0QyxFQUZuQztBQUdwQkMsWUFBQUEsS0FIb0IsR0FHWkMsV0FBVyxDQUFDO0FBQ3BCQyxjQUFBQSxJQUFJLEVBQUVQLFFBQVEsQ0FBQ1EsUUFESztBQUVwQkMsY0FBQUEsSUFBSSxFQUFFVCxRQUFRLENBQUNTLElBRks7QUFHcEJDLGNBQUFBLElBQUksRUFBRVYsUUFBUSxDQUFDVyxRQUhLO0FBSXBCQyxjQUFBQSxRQUFRLEVBQUVaLFFBQVEsQ0FBQ1k7QUFKQyxhQUFELENBSEM7QUFVeEJQLFlBQUFBLEtBQUssQ0FBQ1EsV0FBTixDQUFrQixVQUFDQyxHQUFELEVBQVM7QUFDdkJBLGNBQUFBLEdBQUcsR0FBRzFCLEdBQUcsQ0FBQ0UsTUFBSixDQUFXeUIsS0FBWCxDQUFpQlYsS0FBakIsR0FBeUJTLEdBQTVCLEdBQWtDMUIsR0FBRyxDQUFDRSxNQUFKLENBQVdDLE1BQVgsQ0FBa0JjLEtBQWxCLEdBQTBCLFNBQS9EO0FBQ0gsYUFGRDtBQVZ3QjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQWNqQmhCLElBQUksQ0FBQyxJQUFJTyxtQkFBSixDQUFpQixHQUFqQix5Q0FBc0QsYUFBaUJDLE9BQXZFLEVBQUQsQ0FkYTs7QUFBQTtBQWlCNUJSLFlBQUFBLElBQUk7O0FBakJ3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFoQlUsZ0JBQWdCO0FBQUE7QUFBQTtBQUFBLEdBQXRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MsIHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gXCJleHByZXNzXCJcbmltcG9ydCB7IEVycm9ySGFuZGxlciB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2Vycm9yJ1xuXG5pbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tICdtb25nb29zZSdcbmltcG9ydCAqIGFzIHJlZGlzU3RhdHVzIGZyb20gJ3JlZGlzLXN0YXR1cydcblxuZXhwb3J0IGNvbnN0IGNoZWNrTW9uZ29EQkhlYWx0aCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJlcy5sb2NhbHMuaGVhbHRoLm1vbmdvb3NlID0gbW9uZ29vc2UuU1RBVEVTW21vbmdvb3NlLmNvbm5lY3Rpb24ucmVhZHlTdGF0ZV1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGNoZWNraW5nIE1vbmdvREIgaGVhbHRoOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGNoZWNrU3RvcmFnZUhlYWx0aCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIC8vbm8gaWRlYSBob3cgdG8gaW1wbGVtZW50IHRoaXNcbn1cblxuZXhwb3J0IGNvbnN0IGNoZWNrUmVkaXNIZWFsdGggPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBsZXQgcmVkaXNVUkkgPSBuZXcgVVJMKHByb2Nlc3MuZW52LlJFRElTX1VSSSBhcyBzdHJpbmcpIHx8IHt9XG4gICAgICAgIGxldCByZWRpcyA9IHJlZGlzU3RhdHVzKHtcbiAgICAgICAgICAgIG5hbWU6IHJlZGlzVVJJLnBhdGhuYW1lLFxuICAgICAgICAgICAgcG9ydDogcmVkaXNVUkkucG9ydCxcbiAgICAgICAgICAgIGhvc3Q6IHJlZGlzVVJJLmhvc3RuYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHJlZGlzVVJJLnBhc3N3b3JkXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVkaXMuY2hlY2tTdGF0dXMoKGVycikgPT4ge1xuICAgICAgICAgICAgZXJyID8gcmVzLmxvY2Fscy5oZWFsdC5yZWRpcyA9IGVyciA6IHJlcy5sb2NhbHMuaGVhbHRoLnJlZGlzID0gJ2hlYWx0aHknXG4gICAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjaGVja2luZyBSZWRpcyBoZWFsdGg6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufSJdfQ==