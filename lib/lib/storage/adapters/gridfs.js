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

var _mongodb = require("mongodb");

var GridFS = /*#__PURE__*/function () {
  function GridFS() {
    var _this = this;

    (0, _classCallCheck2["default"])(this, GridFS);
    (0, _defineProperty2["default"])(this, "client", void 0);
    (0, _defineProperty2["default"])(this, "ready", void 0);
    (0, _defineProperty2["default"])(this, "db", void 0);
    (0, _defineProperty2["default"])(this, "bucket", void 0);
    if (process.env.GRIDFS_PATH === undefined) throw Error("GRIDFS_PATH is not a defined env variable!");
    this.client = new _mongodb.MongoClient(process.env.GRIDFS_PATH);
    this.ready = new Promise(function (resolve) {
      _this.client.connect(function () {
        _this.db = _this.client.db("file_storage");
        _this.bucket = new _mongodb.GridFSBucket(_this.db);
        resolve();
      });
    });
  }

  (0, _createClass2["default"])(GridFS, [{
    key: "add",
    value: function () {
      var _add = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(fileStream) {
        var stream;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.ready;

              case 2:
                stream = this.bucket.openUploadStream("untitled");
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  fileStream.pipe(stream).on('finish', function () {
                    resolve(stream.id.toString());
                  }).on('error', function (error) {
                    reject(error);
                  });
                }));

              case 4:
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
        var bucketStream;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.ready;

              case 2:
                bucketStream = this.bucket.openDownloadStream(new _mongodb.ObjectId(id));
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  bucketStream.pipe(stream).on('finish', function () {
                    resolve();
                  }).on('error', function (error) {
                    reject(error);
                  });
                }));

              case 4:
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
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.ready;

              case 2:
                this.bucket["delete"](new _mongodb.ObjectId(id));

              case 3:
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
                throw 'The storage backend does not support this function';

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
  return GridFS;
}();

exports["default"] = GridFS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS9hZGFwdGVycy9ncmlkZnMudHMiXSwibmFtZXMiOlsiR3JpZEZTIiwicHJvY2VzcyIsImVudiIsIkdSSURGU19QQVRIIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJjbGllbnQiLCJNb25nb0NsaWVudCIsInJlYWR5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJjb25uZWN0IiwiZGIiLCJidWNrZXQiLCJHcmlkRlNCdWNrZXQiLCJmaWxlU3RyZWFtIiwic3RyZWFtIiwib3BlblVwbG9hZFN0cmVhbSIsInJlamVjdCIsInBpcGUiLCJvbiIsImlkIiwidG9TdHJpbmciLCJlcnJvciIsImJ1Y2tldFN0cmVhbSIsIm9wZW5Eb3dubG9hZFN0cmVhbSIsIk9iamVjdElkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0lBU3FCQSxNO0FBS2pCLG9CQUFjO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNWLFFBQUlDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxXQUFaLEtBQTRCQyxTQUFoQyxFQUEyQyxNQUFNQyxLQUFLLENBQUMsNENBQUQsQ0FBWDtBQUMzQyxTQUFLQyxNQUFMLEdBQWMsSUFBSUMsb0JBQUosQ0FBZ0JOLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxXQUE1QixDQUFkO0FBQ0EsU0FBS0ssS0FBTCxHQUFhLElBQUlDLE9BQUosQ0FBWSxVQUFBQyxPQUFPLEVBQUk7QUFDaEMsTUFBQSxLQUFJLENBQUNKLE1BQUwsQ0FBWUssT0FBWixDQUFvQixZQUFNO0FBQ3RCLFFBQUEsS0FBSSxDQUFDQyxFQUFMLEdBQVUsS0FBSSxDQUFDTixNQUFMLENBQVlNLEVBQVosQ0FBZSxjQUFmLENBQVY7QUFDQSxRQUFBLEtBQUksQ0FBQ0MsTUFBTCxHQUFjLElBQUlDLHFCQUFKLENBQWlCLEtBQUksQ0FBQ0YsRUFBdEIsQ0FBZDtBQUNBRixRQUFBQSxPQUFPO0FBQ1YsT0FKRDtBQUtILEtBTlksQ0FBYjtBQU9IOzs7OztnSEFFU0ssVTs7Ozs7Ozt1QkFDQSxLQUFLUCxLOzs7QUFDTFEsZ0JBQUFBLE0sR0FBa0MsS0FBS0gsTUFBTCxDQUFZSSxnQkFBWixDQUE2QixVQUE3QixDO2lEQUNqQyxJQUFJUixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVUSxNQUFWLEVBQXFCO0FBQ3BDSCxrQkFBQUEsVUFBVSxDQUFDSSxJQUFYLENBQWdCSCxNQUFoQixFQUF3QkksRUFBeEIsQ0FBMkIsUUFBM0IsRUFBcUMsWUFBTTtBQUN2Q1Ysb0JBQUFBLE9BQU8sQ0FBQ00sTUFBTSxDQUFDSyxFQUFQLENBQVVDLFFBQVYsRUFBRCxDQUFQO0FBQ0gsbUJBRkQsRUFFR0YsRUFGSCxDQUVNLE9BRk4sRUFFZSxVQUFDRyxLQUFELEVBQVc7QUFDdEJMLG9CQUFBQSxNQUFNLENBQUNLLEtBQUQsQ0FBTjtBQUNILG1CQUpEO0FBS0gsaUJBTk0sQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpSEFTREYsRSxFQUFZTCxNOzs7Ozs7O3VCQUNaLEtBQUtSLEs7OztBQUNMZ0IsZ0JBQUFBLFksR0FBdUMsS0FBS1gsTUFBTCxDQUFZWSxrQkFBWixDQUErQixJQUFJQyxpQkFBSixDQUFhTCxFQUFiLENBQS9CLEM7a0RBQ3RDLElBQUlaLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVRLE1BQVYsRUFBcUI7QUFDcENNLGtCQUFBQSxZQUFZLENBQUNMLElBQWIsQ0FBa0JILE1BQWxCLEVBQTBCSSxFQUExQixDQUE2QixRQUE3QixFQUF1QyxZQUFNO0FBQ3pDVixvQkFBQUEsT0FBTztBQUNWLG1CQUZELEVBRUdVLEVBRkgsQ0FFTSxPQUZOLEVBRWUsVUFBQ0csS0FBRCxFQUFXO0FBQ3RCTCxvQkFBQUEsTUFBTSxDQUFDSyxLQUFELENBQU47QUFDSCxtQkFKRDtBQUtILGlCQU5NLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUhBU0VGLEU7Ozs7Ozt1QkFDSCxLQUFLYixLOzs7QUFDWCxxQkFBS0ssTUFBTCxXQUFtQixJQUFJYSxpQkFBSixDQUFhTCxFQUFiLENBQW5COzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FIQUdVQSxFOzs7OztzQkFDSixvRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlYWRTdHJlYW0sIFdyaXRlU3RyZWFtIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgU3RvcmFnZUFkYXB0ZXIgZnJvbSAnLi9pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1xyXG4gICAgRGIsXHJcbiAgICBPYmplY3RJZCxcclxuICAgIE1vbmdvQ2xpZW50LFxyXG4gICAgR3JpZEZTQnVja2V0LFxyXG4gICAgR3JpZEZTQnVja2V0UmVhZFN0cmVhbSxcclxuICAgIEdyaWRGU0J1Y2tldFdyaXRlU3RyZWFtXHJcbn0gZnJvbSAnbW9uZ29kYidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWRGUyBpbXBsZW1lbnRzIFN0b3JhZ2VBZGFwdGVyIHtcclxuICAgIHByaXZhdGUgY2xpZW50OiBNb25nb0NsaWVudDtcclxuICAgIHByaXZhdGUgcmVhZHk6IFByb21pc2U8dm9pZD47XHJcbiAgICBwcml2YXRlIGRiITogRGI7XHJcbiAgICBwcml2YXRlIGJ1Y2tldCE6IEdyaWRGU0J1Y2tldDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5HUklERlNfUEFUSCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcihcIkdSSURGU19QQVRIIGlzIG5vdCBhIGRlZmluZWQgZW52IHZhcmlhYmxlIVwiKTtcclxuICAgICAgICB0aGlzLmNsaWVudCA9IG5ldyBNb25nb0NsaWVudChwcm9jZXNzLmVudi5HUklERlNfUEFUSCk7XHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5jb25uZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGIgPSB0aGlzLmNsaWVudC5kYihcImZpbGVfc3RvcmFnZVwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVja2V0ID0gbmV3IEdyaWRGU0J1Y2tldCh0aGlzLmRiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgYWRkKGZpbGVTdHJlYW06IFJlYWRTdHJlYW0pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVhZHk7XHJcbiAgICAgICAgY29uc3Qgc3RyZWFtOiBHcmlkRlNCdWNrZXRXcml0ZVN0cmVhbSA9IHRoaXMuYnVja2V0Lm9wZW5VcGxvYWRTdHJlYW0oXCJ1bnRpdGxlZFwiKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBmaWxlU3RyZWFtLnBpcGUoc3RyZWFtKS5vbignZmluaXNoJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShzdHJlYW0uaWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH0pLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBnZXQoaWQ6IHN0cmluZywgc3RyZWFtOiBXcml0ZVN0cmVhbSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVhZHk7XHJcbiAgICAgICAgY29uc3QgYnVja2V0U3RyZWFtOiBHcmlkRlNCdWNrZXRSZWFkU3RyZWFtID0gdGhpcy5idWNrZXQub3BlbkRvd25sb2FkU3RyZWFtKG5ldyBPYmplY3RJZChpZCkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGJ1Y2tldFN0cmVhbS5waXBlKHN0cmVhbSkub24oJ2ZpbmlzaCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSkub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBkZWxldGUoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVhZHk7XHJcbiAgICAgICAgdGhpcy5idWNrZXQuZGVsZXRlKG5ldyBPYmplY3RJZChpZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFyY2hpdmUoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHRocm93ICdUaGUgc3RvcmFnZSBiYWNrZW5kIGRvZXMgbm90IHN1cHBvcnQgdGhpcyBmdW5jdGlvbic7XHJcbiAgICB9XHJcbn1cclxuIl19