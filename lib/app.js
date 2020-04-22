"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _error = require("./lib/helpers/error");

var express = require('express');

var path = require('path');

var logger = require('morgan'); // eslint-disable-next-line no-unused-vars


var compression = require('compression'); // eslint-disable-next-line no-unused-vars


var helmet = require('helmet');

var mongoose = require('mongoose');

var fs = require('fs');

var jwt = require('jsonwebtoken');

var cors = require('cors');

require('dotenv-defaults').config();

var indexRouter = require('./routes/index');

var usersRouter = require('./routes/user.route');

var docRouter = require('./routes/documents');

var settingsRouter = require('./routes/settings');

var helperRouter = require('./routes/helper');

var app = express();

try {
  mongoose.connect(process.env.NODE_ENV == 'test' ? process.env.DB_PATH_TEST : process.env.DB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

mongoose.set('useCreateIndex', true);
process.env.NODE_ENV === 'production' ? app.use(compression()).use(helmet()) : null; // logging setup (check if using test env)

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('[ :date[web] ] :method :url - :status in :response-time[3] ms', {
    skip: function skip(req, res) {
      return res.statusCode < 400;
    }
  }));
  app.use(logger('[ :date[web] ] :method :url - :remote-addr', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a'
    })
  }));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); // auth middleware

var authRequired = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var token, authHeader, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (req.query.token) {
              token = req.query.token;
            } else {
              authHeader = req.headers.authorization;
              token = authHeader.split(' ')[1];
            }

            _context.next = 4;
            return jwt.verify(token, process.env.JWT_SECRET);

          case 4:
            result = _context.sent;
            req.user = result;
            next();
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            res.status(500).json({
              payload: {
                message: 'Unauthorized access'
              }
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function authRequired(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

app.use('/user', usersRouter);
app.use('/document', authRequired, docRouter);
app.use('/setting', authRequired, settingsRouter);
app.use('/function', authRequired, helperRouter);
app.use('/', indexRouter); // error handler
// eslint-disable-next-line no-unused-vars

app.use(function (err, req, res, next) {
  (0, _error.handleError)(err, res);
});
app.use(function (req, res) {
  res.status(404).json({
    error: 'Route not found'
  });
});
module.exports = app;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJwYXRoIiwibG9nZ2VyIiwiY29tcHJlc3Npb24iLCJoZWxtZXQiLCJtb25nb29zZSIsImZzIiwiand0IiwiY29ycyIsImNvbmZpZyIsImluZGV4Um91dGVyIiwidXNlcnNSb3V0ZXIiLCJkb2NSb3V0ZXIiLCJzZXR0aW5nc1JvdXRlciIsImhlbHBlclJvdXRlciIsImFwcCIsImNvbm5lY3QiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJEQl9QQVRIX1RFU1QiLCJEQl9QQVRIIiwidXNlTmV3VXJsUGFyc2VyIiwidXNlVW5pZmllZFRvcG9sb2d5IiwiZXJyb3IiLCJjb25zb2xlIiwibWVzc2FnZSIsImV4aXQiLCJzZXQiLCJ1c2UiLCJza2lwIiwicmVxIiwicmVzIiwic3RhdHVzQ29kZSIsInN0cmVhbSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiam9pbiIsIl9fZGlybmFtZSIsImZsYWdzIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImF1dGhSZXF1aXJlZCIsIm5leHQiLCJxdWVyeSIsInRva2VuIiwiYXV0aEhlYWRlciIsImhlYWRlcnMiLCJhdXRob3JpemF0aW9uIiwic3BsaXQiLCJ2ZXJpZnkiLCJKV1RfU0VDUkVUIiwicmVzdWx0IiwidXNlciIsInN0YXR1cyIsInBheWxvYWQiLCJlcnIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOztBQUVBLElBQUlBLE9BQU8sR0FBR0MsT0FBTyxDQUFDLFNBQUQsQ0FBckI7O0FBQ0EsSUFBSUMsSUFBSSxHQUFHRCxPQUFPLENBQUMsTUFBRCxDQUFsQjs7QUFDQSxJQUFJRSxNQUFNLEdBQUdGLE9BQU8sQ0FBQyxRQUFELENBQXBCLEMsQ0FFQTs7O0FBQ0EsSUFBSUcsV0FBVyxHQUFHSCxPQUFPLENBQUMsYUFBRCxDQUF6QixDLENBQ0E7OztBQUNBLElBQUlJLE1BQU0sR0FBR0os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QUFDYyxHQUFKLENBQVEsVUFBVTJCLEdBQVYsRUFBNkJ6QixHQUE3QixFQUEyQ0MsR0FBM0MsRUFBMERXLElBQTFELEVBQThFO0FBQ3JGLDBCQUFZYSxHQUFaLEVBQWlCeEIsR0FBakI7QUFDQSxDQUZEO0FBSUFqQixHQUFHLENBQUNjLEdBQUosQ0FBUSxVQUFDRSxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUNyQkEsRUFBQUEsR0FBRyxDQUFDc0IsTUFBSixDQUFXLEdBQVgsRUFBZ0JmLElBQWhCLENBQXFCO0FBQUVmLElBQUFBLEtBQUssRUFBRTtBQUFULEdBQXJCO0FBQ0EsQ0FGRDtBQUlBaUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCM0MsR0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcydcclxuaW1wb3J0IHsgaGFuZGxlRXJyb3IsIEVycm9ySGFuZGxlciB9IGZyb20gJy4vbGliL2hlbHBlcnMvZXJyb3InO1xyXG5cclxudmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJylcclxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcclxudmFyIGxvZ2dlciA9IHJlcXVpcmUoJ21vcmdhbicpXHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxudmFyIGNvbXByZXNzaW9uID0gcmVxdWlyZSgnY29tcHJlc3Npb24nKVxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxudmFyIGhlbG1ldCA9IHJlcXVpcmUoJ2hlbG1ldCcpXHJcbnZhciBtb25nb29zZSA9IHJlcXVpcmUoJ21vbmdvb3NlJylcclxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxyXG52YXIgand0ID0gcmVxdWlyZSgnanNvbndlYnRva2VuJylcclxudmFyIGNvcnMgPSByZXF1aXJlKCdjb3JzJylcclxuXHJcbnJlcXVpcmUoJ2RvdGVudi1kZWZhdWx0cycpLmNvbmZpZygpXHJcblxyXG52YXIgaW5kZXhSb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlcy9pbmRleCcpXHJcbnZhciB1c2Vyc1JvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVzL3VzZXIucm91dGUnKVxyXG52YXIgZG9jUm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXMvZG9jdW1lbnRzJylcclxudmFyIHNldHRpbmdzUm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXMvc2V0dGluZ3MnKVxyXG52YXIgaGVscGVyUm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXMvaGVscGVyJylcclxuXHJcbnZhciBhcHAgPSBleHByZXNzKClcclxuXHJcbnRyeSB7XHJcblx0bW9uZ29vc2UuY29ubmVjdChcclxuXHRcdHByb2Nlc3MuZW52Lk5PREVfRU5WID09ICd0ZXN0J1xyXG5cdFx0XHQ/IHByb2Nlc3MuZW52LkRCX1BBVEhfVEVTVFxyXG5cdFx0XHQ6IHByb2Nlc3MuZW52LkRCX1BBVEgsXHJcblx0XHR7XHJcblx0XHRcdHVzZU5ld1VybFBhcnNlcjogdHJ1ZSxcclxuXHRcdFx0dXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLFxyXG5cdFx0fVxyXG5cdClcclxufSBjYXRjaCAoZXJyb3IpIHtcclxuXHRjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpXHJcblx0cHJvY2Vzcy5leGl0KDEpXHJcbn1cclxubW9uZ29vc2Uuc2V0KCd1c2VDcmVhdGVJbmRleCcsIHRydWUpXHJcblxyXG5wcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nXHJcblx0PyBhcHAudXNlKGNvbXByZXNzaW9uKCkpLnVzZShoZWxtZXQoKSlcclxuXHQ6IG51bGxcclxuXHJcbi8vIGxvZ2dpbmcgc2V0dXAgKGNoZWNrIGlmIHVzaW5nIHRlc3QgZW52KVxyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICd0ZXN0Jykge1xyXG5cdGFwcC51c2UoXHJcblx0XHRsb2dnZXIoJ1sgOmRhdGVbd2ViXSBdIDptZXRob2QgOnVybCAtIDpzdGF0dXMgaW4gOnJlc3BvbnNlLXRpbWVbM10gbXMnLCB7XHJcblx0XHRcdHNraXA6IGZ1bmN0aW9uIChyZXEsIHJlcykge1xyXG5cdFx0XHRcdHJldHVybiByZXMuc3RhdHVzQ29kZSA8IDQwMFxyXG5cdFx0XHR9LFxyXG5cdFx0fSlcclxuXHQpXHJcblx0YXBwLnVzZShcclxuXHRcdGxvZ2dlcignWyA6ZGF0ZVt3ZWJdIF0gOm1ldGhvZCA6dXJsIC0gOnJlbW90ZS1hZGRyJywge1xyXG5cdFx0XHRzdHJlYW06IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHBhdGguam9pbihfX2Rpcm5hbWUsICdhY2Nlc3MubG9nJyksIHtcclxuXHRcdFx0XHRmbGFnczogJ2EnLFxyXG5cdFx0XHR9KSxcclxuXHRcdH0pXHJcblx0KVxyXG59XHJcblxyXG5hcHAudXNlKGNvcnMoKSlcclxuYXBwLnVzZShleHByZXNzLmpzb24oKSlcclxuYXBwLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSlcclxuXHJcbi8vIGF1dGggbWlkZGxld2FyZVxyXG5jb25zdCBhdXRoUmVxdWlyZWQgPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcclxuXHR0cnkge1xyXG5cdFx0bGV0IHRva2VuXHJcblxyXG5cdFx0aWYgKHJlcS5xdWVyeS50b2tlbikge1xyXG5cdFx0XHR0b2tlbiA9IHJlcS5xdWVyeS50b2tlblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uXHJcblx0XHRcdHRva2VuID0gYXV0aEhlYWRlci5zcGxpdCgnICcpWzFdXHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHJlc3VsdCA9IGF3YWl0IGp3dC52ZXJpZnkodG9rZW4sIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQpXHJcblx0XHRyZXEudXNlciA9IHJlc3VsdFxyXG5cclxuXHRcdG5leHQoKVxyXG5cdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRyZXMuc3RhdHVzKDUwMCkuanNvbih7IHBheWxvYWQ6IHsgbWVzc2FnZTogJ1VuYXV0aG9yaXplZCBhY2Nlc3MnIH0gfSlcclxuXHR9XHJcbn1cclxuXHJcbmFwcC51c2UoJy91c2VyJywgdXNlcnNSb3V0ZXIpXHJcbmFwcC51c2UoJy9kb2N1bWVudCcsIGF1dGhSZXF1aXJlZCwgZG9jUm91dGVyKVxyXG5hcHAudXNlKCcvc2V0dGluZycsIGF1dGhSZXF1aXJlZCwgc2V0dGluZ3NSb3V0ZXIpXHJcbmFwcC51c2UoJy9mdW5jdGlvbicsIGF1dGhSZXF1aXJlZCwgaGVscGVyUm91dGVyKVxyXG5hcHAudXNlKCcvJywgaW5kZXhSb3V0ZXIpXHJcblxyXG4vLyBlcnJvciBoYW5kbGVyXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xyXG5hcHAudXNlKGZ1bmN0aW9uIChlcnI6IEVycm9ySGFuZGxlciwgcmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuXHRoYW5kbGVFcnJvcihlcnIsIHJlcylcclxufSlcclxuXHJcbmFwcC51c2UoKHJlcSwgcmVzKSA9PiB7XHJcblx0cmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogJ1JvdXRlIG5vdCBmb3VuZCcgfSlcclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYXBwXHJcbiJdfQ==