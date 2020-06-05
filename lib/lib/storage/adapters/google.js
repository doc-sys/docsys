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

var _storage = require("@google-cloud/storage");

var _uuid = require("uuid");

var GoogleStorage = /*#__PURE__*/function () {
  function GoogleStorage() {
    (0, _classCallCheck2["default"])(this, GoogleStorage);
    (0, _defineProperty2["default"])(this, "client", void 0);
    (0, _defineProperty2["default"])(this, "bucket_name", void 0);
    if (process.env.GC_CLIENT_EMAIL === undefined) throw Error("GC_CLIENT_EMAIL is not a defined env variable!");
    if (process.env.GC_PRIVATE_KEY === undefined) throw Error("GC_PRIVATE_KEY is not a defined env variable!");
    if (process.env.GC_BUCKET_NAME === undefined) throw Error("GC_BUCKET_NAME is not a defined env variable!");
    this.client = new _storage.Storage({
      credentials: {
        client_email: process.env.GC_CLIENT_EMAIL,
        private_key: process.env.GC_PRIVATE_KEY
      }
    });
    this.bucket_name = process.env.GC_BUCKET_NAME;
  }

  (0, _createClass2["default"])(GoogleStorage, [{
    key: "add",
    value: function () {
      var _add = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(stream) {
        var _this = this;

        var fileId;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fileId = (0, _uuid.v4)();
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  stream.pipe(_this.client.bucket(_this.bucket_name).file(fileId).createWriteStream({
                    gzip: true
                  })).on('error', function (error) {
                    return reject(error);
                  }).on('finish', function () {
                    resolve(fileId);
                  });
                }));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
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

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  _this2.client.bucket(_this2.bucket_name).file(id).createReadStream().on('error', function (error) {
                    return reject(error);
                  }).on('end', function () {
                    return resolve();
                  });
                }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
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
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.client.bucket(this.bucket_name).file(id)["delete"]());

              case 1:
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
  return GoogleStorage;
}();

exports["default"] = GoogleStorage;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS9hZGFwdGVycy9nb29nbGUudHMiXSwibmFtZXMiOlsiR29vZ2xlU3RvcmFnZSIsInByb2Nlc3MiLCJlbnYiLCJHQ19DTElFTlRfRU1BSUwiLCJ1bmRlZmluZWQiLCJFcnJvciIsIkdDX1BSSVZBVEVfS0VZIiwiR0NfQlVDS0VUX05BTUUiLCJjbGllbnQiLCJTdG9yYWdlIiwiY3JlZGVudGlhbHMiLCJjbGllbnRfZW1haWwiLCJwcml2YXRlX2tleSIsImJ1Y2tldF9uYW1lIiwic3RyZWFtIiwiZmlsZUlkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwaXBlIiwiYnVja2V0IiwiZmlsZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiZ3ppcCIsIm9uIiwiZXJyb3IiLCJpZCIsImNyZWF0ZVJlYWRTdHJlYW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7QUFDQTs7SUFFcUJBLGE7QUFLakIsMkJBQWM7QUFBQTtBQUFBO0FBQUE7QUFDVixRQUFJQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsZUFBWixLQUFnQ0MsU0FBcEMsRUFBK0MsTUFBTUMsS0FBSyxDQUFDLGdEQUFELENBQVg7QUFDL0MsUUFBSUosT0FBTyxDQUFDQyxHQUFSLENBQVlJLGNBQVosS0FBK0JGLFNBQW5DLEVBQThDLE1BQU1DLEtBQUssQ0FBQywrQ0FBRCxDQUFYO0FBQzlDLFFBQUlKLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSyxjQUFaLEtBQStCSCxTQUFuQyxFQUE4QyxNQUFNQyxLQUFLLENBQUMsK0NBQUQsQ0FBWDtBQUc5QyxTQUFLRyxNQUFMLEdBQWMsSUFBSUMsZ0JBQUosQ0FBWTtBQUN0QkMsTUFBQUEsV0FBVyxFQUFFO0FBQ1RDLFFBQUFBLFlBQVksRUFBRVYsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGVBRGpCO0FBRVRTLFFBQUFBLFdBQVcsRUFBRVgsT0FBTyxDQUFDQyxHQUFSLENBQVlJO0FBRmhCO0FBRFMsS0FBWixDQUFkO0FBTUEsU0FBS08sV0FBTCxHQUFtQlosT0FBTyxDQUFDQyxHQUFSLENBQVlLLGNBQS9CO0FBQ0g7Ozs7O2dIQUVTTyxNOzs7Ozs7OztBQUNBQyxnQkFBQUEsTSxHQUFTLGU7aURBQ1IsSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQ0osa0JBQUFBLE1BQU0sQ0FBQ0ssSUFBUCxDQUFZLEtBQUksQ0FBQ1gsTUFBTCxDQUFZWSxNQUFaLENBQW1CLEtBQUksQ0FBQ1AsV0FBeEIsRUFBcUNRLElBQXJDLENBQTBDTixNQUExQyxFQUFrRE8saUJBQWxELENBQW9FO0FBQUVDLG9CQUFBQSxJQUFJLEVBQUU7QUFBUixtQkFBcEUsQ0FBWixFQUNLQyxFQURMLENBQ1EsT0FEUixFQUNpQixVQUFDQyxLQUFEO0FBQUEsMkJBQWdCUCxNQUFNLENBQUNPLEtBQUQsQ0FBdEI7QUFBQSxtQkFEakIsRUFFS0QsRUFGTCxDQUVRLFFBRlIsRUFFa0IsWUFBTTtBQUFFUCxvQkFBQUEsT0FBTyxDQUFDRixNQUFELENBQVA7QUFBaUIsbUJBRjNDO0FBR0gsaUJBSk0sQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpSEFPRFcsRSxFQUFZWixNOzs7Ozs7O2tEQUNYLElBQUlFLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcEMsa0JBQUEsTUFBSSxDQUFDVixNQUFMLENBQVlZLE1BQVosQ0FBbUIsTUFBSSxDQUFDUCxXQUF4QixFQUFxQ1EsSUFBckMsQ0FBMENLLEVBQTFDLEVBQThDQyxnQkFBOUMsR0FDS0gsRUFETCxDQUNRLE9BRFIsRUFDaUIsVUFBQ0MsS0FBRDtBQUFBLDJCQUFnQlAsTUFBTSxDQUFDTyxLQUFELENBQXRCO0FBQUEsbUJBRGpCLEVBRUtELEVBRkwsQ0FFUSxLQUZSLEVBRWU7QUFBQSwyQkFBTVAsT0FBTyxFQUFiO0FBQUEsbUJBRmY7QUFHSCxpQkFKTSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FIQU9FUyxFOzs7OztrREFDRixLQUFLbEIsTUFBTCxDQUFZWSxNQUFaLENBQW1CLEtBQUtQLFdBQXhCLEVBQXFDUSxJQUFyQyxDQUEwQ0ssRUFBMUMsYTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxSEFHR0EsRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlYWRTdHJlYW0sIFdyaXRlU3RyZWFtIH0gZnJvbSAnZnMnXG5pbXBvcnQgU3RvcmFnZUFkYXB0ZXIgZnJvbSAnLi9pbnRlcmZhY2UnXG5pbXBvcnQgeyBTdG9yYWdlIH0gZnJvbSAnQGdvb2dsZS1jbG91ZC9zdG9yYWdlJ1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdvb2dsZVN0b3JhZ2UgaW1wbGVtZW50cyBTdG9yYWdlQWRhcHRlciB7XG4gICAgcHJpdmF0ZSBjbGllbnQ6IGFueVxuICAgIHByaXZhdGUgYnVja2V0X25hbWU6IHN0cmluZyB8IHVuZGVmaW5lZFxuXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52LkdDX0NMSUVOVF9FTUFJTCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcihcIkdDX0NMSUVOVF9FTUFJTCBpcyBub3QgYSBkZWZpbmVkIGVudiB2YXJpYWJsZSFcIilcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52LkdDX1BSSVZBVEVfS0VZID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKFwiR0NfUFJJVkFURV9LRVkgaXMgbm90IGEgZGVmaW5lZCBlbnYgdmFyaWFibGUhXCIpXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5HQ19CVUNLRVRfTkFNRSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcihcIkdDX0JVQ0tFVF9OQU1FIGlzIG5vdCBhIGRlZmluZWQgZW52IHZhcmlhYmxlIVwiKVxuXG5cbiAgICAgICAgdGhpcy5jbGllbnQgPSBuZXcgU3RvcmFnZSh7XG4gICAgICAgICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICAgICAgICAgIGNsaWVudF9lbWFpbDogcHJvY2Vzcy5lbnYuR0NfQ0xJRU5UX0VNQUlMLFxuICAgICAgICAgICAgICAgIHByaXZhdGVfa2V5OiBwcm9jZXNzLmVudi5HQ19QUklWQVRFX0tFWVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmJ1Y2tldF9uYW1lID0gcHJvY2Vzcy5lbnYuR0NfQlVDS0VUX05BTUVcbiAgICB9XG5cbiAgICBhc3luYyBhZGQoc3RyZWFtOiBSZWFkU3RyZWFtKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29uc3QgZmlsZUlkID0gdXVpZCgpXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzdHJlYW0ucGlwZSh0aGlzLmNsaWVudC5idWNrZXQodGhpcy5idWNrZXRfbmFtZSkuZmlsZShmaWxlSWQpLmNyZWF0ZVdyaXRlU3RyZWFtKHsgZ3ppcDogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgICAub24oJ2Vycm9yJywgKGVycm9yOiBhbnkpID0+IHJlamVjdChlcnJvcikpXG4gICAgICAgICAgICAgICAgLm9uKCdmaW5pc2gnLCAoKSA9PiB7IHJlc29sdmUoZmlsZUlkKSB9KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFzeW5jIGdldChpZDogc3RyaW5nLCBzdHJlYW06IFdyaXRlU3RyZWFtKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudC5idWNrZXQodGhpcy5idWNrZXRfbmFtZSkuZmlsZShpZCkuY3JlYXRlUmVhZFN0cmVhbSgpXG4gICAgICAgICAgICAgICAgLm9uKCdlcnJvcicsIChlcnJvcjogYW55KSA9PiByZWplY3QoZXJyb3IpKVxuICAgICAgICAgICAgICAgIC5vbignZW5kJywgKCkgPT4gcmVzb2x2ZSgpKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudC5idWNrZXQodGhpcy5idWNrZXRfbmFtZSkuZmlsZShpZCkuZGVsZXRlKClcbiAgICB9XG5cbiAgICBhc3luYyBhcmNoaXZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHsgfVxufSJdfQ==