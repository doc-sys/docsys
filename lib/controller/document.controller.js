"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shareFile = exports.downloadFile = exports.unlockFile = exports.lockFile = exports.checkFileOwnership = exports.checkPermissionToFile = exports.uploadFiles = exports.createNewDocument = exports.getSingleDocument = exports.getAllDocuments = exports.getSharedDocuments = exports.getOwnDocuments = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fileType = require("file-type");

var _stream = require("stream");

var archive = _interopRequireWildcard(require("archiver"));

var _error = require("../lib/helpers/error");

var _adapters = _interopRequireDefault(require("../lib/storage/adapters"));

var _document = require("../models/document");

var storage = (0, _adapters["default"])();

//Model Find Operations
var getOwnDocuments = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var docs;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (res.locals.auth_user) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", next(new _error.ErrorHandler(500, "Can't access user property")));

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return _document.doc.find({
              owner: res.locals.auth_user._id
            }).sort(req.body.sorted || req.query.sorted || '-dated').select('title dated fileId locked');

          case 5:
            docs = _context.sent;
            res.locals.docs = docs;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            return _context.abrupt("return", next(new _error.ErrorHandler(500, _context.t0.message)));

          case 12:
            next();

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));

  return function getOwnDocuments(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.getOwnDocuments = getOwnDocuments;

var getSharedDocuments = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var docs;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (res.locals.auth_user) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", next(new _error.ErrorHandler(500, "Can't access user property")));

          case 2:
            _context2.prev = 2;
            _context2.next = 5;
            return _document.doc.find({
              sharedWith: res.locals.auth_user._id
            }).sort(req.body.sorted || req.query.sorted || '-dated').populate('owner').select('title dated fileId locked owner.username owner.avatar');

          case 5:
            docs = _context2.sent;
            res.locals.docs = docs;
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](2);
            return _context2.abrupt("return", next(new _error.ErrorHandler(500, _context2.t0.message)));

          case 12:
            next();

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 9]]);
  }));

  return function getSharedDocuments(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getSharedDocuments = getSharedDocuments;

var getAllDocuments = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var allDocs;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _document.doc.find({}).populate('owner');

          case 3:
            allDocs = _context3.sent;
            res.locals.docs = allDocs;
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", next(new _error.ErrorHandler(500, "Error getting documents: ".concat(_context3.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function getAllDocuments(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getAllDocuments = getAllDocuments;

var getSingleDocument = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var document;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _document.doc.findOne({
              fileId: req.params.fileid
            }).populate('owner').populate('lockedBy').populate('sharedWith').populate('log.user');

          case 3:
            document = _context4.sent;
            res.locals.doc = document;
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            return _context4.abrupt("return", next(new _error.ErrorHandler(500, "Error getting file: ".concat(_context4.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function getSingleDocument(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}(); //Create And Update Model


exports.getSingleDocument = getSingleDocument;

var createNewDocument = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var newDoc;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            newDoc = new _document.doc(req.body);
            _context5.next = 4;
            return newDoc.save();

          case 4:
            res.locals.doc = _context5.sent;
            _context5.next = 10;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            return _context5.abrupt("return", next(new _error.ErrorHandler(500, "Error creating document: ".concat(_context5.t0.message))));

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 7]]);
  }));

  return function createNewDocument(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.createNewDocument = createNewDocument;

var uploadFiles = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (['pdf', 'jpg', 'jpeg', 'png', 'tiff'].includes((0, _fileType.fromBuffer)(req.files[0].buffer))) {
              _context7.next = 2;
              break;
            }

            return _context7.abrupt("return", next(new _error.ErrorHandler(415, "Filetype ".concat((0, _fileType.fromBuffer)(req.files[0].buffer), " not supported"))));

          case 2:
            _context7.prev = 2;
            req.files.forEach( /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(file, i) {
                var bStream, pageId;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        bStream = new _stream.PassThrough();
                        bStream.end(file.buffer);
                        _context6.next = 4;
                        return storage.add(bStream);

                      case 4:
                        pageId = _context6.sent;
                        res.locals.doc.pageHashes = [];
                        res.locals.doc.pageHashes.push(pageId);

                      case 7:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x19, _x20) {
                return _ref7.apply(this, arguments);
              };
            }());
            _context7.next = 6;
            return res.locals.doc.save();

          case 6:
            next();
            _context7.next = 12;
            break;

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](2);
            return _context7.abrupt("return", next(new _error.ErrorHandler(500, "Error handling file upload: ".concat(_context7.t0.message))));

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[2, 9]]);
  }));

  return function uploadFiles(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}(); // Lock Operations


exports.uploadFiles = uploadFiles;

var checkPermissionToFile = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!(!(res.locals.auth_user == res.locals.doc.owner.username || res.locals.doc.sharedWith.includes(res.locals.auth_user)) || res.locals.doc.locked)) {
              _context8.next = 2;
              break;
            }

            return _context8.abrupt("return", next(new _error.ErrorHandler(401, "File can't be checked out by you")));

          case 2:
            next();

          case 3:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function checkPermissionToFile(_x21, _x22, _x23) {
    return _ref8.apply(this, arguments);
  };
}();

exports.checkPermissionToFile = checkPermissionToFile;

var checkFileOwnership = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (res.locals.auth_user._id == res.locals.dox.owner._id) {
              _context9.next = 2;
              break;
            }

            return _context9.abrupt("return", next(new _error.ErrorHandler(401, 'You are not permitted to acces this file')));

          case 2:
            next();

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function checkFileOwnership(_x24, _x25, _x26) {
    return _ref9.apply(this, arguments);
  };
}();

exports.checkFileOwnership = checkFileOwnership;

var lockFile = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            res.locals.doc.lockedBy = res.locals.auth_user;
            res.locals.doc.locked = true;
            _context10.next = 5;
            return res.locals.doc.save();

          case 5:
            _context10.next = 10;
            break;

          case 7:
            _context10.prev = 7;
            _context10.t0 = _context10["catch"](0);
            return _context10.abrupt("return", next(new _error.ErrorHandler(500, "Error locking file: ".concat(_context10.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 7]]);
  }));

  return function lockFile(_x27, _x28, _x29) {
    return _ref10.apply(this, arguments);
  };
}();

exports.lockFile = lockFile;

var unlockFile = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            res.locals.doc.lockedBy = null;
            res.locals.doc.locked = false;
            _context11.next = 5;
            return res.locals.doc.save();

          case 5:
            _context11.next = 10;
            break;

          case 7:
            _context11.prev = 7;
            _context11.t0 = _context11["catch"](0);
            return _context11.abrupt("return", next(new _error.ErrorHandler(500, "Error unlocking file: ".concat(_context11.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 7]]);
  }));

  return function unlockFile(_x30, _x31, _x32) {
    return _ref11.apply(this, arguments);
  };
}(); // File download


exports.unlockFile = unlockFile;

var downloadFile = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var zip;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            _context13.next = 3;
            return archive('zip');

          case 3:
            zip = _context13.sent;
            _context13.next = 6;
            return Promise.all(res.locals.doc.pageHashes.forEach( /*#__PURE__*/function () {
              var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(element) {
                var buffer;
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return storage.get(element);

                      case 2:
                        buffer = _context12.sent;
                        zip.append();

                      case 4:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function (_x36) {
                return _ref13.apply(this, arguments);
              };
            }()));

          case 6:
            res.locals.zip = zip;
            _context13.next = 12;
            break;

          case 9:
            _context13.prev = 9;
            _context13.t0 = _context13["catch"](0);
            return _context13.abrupt("return", next(new _error.ErrorHandler(500, "Error downloading file; ".concat(_context13.t0.message))));

          case 12:
            next();

          case 13:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 9]]);
  }));

  return function downloadFile(_x33, _x34, _x35) {
    return _ref12.apply(this, arguments);
  };
}(); // Share


exports.downloadFile = downloadFile;

var shareFile = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var userToShare;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            userToShare = req.body.userToShare || req.query.userToShare;
            res.locals.doc.sharedWith.push(userToShare._id);
            _context14.next = 5;
            return res.locals.doc.save();

          case 5:
            _context14.next = 10;
            break;

          case 7:
            _context14.prev = 7;
            _context14.t0 = _context14["catch"](0);
            return _context14.abrupt("return", next(new _error.ErrorHandler(500, "Error sharing file: ".concat(_context14.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[0, 7]]);
  }));

  return function shareFile(_x37, _x38, _x39) {
    return _ref14.apply(this, arguments);
  };
}();

