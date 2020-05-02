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
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id, stream) {
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
                  download.pipe(stream).on('error', function (error) {
                    return reject(error);
                  }).on('finish', function () {
                    return resolve();
                  });
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function get(_x2, _x3) {
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

      function _delete(_x4) {
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

      function archive(_x5) {
        return _archive.apply(this, arguments);
      }

      return archive;
    }()
  }]);
  return AWS;
}();

exports["default"] = AWS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS9hZGFwdGVycy9hd3MudHMiXSwibmFtZXMiOlsiQVdTIiwicHJvY2VzcyIsImVudiIsIkFXU19BQ0NFU1NfS0VZX0lEIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJBV1NfU0VDUkVUX0FDQ0VTU19LRVkiLCJBV1NfQlVDS0VUX05BTUUiLCJjb25uZWN0aW9uIiwiYXdzIiwiUzMiLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsInNzbEVuYWJsZWQiLCJhcGlWZXJzaW9uIiwiYnVja2V0X25hbWUiLCJzdHJlYW0iLCJmaWxlSWQiLCJwYXJhbXMiLCJCdWNrZXQiLCJLZXkiLCJCb2R5IiwiU3RvcmFnZUNsYXNzIiwiQVdTX0lOVEVMTElHRU5UX1RJRVJJTkciLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInVwbG9hZCIsInByb21pc2UiLCJ0aGVuIiwiZGF0YSIsImVycm9yIiwiaWQiLCJkb3dubG9hZCIsImdldE9iamVjdCIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvbiIsInBpcGUiLCJfZGVsZXRlIiwiZGVsZXRlT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0lBS3FCQSxHO0FBSWpCLGlCQUFjO0FBQUE7QUFBQTtBQUFBO0FBQ1YsUUFBSUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGlCQUFaLEtBQWtDQyxTQUF0QyxFQUFpRCxNQUFNQyxLQUFLLENBQUMsa0RBQUQsQ0FBWDtBQUNqRCxRQUFJSixPQUFPLENBQUNDLEdBQVIsQ0FBWUkscUJBQVosS0FBc0NGLFNBQTFDLEVBQXFELE1BQU1DLEtBQUssQ0FBQyxzREFBRCxDQUFYO0FBQ3JELFFBQUlKLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSyxlQUFaLEtBQWdDSCxTQUFwQyxFQUErQyxNQUFNQyxLQUFLLENBQUMsZ0RBQUQsQ0FBWDtBQUUvQyxTQUFLRyxVQUFMLEdBQWtCLElBQUlDLG1CQUFJQyxFQUFS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Ozs7OztxSEFPR0MsRTs7Ozs7a0RBQ0gsSUFBSVIsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQ0Esa0JBQUFBLE1BQU0sQ0FBQyxJQUFJckIsS0FBSixDQUFVLG9EQUFWLENBQUQsQ0FBTjtBQUNILGlCQUZNLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXdzLCB7IFMzIH0gZnJvbSAnYXdzLXNkayc7XHJcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJ1xyXG5pbXBvcnQgeyBSZWFkU3RyZWFtLCBXcml0ZVN0cmVhbSB9IGZyb20gJ2ZzJztcclxuaW1wb3J0IFN0b3JhZ2VBZGFwdGVyIGZyb20gJy4vaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgUmVhZGFibGUgfSBmcm9tICdzdHJlYW0nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVdTIGltcGxlbWVudHMgU3RvcmFnZUFkYXB0ZXIge1xyXG4gICAgcHJpdmF0ZSBjb25uZWN0aW9uOiBhd3MuUzNcclxuICAgIHByaXZhdGUgYnVja2V0X25hbWU6IHN0cmluZ1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5BV1NfQUNDRVNTX0tFWV9JRCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcihcIkFXU19BQ0NFU1NfS0VZX0lEIGlzIG5vdCBhIGRlZmluZWQgZW52IHZhcmlhYmxlIVwiKVxyXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5BV1NfU0VDUkVUX0FDQ0VTU19LRVkgPT09IHVuZGVmaW5lZCkgdGhyb3cgRXJyb3IoXCJBV1NfU0VDUkVUX0FDQ0VTU19LRVkgaXMgbm90IGEgZGVmaW5lZCBlbnYgdmFyaWFibGUhXCIpXHJcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52LkFXU19CVUNLRVRfTkFNRSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcihcIkFXU19CVUNLRVRfTkFNRSBpcyBub3QgYSBkZWZpbmVkIGVudiB2YXJpYWJsZSFcIilcclxuXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gbmV3IGF3cy5TMyh7XHJcbiAgICAgICAgICAgIGFjY2Vzc0tleUlkOiBwcm9jZXNzLmVudi5BV1NfQUNDRVNTX0tFWV9JRCxcclxuICAgICAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBwcm9jZXNzLmVudi5BV1NfU0VDUkVUX0FDQ0VTU19LRVksXHJcbiAgICAgICAgICAgIHNzbEVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGFwaVZlcnNpb246ICcyMDA2LTAzLTAxJ1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMuYnVja2V0X25hbWUgPSBwcm9jZXNzLmVudi5BV1NfQlVDS0VUX05BTUVcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBhZGQoc3RyZWFtOiBSZWFkYWJsZSk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgY29uc3QgZmlsZUlkID0gdXVpZCgpXHJcbiAgICAgICAgY29uc3QgcGFyYW1zOiBhd3MuUzMuUHV0T2JqZWN0UmVxdWVzdCA9IHsgQnVja2V0OiB0aGlzLmJ1Y2tldF9uYW1lLCBLZXk6IGZpbGVJZCwgQm9keTogc3RyZWFtLCBTdG9yYWdlQ2xhc3M6IHByb2Nlc3MuZW52LkFXU19JTlRFTExJR0VOVF9USUVSSU5HID8gJ0lOVEVMTElHRU5UX1RJRVJJTkcnIDogJ1NUQU5EQVJEJyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHVwbG9hZDogUHJvbWlzZTxhd3MuUzMuTWFuYWdlZFVwbG9hZC5TZW5kRGF0YT4gPSB0aGlzLmNvbm5lY3Rpb24udXBsb2FkKHBhcmFtcykucHJvbWlzZSgpXHJcblxyXG4gICAgICAgICAgICB1cGxvYWQudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhLktleSlcclxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBnZXQoaWQ6IHN0cmluZywgc3RyZWFtOiBXcml0ZVN0cmVhbSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtczogYXdzLlMzLkdldE9iamVjdFJlcXVlc3QgPSB7IEJ1Y2tldDogdGhpcy5idWNrZXRfbmFtZSwgS2V5OiBpZCB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkb3dubG9hZCA9IHRoaXMuY29ubmVjdGlvbi5nZXRPYmplY3QocGFyYW1zKS5jcmVhdGVSZWFkU3RyZWFtKClcclxuICAgICAgICAgICAgZG93bmxvYWQub24oJ2Vycm9yJywgKGVycm9yKSA9PiByZWplY3QoZXJyb3IpKVxyXG5cclxuICAgICAgICAgICAgZG93bmxvYWQucGlwZShzdHJlYW0pLm9uKCdlcnJvcicsIChlcnJvcikgPT4gcmVqZWN0KGVycm9yKSkub24oJ2ZpbmlzaCcsICgpID0+IHJlc29sdmUoKSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGRlbGV0ZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zOiBhd3MuUzMuRGVsZXRlT2JqZWN0UmVxdWVzdCA9IHsgQnVja2V0OiB0aGlzLmJ1Y2tldF9uYW1lLCBLZXk6IGlkIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IF9kZWxldGUgPSB0aGlzLmNvbm5lY3Rpb24uZGVsZXRlT2JqZWN0KHBhcmFtcykucHJvbWlzZSgpXHJcblxyXG4gICAgICAgICAgICBfZGVsZXRlLnRoZW4oKCkgPT4gcmVzb2x2ZSgpKS5jYXRjaCgoZXJyb3IpID0+IHJlamVjdChlcnJvcikpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBhcmNoaXZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdUaGUgc3RvcmFnZSBiYWNrZW5kIGRvZXMgbm90IHN1cHBvcnQgdGhpcyBmdW5jdGlvbicpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG59Il19