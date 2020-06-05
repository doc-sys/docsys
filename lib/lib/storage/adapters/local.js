"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

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

var fs = _interopRequireWildcard(require("fs"));

var path = _interopRequireWildcard(require("path"));

var _uuid = require("uuid");

var Local = /*#__PURE__*/function () {
  function Local() {
    (0, _classCallCheck2["default"])(this, Local);
    (0, _defineProperty2["default"])(this, "path", void 0);
    if (process.env.LOCAL_STORAGE_DIR === undefined) throw Error("LOCAL_STORAGE_DIR is not a defined env variable!");
    this.path = process.env.LOCAL_STORAGE_DIR;
  }

  (0, _createClass2["default"])(Local, [{
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
                  var wStream = fs.createWriteStream(path.join('./', _this.path, fileId));
                  stream.pipe(wStream).on('error', function (error) {
                    return reject(error);
                  }).on('finish', function () {
                    return resolve(fileId);
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
                  var rStream = fs.createReadStream(path.join('./', _this2.path, id));
                  rStream.pipe(stream).on('error', function (error) {
                    return reject(error);
                  }).on('finish', function () {
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
        var _this3 = this;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", new Promise(function (resolve, reject) {
                  fs.unlink(path.join('./', _this3.path, id), function (error) {
                    if (error) reject(error);
                    resolve();
                  });
                }));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
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
  return Local;
}();

exports["default"] = Local;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS9hZGFwdGVycy9sb2NhbC50cyJdLCJuYW1lcyI6WyJMb2NhbCIsInByb2Nlc3MiLCJlbnYiLCJMT0NBTF9TVE9SQUdFX0RJUiIsInVuZGVmaW5lZCIsIkVycm9yIiwicGF0aCIsInN0cmVhbSIsImZpbGVJZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwid1N0cmVhbSIsImZzIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJqb2luIiwicGlwZSIsIm9uIiwiZXJyb3IiLCJpZCIsInJTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwidW5saW5rIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7SUFJcUJBLEs7QUFHakIsbUJBQWM7QUFBQTtBQUFBO0FBQ1YsUUFBSUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGlCQUFaLEtBQWtDQyxTQUF0QyxFQUFpRCxNQUFNQyxLQUFLLENBQUMsa0RBQUQsQ0FBWDtBQUVqRCxTQUFLQyxJQUFMLEdBQVlMLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxpQkFBeEI7QUFDSDs7Ozs7Z0hBRVNJLE07Ozs7Ozs7O0FBQ0FDLGdCQUFBQSxNLEdBQVMsZTtpREFDUixJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDLHNCQUFJQyxPQUFPLEdBQUdDLEVBQUUsQ0FBQ0MsaUJBQUgsQ0FBcUJSLElBQUksQ0FBQ1MsSUFBTCxDQUFVLElBQVYsRUFBZ0IsS0FBSSxDQUFDVCxJQUFyQixFQUEyQkUsTUFBM0IsQ0FBckIsQ0FBZDtBQUNBRCxrQkFBQUEsTUFBTSxDQUFDUyxJQUFQLENBQVlKLE9BQVosRUFBcUJLLEVBQXJCLENBQXdCLE9BQXhCLEVBQWlDLFVBQUNDLEtBQUQ7QUFBQSwyQkFBV1AsTUFBTSxDQUFDTyxLQUFELENBQWpCO0FBQUEsbUJBQWpDLEVBQTJERCxFQUEzRCxDQUE4RCxRQUE5RCxFQUF3RTtBQUFBLDJCQUFNUCxPQUFPLENBQUNGLE1BQUQsQ0FBYjtBQUFBLG1CQUF4RTtBQUNILGlCQUhNLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUhBTURXLEUsRUFBWVosTTs7Ozs7OztrREFDWCxJQUFJRSxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDLHNCQUFJUyxPQUFPLEdBQUdQLEVBQUUsQ0FBQ1EsZ0JBQUgsQ0FBb0JmLElBQUksQ0FBQ1MsSUFBTCxDQUFVLElBQVYsRUFBZ0IsTUFBSSxDQUFDVCxJQUFyQixFQUEyQmEsRUFBM0IsQ0FBcEIsQ0FBZDtBQUNBQyxrQkFBQUEsT0FBTyxDQUFDSixJQUFSLENBQWFULE1BQWIsRUFBcUJVLEVBQXJCLENBQXdCLE9BQXhCLEVBQWlDLFVBQUNDLEtBQUQ7QUFBQSwyQkFBV1AsTUFBTSxDQUFDTyxLQUFELENBQWpCO0FBQUEsbUJBQWpDLEVBQTJERCxFQUEzRCxDQUE4RCxRQUE5RCxFQUF3RTtBQUFBLDJCQUFNUCxPQUFPLEVBQWI7QUFBQSxtQkFBeEU7QUFDSCxpQkFITSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FIQU1FUyxFOzs7Ozs7O2tEQUNGLElBQUlWLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcENFLGtCQUFBQSxFQUFFLENBQUNTLE1BQUgsQ0FBVWhCLElBQUksQ0FBQ1MsSUFBTCxDQUFVLElBQVYsRUFBZ0IsTUFBSSxDQUFDVCxJQUFyQixFQUEyQmEsRUFBM0IsQ0FBVixFQUEwQyxVQUFDRCxLQUFELEVBQVc7QUFDakQsd0JBQUlBLEtBQUosRUFBV1AsTUFBTSxDQUFDTyxLQUFELENBQU47QUFDWFIsb0JBQUFBLE9BQU87QUFDVixtQkFIRDtBQUlILGlCQUxNLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUhBUUdTLEU7Ozs7O2tEQUNILElBQUlWLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcENBLGtCQUFBQSxNQUFNLENBQUMsSUFBSU4sS0FBSixDQUFVLG9EQUFWLENBQUQsQ0FBTjtBQUNILGlCQUZNLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcydcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJ1xuaW1wb3J0IHsgUmVhZFN0cmVhbSwgV3JpdGVTdHJlYW0gfSBmcm9tICdmcyc7XG5pbXBvcnQgU3RvcmFnZUFkYXB0ZXIgZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhbCBpbXBsZW1lbnRzIFN0b3JhZ2VBZGFwdGVyIHtcbiAgICBwcml2YXRlIHBhdGg6IHN0cmluZ1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5MT0NBTF9TVE9SQUdFX0RJUiA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcihcIkxPQ0FMX1NUT1JBR0VfRElSIGlzIG5vdCBhIGRlZmluZWQgZW52IHZhcmlhYmxlIVwiKVxuXG4gICAgICAgIHRoaXMucGF0aCA9IHByb2Nlc3MuZW52LkxPQ0FMX1NUT1JBR0VfRElSXG4gICAgfVxuXG4gICAgYXN5bmMgYWRkKHN0cmVhbTogUmVhZFN0cmVhbSk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGNvbnN0IGZpbGVJZCA9IHV1aWQoKVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHdTdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShwYXRoLmpvaW4oJy4vJywgdGhpcy5wYXRoLCBmaWxlSWQpKVxuICAgICAgICAgICAgc3RyZWFtLnBpcGUod1N0cmVhbSkub24oJ2Vycm9yJywgKGVycm9yKSA9PiByZWplY3QoZXJyb3IpKS5vbignZmluaXNoJywgKCkgPT4gcmVzb2x2ZShmaWxlSWQpKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFzeW5jIGdldChpZDogc3RyaW5nLCBzdHJlYW06IFdyaXRlU3RyZWFtKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgclN0cmVhbSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0ocGF0aC5qb2luKCcuLycsIHRoaXMucGF0aCwgaWQpKVxuICAgICAgICAgICAgclN0cmVhbS5waXBlKHN0cmVhbSkub24oJ2Vycm9yJywgKGVycm9yKSA9PiByZWplY3QoZXJyb3IpKS5vbignZmluaXNoJywgKCkgPT4gcmVzb2x2ZSgpKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmcy51bmxpbmsocGF0aC5qb2luKCcuLycsIHRoaXMucGF0aCwgaWQpLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHJlamVjdChlcnJvcilcbiAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXN5bmMgYXJjaGl2ZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdUaGUgc3RvcmFnZSBiYWNrZW5kIGRvZXMgbm90IHN1cHBvcnQgdGhpcyBmdW5jdGlvbicpKVxuICAgICAgICB9KVxuICAgIH1cblxufSJdfQ==