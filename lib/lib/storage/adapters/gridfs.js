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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS9hZGFwdGVycy9ncmlkZnMudHMiXSwibmFtZXMiOlsiR3JpZEZTIiwicHJvY2VzcyIsImVudiIsIkdSSURGU19QQVRIIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJjbGllbnQiLCJNb25nb0NsaWVudCIsInJlYWR5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJjb25uZWN0IiwiZGIiLCJidWNrZXQiLCJHcmlkRlNCdWNrZXQiLCJmaWxlU3RyZWFtIiwic3RyZWFtIiwib3BlblVwbG9hZFN0cmVhbSIsInJlamVjdCIsInBpcGUiLCJvbiIsImlkIiwidG9TdHJpbmciLCJlcnJvciIsImJ1Y2tldFN0cmVhbSIsIm9wZW5Eb3dubG9hZFN0cmVhbSIsIk9iamVjdElkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0lBU3FCQSxNO0FBS2pCLG9CQUFjO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNWLFFBQUlDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxXQUFaLEtBQTRCQyxTQUFoQyxFQUEyQyxNQUFNQyxLQUFLLENBQUMsNENBQUQsQ0FBWDtBQUMzQyxTQUFLQyxNQUFMLEdBQWMsSUFBSUMsb0JBQUosQ0FBZ0JOLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxXQUE1QixDQUFkO0FBQ0EsU0FBS0ssS0FBTCxHQUFhLElBQUlDLE9BQUosQ0FBWSxVQUFBQyxPQUFPLEVBQUk7QUFDaEMsTUFBQSxLQUFJLENBQUNKLE1BQUwsQ0FBWUssT0FBWixDQUFvQixZQUFNO0FBQ3RCLFFBQUEsS0FBSSxDQUFDQyxFQUFMLEdBQVUsS0FBSSxDQUFDTixNQUFMLENBQVlNLEVBQVosQ0FBZSxjQUFmLENBQVY7QUFDQSxRQUFBLEtBQUksQ0FBQ0MsTUFBTCxHQUFjLElBQUlDLHFCQUFKLENBQWlCLEtBQUksQ0FBQ0YsRUFBdEIsQ0FBZDtBQUNBRixRQUFBQSxPQUFPO0FBQ1YsT0FKRDtBQUtILEtBTlksQ0FBYjtBQU9IOzs7OztnSEFFU0ssVTs7Ozs7Ozt1QkFDQSxLQUFLUCxLOzs7QUFDTFEsZ0JBQUFBLE0sR0FBa0MsS0FBS0gsTUFBTCxDQUFZSSxnQkFBWixDQUE2QixVQUE3QixDO2lEQUNqQyxJQUFJUixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVUSxNQUFWLEVBQXFCO0FBQ3BDSCxrQkFBQUEsVUFBVSxDQUFDSSxJQUFYLENBQWdCSCxNQUFoQixFQUF3QkksRUFBeEIsQ0FBMkIsUUFBM0IsRUFBcUMsWUFBTTtBQUN2Q1Ysb0JBQUFBLE9BQU8sQ0FBQ00sTUFBTSxDQUFDSyxFQUFQLENBQVVDLFFBQVYsRUFBRCxDQUFQO0FBQ0gsbUJBRkQsRUFFR0YsRUFGSCxDQUVNLE9BRk4sRUFFZSxVQUFDRyxLQUFELEVBQVc7QUFDdEJMLG9CQUFBQSxNQUFNLENBQUNLLEtBQUQsQ0FBTjtBQUNILG1CQUpEO0FBS0gsaUJBTk0sQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpSEFTREYsRSxFQUFZTCxNOzs7Ozs7O3VCQUNaLEtBQUtSLEs7OztBQUNMZ0IsZ0JBQUFBLFksR0FBdUMsS0FBS1gsTUFBTCxDQUFZWSxrQkFBWixDQUErQixJQUFJQyxpQkFBSixDQUFhTCxFQUFiLENBQS9CLEM7a0RBQ3RDLElBQUlaLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVRLE1BQVYsRUFBcUI7QUFDcENNLGtCQUFBQSxZQUFZLENBQUNMLElBQWIsQ0FBa0JILE1BQWxCLEVBQTBCSSxFQUExQixDQUE2QixRQUE3QixFQUF1QyxZQUFNO0FBQ3pDVixvQkFBQUEsT0FBTztBQUNWLG1CQUZELEVBRUdVLEVBRkgsQ0FFTSxPQUZOLEVBRWUsVUFBQ0csS0FBRCxFQUFXO0FBQ3RCTCxvQkFBQUEsTUFBTSxDQUFDSyxLQUFELENBQU47QUFDSCxtQkFKRDtBQUtILGlCQU5NLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUhBU0VGLEU7Ozs7Ozt1QkFDSCxLQUFLYixLOzs7QUFDWCxxQkFBS0ssTUFBTCxXQUFtQixJQUFJYSxpQkFBSixDQUFhTCxFQUFiLENBQW5COzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FIQUdVQSxFOzs7OztzQkFDSixvRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlYWRTdHJlYW0sIFdyaXRlU3RyZWFtIH0gZnJvbSAnZnMnO1xuaW1wb3J0IFN0b3JhZ2VBZGFwdGVyIGZyb20gJy4vaW50ZXJmYWNlJztcbmltcG9ydCB7XG4gICAgRGIsXG4gICAgT2JqZWN0SWQsXG4gICAgTW9uZ29DbGllbnQsXG4gICAgR3JpZEZTQnVja2V0LFxuICAgIEdyaWRGU0J1Y2tldFJlYWRTdHJlYW0sXG4gICAgR3JpZEZTQnVja2V0V3JpdGVTdHJlYW1cbn0gZnJvbSAnbW9uZ29kYidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZEZTIGltcGxlbWVudHMgU3RvcmFnZUFkYXB0ZXIge1xuICAgIHByaXZhdGUgY2xpZW50OiBNb25nb0NsaWVudDtcbiAgICBwcml2YXRlIHJlYWR5OiBQcm9taXNlPHZvaWQ+O1xuICAgIHByaXZhdGUgZGIhOiBEYjtcbiAgICBwcml2YXRlIGJ1Y2tldCE6IEdyaWRGU0J1Y2tldDtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52LkdSSURGU19QQVRIID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKFwiR1JJREZTX1BBVEggaXMgbm90IGEgZGVmaW5lZCBlbnYgdmFyaWFibGUhXCIpO1xuICAgICAgICB0aGlzLmNsaWVudCA9IG5ldyBNb25nb0NsaWVudChwcm9jZXNzLmVudi5HUklERlNfUEFUSCk7XG4gICAgICAgIHRoaXMucmVhZHkgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LmNvbm5lY3QoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZGIgPSB0aGlzLmNsaWVudC5kYihcImZpbGVfc3RvcmFnZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1Y2tldCA9IG5ldyBHcmlkRlNCdWNrZXQodGhpcy5kYik7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGFkZChmaWxlU3RyZWFtOiBSZWFkU3RyZWFtKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5yZWFkeTtcbiAgICAgICAgY29uc3Qgc3RyZWFtOiBHcmlkRlNCdWNrZXRXcml0ZVN0cmVhbSA9IHRoaXMuYnVja2V0Lm9wZW5VcGxvYWRTdHJlYW0oXCJ1bnRpdGxlZFwiKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZpbGVTdHJlYW0ucGlwZShzdHJlYW0pLm9uKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShzdHJlYW0uaWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9KS5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0KGlkOiBzdHJpbmcsIHN0cmVhbTogV3JpdGVTdHJlYW0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5yZWFkeTtcbiAgICAgICAgY29uc3QgYnVja2V0U3RyZWFtOiBHcmlkRlNCdWNrZXRSZWFkU3RyZWFtID0gdGhpcy5idWNrZXQub3BlbkRvd25sb2FkU3RyZWFtKG5ldyBPYmplY3RJZChpZCkpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgYnVja2V0U3RyZWFtLnBpcGUoc3RyZWFtKS5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVsZXRlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5yZWFkeTtcbiAgICAgICAgdGhpcy5idWNrZXQuZGVsZXRlKG5ldyBPYmplY3RJZChpZCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGFyY2hpdmUoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aHJvdyAnVGhlIHN0b3JhZ2UgYmFja2VuZCBkb2VzIG5vdCBzdXBwb3J0IHRoaXMgZnVuY3Rpb24nO1xuICAgIH1cbn1cbiJdfQ==