exports.shareFile = shareFile;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsic3RvcmFnZSIsImdldE93bkRvY3VtZW50cyIsInJlcSIsInJlcyIsIm5leHQiLCJsb2NhbHMiLCJhdXRoX3VzZXIiLCJFcnJvckhhbmRsZXIiLCJkb2MiLCJmaW5kIiwib3duZXIiLCJfaWQiLCJzb3J0IiwiYm9keSIsInNvcnRlZCIsInF1ZXJ5Iiwic2VsZWN0IiwiZG9jcyIsIm1lc3NhZ2UiLCJnZXRTaGFyZWREb2N1bWVudHMiLCJzaGFyZWRXaXRoIiwicG9wdWxhdGUiLCJnZXRBbGxEb2N1bWVudHMiLCJhbGxEb2NzIiwiZ2V0U2luZ2xlRG9jdW1lbnQiLCJmaW5kT25lIiwiZmlsZUlkIiwicGFyYW1zIiwiZmlsZWlkIiwiZG9jdW1lbnQiLCJjcmVhdGVOZXdEb2N1bWVudCIsIm5ld0RvYyIsInNhdmUiLCJ1cGxvYWRGaWxlcyIsImluY2x1ZGVzIiwiZmlsZXMiLCJidWZmZXIiLCJmb3JFYWNoIiwiZmlsZSIsImkiLCJiU3RyZWFtIiwiUGFzc1Rocm91Z2giLCJlbmQiLCJhZGQiLCJwYWdlSWQiLCJwYWdlSGFzaGVzIiwicHVzaCIsImNoZWNrUGVybWlzc2lvblRvRmlsZSIsInVzZXJuYW1lIiwibG9ja2VkIiwiY2hlY2tGaWxlT3duZXJzaGlwIiwiZG94IiwibG9ja0ZpbGUiLCJsb2NrZWRCeSIsInVubG9ja0ZpbGUiLCJkb3dubG9hZEZpbGUiLCJhcmNoaXZlIiwiemlwIiwiUHJvbWlzZSIsImFsbCIsImVsZW1lbnQiLCJnZXQiLCJhcHBlbmQiLCJzaGFyZUZpbGUiLCJ1c2VyVG9TaGFyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBSUE7O0FBRkEsSUFBTUEsT0FBTyxHQUFHLDJCQUFoQjs7QUFJQTtBQUNPLElBQU1DLGVBQWU7QUFBQSwyRkFBRyxpQkFBT0MsR0FBUCxFQUFxQkMs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QUFBO0FBQUEsK0NBT1Y1QixJQUFJLENBQUMsSUFBSUcsbUJBQUosQ0FBaUIsR0FBakIsZ0NBQTZDLGNBQWlCVyxPQUE5RCxFQUFELENBUE07O0FBQUE7QUFVckJkLFlBQUFBLElBQUk7O0FBVmlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUg7O0FBQUEsa0JBQVQyRCxTQUFTO0FBQUE7QUFBQTtBQUFBLEdBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcywgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSBcImV4cHJlc3NcIlxyXG5pbXBvcnQgeyBmcm9tQnVmZmVyIGFzIGZpbGV0eXBlRnJvbUJ1ZmZlciB9IGZyb20gJ2ZpbGUtdHlwZSdcclxuaW1wb3J0IHsgUGFzc1Rocm91Z2ggfSBmcm9tICdzdHJlYW0nXHJcbmltcG9ydCAqIGFzIGFyY2hpdmUgZnJvbSAnYXJjaGl2ZXInXHJcblxyXG5pbXBvcnQgeyBFcnJvckhhbmRsZXIgfSBmcm9tICcuLi9saWIvaGVscGVycy9lcnJvcidcclxuaW1wb3J0IGdldFN0b3JhZ2UgZnJvbSAnLi4vbGliL3N0b3JhZ2UvYWRhcHRlcnMnXHJcblxyXG5jb25zdCBzdG9yYWdlID0gZ2V0U3RvcmFnZSgpXHJcblxyXG5pbXBvcnQgeyBkb2MgfSBmcm9tICcuLi9tb2RlbHMvZG9jdW1lbnQnXHJcblxyXG4vL01vZGVsIEZpbmQgT3BlcmF0aW9uc1xyXG5leHBvcnQgY29uc3QgZ2V0T3duRG9jdW1lbnRzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBkb2NzID0gYXdhaXQgZG9jLmZpbmQoeyBvd25lcjogcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkIH0pLnNvcnQocmVxLmJvZHkuc29ydGVkIHx8IHJlcS5xdWVyeS5zb3J0ZWQgfHwgJy1kYXRlZCcpLnNlbGVjdCgndGl0bGUgZGF0ZWQgZmlsZUlkIGxvY2tlZCcpXHJcbiAgICAgICAgcmVzLmxvY2Fscy5kb2NzID0gZG9jc1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNoYXJlZERvY3VtZW50cyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgaWYgKCFyZXMubG9jYWxzLmF1dGhfdXNlcikgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIFwiQ2FuJ3QgYWNjZXNzIHVzZXIgcHJvcGVydHlcIikpXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgZG9jcyA9IGF3YWl0IGRvYy5maW5kKHsgc2hhcmVkV2l0aDogcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkIH0pLnNvcnQocmVxLmJvZHkuc29ydGVkIHx8IHJlcS5xdWVyeS5zb3J0ZWQgfHwgJy1kYXRlZCcpLnBvcHVsYXRlKCdvd25lcicpLnNlbGVjdCgndGl0bGUgZGF0ZWQgZmlsZUlkIGxvY2tlZCBvd25lci51c2VybmFtZSBvd25lci5hdmF0YXInKVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZG9jcyA9IGRvY3NcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIChlcnJvciBhcyBFcnJvcikubWVzc2FnZSkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxEb2N1bWVudHMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGFsbERvY3MgPSBhd2FpdCBkb2MuZmluZCh7fSkucG9wdWxhdGUoJ293bmVyJylcclxuICAgICAgICByZXMubG9jYWxzLmRvY3MgPSBhbGxEb2NzXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZ2V0dGluZyBkb2N1bWVudHM6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0U2luZ2xlRG9jdW1lbnQgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGRvY3VtZW50ID0gYXdhaXQgZG9jLmZpbmRPbmUoeyBmaWxlSWQ6IHJlcS5wYXJhbXMuZmlsZWlkIH0pXHJcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnb3duZXInKVxyXG4gICAgICAgICAgICAucG9wdWxhdGUoJ2xvY2tlZEJ5JylcclxuICAgICAgICAgICAgLnBvcHVsYXRlKCdzaGFyZWRXaXRoJylcclxuICAgICAgICAgICAgLnBvcHVsYXRlKCdsb2cudXNlcicpXHJcbiAgICAgICAgcmVzLmxvY2Fscy5kb2MgPSBkb2N1bWVudFxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vQ3JlYXRlIEFuZCBVcGRhdGUgTW9kZWxcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVOZXdEb2N1bWVudCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgbmV3RG9jID0gbmV3IGRvYyhyZXEuYm9keSlcclxuICAgICAgICByZXMubG9jYWxzLmRvYyA9IGF3YWl0IG5ld0RvYy5zYXZlKClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjcmVhdGluZyBkb2N1bWVudDogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1cGxvYWRGaWxlcyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgaWYgKCEoWydwZGYnLCAnanBnJywgJ2pwZWcnLCAncG5nJywgJ3RpZmYnXS5pbmNsdWRlcyhmaWxldHlwZUZyb21CdWZmZXIocmVxLmZpbGVzWzBdLmJ1ZmZlcikgYXMgYW55KSkpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDE1LCBgRmlsZXR5cGUgJHtmaWxldHlwZUZyb21CdWZmZXIocmVxLmZpbGVzWzBdLmJ1ZmZlcil9IG5vdCBzdXBwb3J0ZWRgKSlcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJlcS5maWxlcy5mb3JFYWNoKGFzeW5jIChmaWxlOiBhbnksIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYlN0cmVhbSA9IG5ldyBQYXNzVGhyb3VnaCgpXHJcbiAgICAgICAgICAgIGJTdHJlYW0uZW5kKGZpbGUuYnVmZmVyKVxyXG5cclxuICAgICAgICAgICAgbGV0IHBhZ2VJZCA9IGF3YWl0IHN0b3JhZ2UuYWRkKGJTdHJlYW0pXHJcblxyXG4gICAgICAgICAgICByZXMubG9jYWxzLmRvYy5wYWdlSGFzaGVzID0gW11cclxuICAgICAgICAgICAgcmVzLmxvY2Fscy5kb2MucGFnZUhhc2hlcy5wdXNoKHBhZ2VJZClcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmRvYy5zYXZlKClcclxuICAgICAgICBuZXh0KClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBoYW5kbGluZyBmaWxlIHVwbG9hZDogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIExvY2sgT3BlcmF0aW9uc1xyXG5cclxuZXhwb3J0IGNvbnN0IGNoZWNrUGVybWlzc2lvblRvRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgaWYgKCEocmVzLmxvY2Fscy5hdXRoX3VzZXIgPT0gcmVzLmxvY2Fscy5kb2Mub3duZXIudXNlcm5hbWUgfHwgcmVzLmxvY2Fscy5kb2Muc2hhcmVkV2l0aC5pbmNsdWRlcyhyZXMubG9jYWxzLmF1dGhfdXNlcikpIHx8IHJlcy5sb2NhbHMuZG9jLmxvY2tlZCkgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDEsIFwiRmlsZSBjYW4ndCBiZSBjaGVja2VkIG91dCBieSB5b3VcIikpXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNoZWNrRmlsZU93bmVyc2hpcCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgaWYgKCEocmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkID09IHJlcy5sb2NhbHMuZG94Lm93bmVyLl9pZCkpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAxLCAnWW91IGFyZSBub3QgcGVybWl0dGVkIHRvIGFjY2VzIHRoaXMgZmlsZScpKVxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBsb2NrRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXMubG9jYWxzLmRvYy5sb2NrZWRCeSA9IHJlcy5sb2NhbHMuYXV0aF91c2VyXHJcbiAgICAgICAgcmVzLmxvY2Fscy5kb2MubG9ja2VkID0gdHJ1ZVxyXG4gICAgICAgIGF3YWl0IHJlcy5sb2NhbHMuZG9jLnNhdmUoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGxvY2tpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1bmxvY2tGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJlcy5sb2NhbHMuZG9jLmxvY2tlZEJ5ID0gbnVsbFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZG9jLmxvY2tlZCA9IGZhbHNlXHJcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5kb2Muc2F2ZSgpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgdW5sb2NraW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG4vLyBGaWxlIGRvd25sb2FkXHJcblxyXG5leHBvcnQgY29uc3QgZG93bmxvYWRGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCB6aXAgPSBhd2FpdCBhcmNoaXZlKCd6aXAnKVxyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgICAgICByZXMubG9jYWxzLmRvYy5wYWdlSGFzaGVzLmZvckVhY2goYXN5bmMgZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnVmZmVyID0gYXdhaXQgc3RvcmFnZS5nZXQoZWxlbWVudClcclxuICAgICAgICAgICAgICAgIHppcC5hcHBlbmQoKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgcmVzLmxvY2Fscy56aXAgPSB6aXBcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBkb3dubG9hZGluZyBmaWxlOyAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuLy8gU2hhcmVcclxuXHJcbmV4cG9ydCBjb25zdCBzaGFyZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHVzZXJUb1NoYXJlID0gcmVxLmJvZHkudXNlclRvU2hhcmUgfHwgcmVxLnF1ZXJ5LnVzZXJUb1NoYXJlXHJcbiAgICAgICAgcmVzLmxvY2Fscy5kb2Muc2hhcmVkV2l0aC5wdXNoKHVzZXJUb1NoYXJlLl9pZClcclxuXHJcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5kb2Muc2F2ZSgpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3Igc2hhcmluZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufSJdfQ==