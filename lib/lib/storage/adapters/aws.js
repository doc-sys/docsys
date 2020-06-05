"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _uuid = require("uuid");

var AWS = /*#__PURE__*/function () {
  function AWS() {
    (0, _classCallCheck2["default"])(this, AWS);
    (0, _defineProperty2["default"])(this, "connection", void 0);
    (0, _defineProperty2["default"])(this, "bucket_name", void 0);
    if (process.env.AWS_ACCESS_KEY_ID === undefined) throw Error("AWS_ACCESS_KEY_ID is not a defined env variable!");
    if (process.env.AWS_SECRET_ACCESS_KEY === undefined) throw Error("AWS_SECRET_ACCESS_KEY is not a defined env variable!");
    if (process.env.AWS_BUCKET_NAME === undefined) throw Error("AWS_BUCKET_NAME is not a defined env variable!");
    this.connection = new _awsSdk["default"].S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sslEnabled: true,
      apiVersion: '2006-03-01'
    });
    this.bucket_name = process.env.AWS_BUCKET_NAME;
  }

  (0, _createClass2["default"])(AWS, [{
    key: "add",
    value: function () {
      var _add = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(stream) {
        var _this = this;

        var fileId, params;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fileId = (0, _uuid.v4)();
                params = {
                  Bucket: this.bucket_name,
                  Key: fileId,
                  Body: stream,
                  StorageClass: process.env.AWS_INTELLIGENT_TIERING ? 'INTELLIGENT_TIERING' : 'STANDARD'
                };
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  var upload = _this.connection.upload(params).promise();

                  upload.then(function (data) {
                    resolve(data.Key);
                  })["catch"](function (error) {
                    reject(error);
                  });
                }));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function add(_x) {
        return _add.apply(this, arguments);
      }

      return add;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
        var _this2 = this;

        var params;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                params = {
                  Bucket: this.bucket_name,
                  Key: id
                };
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  var download = _this2.connection.getObject(params).createReadStream();

                  download.on('error', function (error) {
                    return reject(error);
                  });
                  var chunks = [];
                  download.on('data', function (chunk) {
                    return chunks.push(chunk);
                  });
                  download.on('end', function (chunk) {
                    return resolve(Buffer.concat(chunks));
                  });
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function get(_x2) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
        var _this3 = this;

        var params;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                params = {
                  Bucket: this.bucket_name,
                  Key: id
                };
                return _context3.abrupt("return", new Promise(function (resolve, reject) {
                  var _delete = _this3.connection.deleteObject(params).promise();

                  _delete.then(function () {
                    return resolve();
                  })["catch"](function (error) {
                    return reject(error);
                  });
                }));

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _delete(_x3) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "archive",
    value: function () {
      var _archive = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(id) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", new Promise(function (resolve, reject) {
                  reject(new Error('The storage backend does not support this function'));
                }));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function archive(_x4) {
        return _archive.apply(this, arguments);
      }

      return archive;
    }()
  }]);
  return AWS;
}();

exports["default"] = AWS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS9hZGFwdGVycy9hd3MudHMiXSwibmFtZXMiOlsiQVdTIiwicHJvY2VzcyIsImVudiIsIkFXU19BQ0NFU1NfS0VZX0lEIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJBV1NfU0VDUkVUX0FDQ0VTU19LRVkiLCJBV1NfQlVDS0VUX05BTUUiLCJjb25uZWN0aW9uIiwiYXdzIiwiUzMiLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsInNzbEVuYWJsZWQiLCJhcGlWZXJzaW9uIiwiYnVja2V0X25hbWUiLCJzdHJlYW0iLCJmaWxlSWQiLCJwYXJhbXMiLCJCdWNrZXQiLCJLZXkiLCJCb2R5IiwiU3RvcmFnZUNsYXNzIiwiQVdTX0lOVEVMTElHRU5UX1RJRVJJTkciLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInVwbG9hZCIsInByb21pc2UiLCJ0aGVuIiwiZGF0YSIsImVycm9yIiwiaWQiLCJkb3dubG9hZCIsImdldE9iamVjdCIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvbiIsImNodW5rcyIsImNodW5rIiwicHVzaCIsIkJ1ZmZlciIsImNvbmNhdCIsIl9kZWxldGUiLCJkZWxldGVPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7SUFLcUJBLEc7QUFJakIsaUJBQWM7QUFBQTtBQUFBO0FBQUE7QUFDVixRQUFJQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsaUJBQVosS0FBa0NDLFNBQXRDLEVBQWlELE1BQU1DLEtBQUssQ0FBQyxrREFBRCxDQUFYO0FBQ2pELFFBQUlKLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSSxxQkFBWixLQUFzQ0YsU0FBMUMsRUFBcUQsTUFBTUMsS0FBSyxDQUFDLHNEQUFELENBQVg7QUFDckQsUUFBSUosT0FBTyxDQUFDQyxHQUFSLENBQVlLLGVBQVosS0FBZ0NILFNBQXBDLEVBQStDLE1BQU1DLEtBQUssQ0FBQyxnREFBRCxDQUFYO0FBRS9D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QUFBQSxtQkFBYixXQUFvQyxVQUFDTSxLQUFEO0FBQUEsMkJBQVdMLE1BQU0sQ0FBQ0ssS0FBRCxDQUFqQjtBQUFBLG1CQUFwQztBQUNILGlCQUpNLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUhBT0dDLEU7Ozs7O2tEQUNILElBQUlSLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcENBLGtCQUFBQSxNQUFNLENBQUMsSUFBSXJCLEtBQUosQ0FBVSxvREFBVixDQUFELENBQU47QUFDSCxpQkFGTSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF3cywgeyBTMyB9IGZyb20gJ2F3cy1zZGsnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnXG5pbXBvcnQgeyBSZWFkU3RyZWFtLCBXcml0ZVN0cmVhbSB9IGZyb20gJ2ZzJztcbmltcG9ydCBTdG9yYWdlQWRhcHRlciBmcm9tICcuL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBSZWFkYWJsZSB9IGZyb20gJ3N0cmVhbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFXUyBpbXBsZW1lbnRzIFN0b3JhZ2VBZGFwdGVyIHtcbiAgICBwcml2YXRlIGNvbm5lY3Rpb246IGF3cy5TM1xuICAgIHByaXZhdGUgYnVja2V0X25hbWU6IHN0cmluZ1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5BV1NfQUNDRVNTX0tFWV9JRCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcihcIkFXU19BQ0NFU1NfS0VZX0lEIGlzIG5vdCBhIGRlZmluZWQgZW52IHZhcmlhYmxlIVwiKVxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuQVdTX1NFQ1JFVF9BQ0NFU1NfS0VZID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKFwiQVdTX1NFQ1JFVF9BQ0NFU1NfS0VZIGlzIG5vdCBhIGRlZmluZWQgZW52IHZhcmlhYmxlIVwiKVxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuQVdTX0JVQ0tFVF9OQU1FID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKFwiQVdTX0JVQ0tFVF9OQU1FIGlzIG5vdCBhIGRlZmluZWQgZW52IHZhcmlhYmxlIVwiKVxuXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG5ldyBhd3MuUzMoe1xuICAgICAgICAgICAgYWNjZXNzS2V5SWQ6IHByb2Nlc3MuZW52LkFXU19BQ0NFU1NfS0VZX0lELFxuICAgICAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBwcm9jZXNzLmVudi5BV1NfU0VDUkVUX0FDQ0VTU19LRVksXG4gICAgICAgICAgICBzc2xFbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgYXBpVmVyc2lvbjogJzIwMDYtMDMtMDEnXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5idWNrZXRfbmFtZSA9IHByb2Nlc3MuZW52LkFXU19CVUNLRVRfTkFNRVxuICAgIH1cblxuICAgIGFzeW5jIGFkZChzdHJlYW06IFJlYWRhYmxlKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29uc3QgZmlsZUlkID0gdXVpZCgpXG4gICAgICAgIGNvbnN0IHBhcmFtczogYXdzLlMzLlB1dE9iamVjdFJlcXVlc3QgPSB7IEJ1Y2tldDogdGhpcy5idWNrZXRfbmFtZSwgS2V5OiBmaWxlSWQsIEJvZHk6IHN0cmVhbSwgU3RvcmFnZUNsYXNzOiBwcm9jZXNzLmVudi5BV1NfSU5URUxMSUdFTlRfVElFUklORyA/ICdJTlRFTExJR0VOVF9USUVSSU5HJyA6ICdTVEFOREFSRCcgfVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHVwbG9hZDogUHJvbWlzZTxhd3MuUzMuTWFuYWdlZFVwbG9hZC5TZW5kRGF0YT4gPSB0aGlzLmNvbm5lY3Rpb24udXBsb2FkKHBhcmFtcykucHJvbWlzZSgpXG5cbiAgICAgICAgICAgIHVwbG9hZC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhLktleSlcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0KGlkOiBzdHJpbmcpOiBQcm9taXNlPEJ1ZmZlcj4ge1xuICAgICAgICBjb25zdCBwYXJhbXM6IGF3cy5TMy5HZXRPYmplY3RSZXF1ZXN0ID0geyBCdWNrZXQ6IHRoaXMuYnVja2V0X25hbWUsIEtleTogaWQgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgZG93bmxvYWQgPSB0aGlzLmNvbm5lY3Rpb24uZ2V0T2JqZWN0KHBhcmFtcykuY3JlYXRlUmVhZFN0cmVhbSgpXG4gICAgICAgICAgICBkb3dubG9hZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHJlamVjdChlcnJvcikpXG5cbiAgICAgICAgICAgIGxldCBjaHVua3M6IGFueSA9IFtdXG4gICAgICAgICAgICBkb3dubG9hZC5vbignZGF0YScsIGNodW5rID0+IGNodW5rcy5wdXNoKGNodW5rKSlcbiAgICAgICAgICAgIGRvd25sb2FkLm9uKCdlbmQnLCBjaHVuayA9PiByZXNvbHZlKEJ1ZmZlci5jb25jYXQoY2h1bmtzKSkpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXN5bmMgZGVsZXRlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcGFyYW1zOiBhd3MuUzMuRGVsZXRlT2JqZWN0UmVxdWVzdCA9IHsgQnVja2V0OiB0aGlzLmJ1Y2tldF9uYW1lLCBLZXk6IGlkIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IF9kZWxldGUgPSB0aGlzLmNvbm5lY3Rpb24uZGVsZXRlT2JqZWN0KHBhcmFtcykucHJvbWlzZSgpXG5cbiAgICAgICAgICAgIF9kZWxldGUudGhlbigoKSA9PiByZXNvbHZlKCkpLmNhdGNoKChlcnJvcikgPT4gcmVqZWN0KGVycm9yKSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhc3luYyBhcmNoaXZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ1RoZSBzdG9yYWdlIGJhY2tlbmQgZG9lcyBub3Qgc3VwcG9ydCB0aGlzIGZ1bmN0aW9uJykpXG4gICAgICAgIH0pXG4gICAgfVxuXG59Il19