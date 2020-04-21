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

var _storageBlob = require("@azure/storage-blob");

var _uuid = require("uuid");

var AzureStorage = /*#__PURE__*/function () {
  function AzureStorage() {
    (0, _classCallCheck2["default"])(this, AzureStorage);
    (0, _defineProperty2["default"])(this, "client", void 0);
    (0, _defineProperty2["default"])(this, "bucket", void 0);
    if (process.env.AZURE_ACCOUNT_NAME === undefined) throw Error("AZURE_ACCOUNT_NAME is not a defined env variable!");
    if (process.env.AZURE_ACCOUNT_KEY === undefined) throw Error("AZURE_ACCOUNT_KEY is not a defined env variable!");
    if (process.env.AZURE_CONTAINER_NAME === undefined) throw Error("AZURE_CONTAINER_NAME is not a defined env variable!");
    this.client = new _storageBlob.BlobServiceClient("https://".concat(process.env.AZURE_ACCOUNT_NAME, ".blob.core.windows.net"), new _storageBlob.StorageSharedKeyCredential(process.env.AZURE_ACCOUNT_NAME, process.env.AZURE_ACCOUNT_KEY));
    this.bucket = this.client.getContainerClient(process.env.AZURE_CONTAINER_NAME);
  }

  (0, _createClass2["default"])(AzureStorage, [{
    key: "add",
    value: function () {
      var _add = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(stream) {
        var _this = this;

        var fileId;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                fileId = (0, _uuid.v4)();
                return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
                    var blobClient, uploadResponse;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return _this.bucket.getBlockBlobClient(fileId);

                          case 2:
                            blobClient = _context.sent;
                            uploadResponse = blobClient.uploadStream(stream);
                            uploadResponse.then(function () {
                              resolve(fileId);
                            })["catch"](function (error) {
                              reject(error);
                            });

                          case 5:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2, _x3) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function add(_x) {
        return _add.apply(this, arguments);
      }

      return add;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(id, stream) {
        var _this2 = this;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(resolve, reject) {
                    var _downloadResponse$rea;

                    var blobClient, downloadResponse;
                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return _this2.bucket.getBlockBlobClient(id);

                          case 2:
                            blobClient = _context3.sent;
                            _context3.next = 5;
                            return blobClient.download();

                          case 5:
                            downloadResponse = _context3.sent;
                            (_downloadResponse$rea = downloadResponse.readableStreamBody) === null || _downloadResponse$rea === void 0 ? void 0 : _downloadResponse$rea.pipe(stream).on('error', function (error) {
                              return reject(error);
                            }).on('finish', function () {
                              return resolve();
                            });

                          case 7:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x6, _x7) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function get(_x4, _x5) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(id) {
        var _this3 = this;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(resolve, reject) {
                    var blobClient, _delete;

                    return _regenerator["default"].wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return _this3.bucket.getBlockBlobClient(id);

                          case 2:
                            blobClient = _context5.sent;
                            _delete = blobClient["delete"]();

                            _delete.then(function () {
                              return resolve();
                            })["catch"](function (error) {
                              return reject(error);
                            });

                          case 5:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x9, _x10) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function _delete(_x8) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "archive",
    value: function () {
      var _archive = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(id) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", new Promise(function (resolve, reject) {
                  reject(new Error('The storage backend does not support this function'));
                }));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function archive(_x11) {
        return _archive.apply(this, arguments);
      }

      return archive;
    }()
  }]);
  return AzureStorage;
}();

exports["default"] = AzureStorage;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS9hZGFwdGVycy9henVyZS50cyJdLCJuYW1lcyI6WyJBenVyZVN0b3JhZ2UiLCJwcm9jZXNzIiwiZW52IiwiQVpVUkVfQUNDT1VOVF9OQU1FIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJBWlVSRV9BQ0NPVU5UX0tFWSIsIkFaVVJFX0NPTlRBSU5FUl9OQU1FIiwiY2xpZW50IiwiQmxvYlNlcnZpY2VDbGllbnQiLCJTdG9yYWdlU2hhcmVkS2V5Q3JlZGVudGlhbCIsImJ1Y2tldCIsImdldENvbnRhaW5lckNsaWVudCIsInN0cmVhbSIsImZpbGVJZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0QmxvY2tCbG9iQ2xpZW50IiwiYmxvYkNsaWVudCIsInVwbG9hZFJlc3BvbnNlIiwidXBsb2FkU3RyZWFtIiwidGhlbiIsImVycm9yIiwiaWQiLCJkb3dubG9hZCIsImRvd25sb2FkUmVzcG9uc2UiLCJyZWFkYWJsZVN0cmVhbUJvZHkiLCJwaXBlIiwib24iLCJfZGVsZXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0lBRXFCQSxZO0FBS2pCLDBCQUFjO0FBQUE7QUFBQTtBQUFBO0FBQ1YsUUFBSUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGtCQUFaLEtBQW1DQyxTQUF2QyxFQUFrRCxNQUFNQyxLQUFLLENBQUMsbURBQUQsQ0FBWDtBQUNsRCxRQUFJSixPQUFPLENBQUNDLEdBQVIsQ0FBWUksaUJBQVosS0FBa0NGLFNBQXRDLEVBQWlELE1BQU1DLEtBQUssQ0FBQyxrREFBRCxDQUFYO0FBQ2pELFFBQUlKLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSyxvQkFBWixLQUFxQ0gsU0FBekMsRUFBb0QsTUFBTUMsS0FBSyxDQUFDLHFEQUFELENBQVg7QUFFcEQsU0FBS0csTUFBTCxHQUFjLElBQUlDLDhCQUFKLG1CQUFpQ1IsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGtCQUE3Qyw2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Q0gsaUJBRk0sQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlYWRTdHJlYW0sIFdyaXRlU3RyZWFtIH0gZnJvbSAnZnMnXHJcbmltcG9ydCBTdG9yYWdlQWRhcHRlciBmcm9tICcuL2ludGVyZmFjZSdcclxuaW1wb3J0IHsgQmxvYlNlcnZpY2VDbGllbnQsIFN0b3JhZ2VTaGFyZWRLZXlDcmVkZW50aWFsLCBDb250YWluZXJDbGllbnQgfSBmcm9tICdAYXp1cmUvc3RvcmFnZS1ibG9iJ1xyXG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF6dXJlU3RvcmFnZSBpbXBsZW1lbnRzIFN0b3JhZ2VBZGFwdGVyIHtcclxuICAgIHByaXZhdGUgY2xpZW50OiBCbG9iU2VydmljZUNsaWVudFxyXG4gICAgcHJpdmF0ZSBidWNrZXQ6IENvbnRhaW5lckNsaWVudFxyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuQVpVUkVfQUNDT1VOVF9OQU1FID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKFwiQVpVUkVfQUNDT1VOVF9OQU1FIGlzIG5vdCBhIGRlZmluZWQgZW52IHZhcmlhYmxlIVwiKVxyXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5BWlVSRV9BQ0NPVU5UX0tFWSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcihcIkFaVVJFX0FDQ09VTlRfS0VZIGlzIG5vdCBhIGRlZmluZWQgZW52IHZhcmlhYmxlIVwiKVxyXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5BWlVSRV9DT05UQUlORVJfTkFNRSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcihcIkFaVVJFX0NPTlRBSU5FUl9OQU1FIGlzIG5vdCBhIGRlZmluZWQgZW52IHZhcmlhYmxlIVwiKVxyXG5cclxuICAgICAgICB0aGlzLmNsaWVudCA9IG5ldyBCbG9iU2VydmljZUNsaWVudChgaHR0cHM6Ly8ke3Byb2Nlc3MuZW52LkFaVVJFX0FDQ09VTlRfTkFNRX0uYmxvYi5jb3JlLndpbmRvd3MubmV0YCwgbmV3IFN0b3JhZ2VTaGFyZWRLZXlDcmVkZW50aWFsKHByb2Nlc3MuZW52LkFaVVJFX0FDQ09VTlRfTkFNRSwgcHJvY2Vzcy5lbnYuQVpVUkVfQUNDT1VOVF9LRVkpKVxyXG4gICAgICAgIHRoaXMuYnVja2V0ID0gdGhpcy5jbGllbnQuZ2V0Q29udGFpbmVyQ2xpZW50KHByb2Nlc3MuZW52LkFaVVJFX0NPTlRBSU5FUl9OQU1FKVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFkZChzdHJlYW06IFJlYWRTdHJlYW0pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGNvbnN0IGZpbGVJZCA9IHV1aWQoKVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYmxvYkNsaWVudCA9IGF3YWl0IHRoaXMuYnVja2V0LmdldEJsb2NrQmxvYkNsaWVudChmaWxlSWQpXHJcbiAgICAgICAgICAgIGxldCB1cGxvYWRSZXNwb25zZSA9IGJsb2JDbGllbnQudXBsb2FkU3RyZWFtKHN0cmVhbSlcclxuXHJcbiAgICAgICAgICAgIHVwbG9hZFJlc3BvbnNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShmaWxlSWQpXHJcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZ2V0KGlkOiBzdHJpbmcsIHN0cmVhbTogV3JpdGVTdHJlYW0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYmxvYkNsaWVudCA9IGF3YWl0IHRoaXMuYnVja2V0LmdldEJsb2NrQmxvYkNsaWVudChpZClcclxuICAgICAgICAgICAgbGV0IGRvd25sb2FkUmVzcG9uc2UgPSBhd2FpdCBibG9iQ2xpZW50LmRvd25sb2FkKClcclxuXHJcbiAgICAgICAgICAgIGRvd25sb2FkUmVzcG9uc2UucmVhZGFibGVTdHJlYW1Cb2R5Py5waXBlKHN0cmVhbSkub24oJ2Vycm9yJywgKGVycm9yKSA9PiByZWplY3QoZXJyb3IpKS5vbignZmluaXNoJywgKCkgPT4gcmVzb2x2ZSgpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZGVsZXRlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYmxvYkNsaWVudCA9IGF3YWl0IHRoaXMuYnVja2V0LmdldEJsb2NrQmxvYkNsaWVudChpZClcclxuICAgICAgICAgICAgbGV0IF9kZWxldGUgPSBibG9iQ2xpZW50LmRlbGV0ZSgpXHJcblxyXG4gICAgICAgICAgICBfZGVsZXRlLnRoZW4oKCkgPT4gcmVzb2x2ZSgpKS5jYXRjaCgoZXJyb3IpID0+IHJlamVjdChlcnJvcikpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBhcmNoaXZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdUaGUgc3RvcmFnZSBiYWNrZW5kIGRvZXMgbm90IHN1cHBvcnQgdGhpcyBmdW5jdGlvbicpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0iXX0=