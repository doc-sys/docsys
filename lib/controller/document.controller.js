"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shareFile = exports.downloadFile = exports.unlockFile = exports.lockFile = exports.checkFileOwnership = exports.checkPermissionToFile = exports.uploadFiles = exports.createNewFile = exports.deleteSingleFile = exports.getSingleFile = exports.getAllFiles = exports.getSharedFiles = exports.getOwnFiles = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fileType = require("file-type");

var _stream = require("stream");

var _error = require("../lib/helpers/error");

var _adapters = _interopRequireDefault(require("../lib/storage/adapters"));

var _file = require("../models/file");

var _uuid = require("uuid");

var storage = (0, _adapters["default"])();

//Model Find Operations
var getOwnFiles = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var files;
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
            return _file.File.find({
              owner: res.locals.auth_user._id
            }).sort(req.body.sorted || req.query.sorted || '-dated').populate('owner').select('title dated fileId locked extension owner.settings.displayName owner.avatar');

          case 5:
            files = _context.sent;
            res.locals.files = files;
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

  return function getOwnFiles(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.getOwnFiles = getOwnFiles;

var getSharedFiles = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var files;
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
            return _file.File.find({
              sharedWith: res.locals.auth_user._id
            }).sort(req.body.sorted || req.query.sorted || '-dated').populate('owner').select('title dated fileId locked extension owner.username owner.avatar');

          case 5:
            files = _context2.sent;
            res.locals.files = files;
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

  return function getSharedFiles(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getSharedFiles = getSharedFiles;

var getAllFiles = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var allFiles;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _file.File.find({}).populate('owner');

          case 3:
            allFiles = _context3.sent;
            res.locals.files = allFiles;
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

  return function getAllFiles(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getAllFiles = getAllFiles;

var getSingleFile = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _file.File.findOne({
              fileId: req.params.fileid
            }).populate('owner').populate('lockedBy').populate('sharedWith').populate('log.user');

          case 3:
            res.locals.file = _context4.sent;
            _context4.next = 9;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            return _context4.abrupt("return", next(new _error.ErrorHandler(500, "Error getting file: ".concat(_context4.t0.message))));

          case 9:
            next();

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 6]]);
  }));

  return function getSingleFile(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getSingleFile = getSingleFile;

var deleteSingleFile = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var fileId;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            fileId = req.params.fileid || req.body.fileid || req.query.fileid;
            _context5.next = 4;
            return _file.File.findOneAndDelete({
              fileId: fileId
            });

          case 4:
            res.locals.file = _context5.sent;
            _context5.next = 7;
            return storage["delete"](res.locals.file.fileStorageId);

          case 7:
            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](0);
            return _context5.abrupt("return", next(new _error.ErrorHandler(500, "Error deleting file: ".concat(_context5.t0.message))));

          case 12:
            next();

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 9]]);
  }));

  return function deleteSingleFile(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}(); //Create And Update Model


exports.deleteSingleFile = deleteSingleFile;

var createNewFile = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var fileid, file;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            fileid = (0, _uuid.v4)();
            file = new _file.File(req.body);
            file.owner = res.locals.auth_user._id;
            file.fileId = fileid;
            _context6.next = 7;
            return file.save();

          case 7:
            res.locals.file = _context6.sent;
            _context6.next = 13;
            break;

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](0);
            return _context6.abrupt("return", next(new _error.ErrorHandler(500, "Error creating document: ".concat(_context6.t0.message))));

          case 13:
            next();

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 10]]);
  }));

  return function createNewFile(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.createNewFile = createNewFile;

var uploadFiles = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var filetype, bStream, storageId;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return (0, _fileType.fromBuffer)(req.file.buffer);

          case 3:
            filetype = _context7.sent;
            bStream = new _stream.PassThrough();
            bStream.end(req.file.buffer);
            _context7.next = 8;
            return storage.add(bStream);

          case 8:
            storageId = _context7.sent;
            res.locals.file.fileStorageId = storageId;
            res.locals.file.mime = filetype === null || filetype === void 0 ? void 0 : filetype.mime;
            res.locals.file.extension = filetype === null || filetype === void 0 ? void 0 : filetype.ext;
            res.locals.file.save();
            delete res.locals.file.fileStorageId;
            _context7.next = 20;
            break;

          case 16:
            _context7.prev = 16;
            _context7.t0 = _context7["catch"](0);
            console.error(_context7.t0);
            return _context7.abrupt("return", next(new _error.ErrorHandler(500, "Error handling file upload: ".concat(_context7.t0.message))));

          case 20:
            next();

          case 21:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 16]]);
  }));

  return function uploadFiles(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}(); // Lock Operations


exports.uploadFiles = uploadFiles;

var checkPermissionToFile = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!(!(res.locals.auth_user.username == res.locals.file.owner.username || res.locals.file.sharedWith.includes(res.locals.auth_user)) || res.locals.file.locked)) {
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

  return function checkPermissionToFile(_x22, _x23, _x24) {
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
            if (res.locals.auth_user._id == res.locals.file.owner._id) {
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

  return function checkFileOwnership(_x25, _x26, _x27) {
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
            res.locals.file.lockedBy = res.locals.auth_user;
            res.locals.file.locked = true;
            _context10.next = 5;
            return res.locals.file.save();

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

  return function lockFile(_x28, _x29, _x30) {
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
            res.locals.file.lockedBy = null;
            res.locals.file.locked = false;
            _context11.next = 5;
            return res.locals.file.save();

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

  return function unlockFile(_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}(); // File download


exports.unlockFile = unlockFile;

var downloadFile = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            _context12.next = 3;
            return storage.get(res.locals.file.fileStorageId);

          case 3:
            res.locals.fileBuffer = _context12.sent;
            _context12.next = 9;
            break;

          case 6:
            _context12.prev = 6;
            _context12.t0 = _context12["catch"](0);
            return _context12.abrupt("return", next(new _error.ErrorHandler(500, "Error downloading file; ".concat(_context12.t0.message))));

          case 9:
            next();

          case 10:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 6]]);
  }));

  return function downloadFile(_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}(); // Share


exports.downloadFile = downloadFile;

var shareFile = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var userToShare;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            userToShare = req.body.userToShare || req.query.userToShare;
            res.locals.file.sharedWith.push(userToShare._id);
            _context13.next = 5;
            return res.locals.file.save();

          case 5:
            _context13.next = 10;
            break;

          case 7:
            _context13.prev = 7;
            _context13.t0 = _context13["catch"](0);
            return _context13.abrupt("return", next(new _error.ErrorHandler(500, "Error sharing file: ".concat(_context13.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 7]]);
  }));

  return function shareFile(_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}();

exports.shareFile = shareFile;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsic3RvcmFnZSIsImdldE93bkZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImxvY2FscyIsImF1dGhfdXNlciIsIkVycm9ySGFuZGxlciIsIkZpbGUiLCJmaW5kIiwib3duZXIiLCJfaWQiLCJzb3J0IiwiYm9keSIsInNvcnRlZCIsInF1ZXJ5IiwicG9wdWxhdGUiLCJzZWxlY3QiLCJmaWxlcyIsIm1lc3NhZ2UiLCJnZXRTaGFyZWRGaWxlcyIsInNoYXJlZFdpdGgiLCJnZXRBbGxGaWxlcyIsImFsbEZpbGVzIiwiZ2V0U2luZ2xlRmlsZSIsImZpbmRPbmUiLCJmaWxlSWQiLCJwYXJhbXMiLCJmaWxlaWQiLCJmaWxlIiwiZGVsZXRlU2luZ2xlRmlsZSIsImZpbmRPbmVBbmREZWxldGUiLCJmaWxlU3RvcmFnZUlkIiwiY3JlYXRlTmV3RmlsZSIsInNhdmUiLCJ1cGxvYWRGaWxlcyIsImJ1ZmZlciIsImZpbGV0eXBlIiwiYlN0cmVhbSIsIlBhc3NUaHJvdWdoIiwiZW5kIiwiYWRkIiwic3RvcmFnZUlkIiwibWltZSIsImV4dGVuc2lvbiIsImV4dCIsImNvbnNvbGUiLCJlcnJvciIsImNoZWNrUGVybWlzc2lvblRvRmlsZSIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJsb2NrZWQiLCJjaGVja0ZpbGVPd25lcnNoaXAiLCJsb2NrRmlsZSIsImxvY2tlZEJ5IiwidW5sb2NrRmlsZSIsImRvd25sb2FkRmlsZSIsImdldCIsImZpbGVCdWZmZXIiLCJzaGFyZUZpbGUiLCJ1c2VyVG9TaGFyZSIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFJQTs7QUFDQTs7QUFIQSxJQUFNQSxPQUFPLEdBQUcsMkJBQWhCOztBQUtBO0FBQ08sSUFBTUMsV0FBVztBQUFBLDJGQUFHLGlCQUFPQyxHQUFQLEVBQXFCQyxHQUFyQixF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LElBQU1HLFNBQVM7QUFBQSw2RkFBRyxtQkFBT3pELEdBQVAsRUFBcUJDLEdBQXJCLEVBQW9DQyxJQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVid0QsWUFBQUEsV0FGYSxHQUVDMUQsR0FBRyxDQUFDVyxJQUFKLENBQVMrQyxXQUFULElBQXdCMUQsR0FBRyxDQUFDYSxLQUFKLENBQVU2QyxXQUZuQztBQUdqQnpELFlBQUFBLEdBQUcsQ0FBQ0UsTUFBSixDQUFXd0IsSUFBWCxDQUFnQlIsVUFBaEIsQ0FBMkJ3QyxJQUEzQixDQUFnQ0QsV0FBVyxDQUFDakQsR0FBNUM7QUFIaUI7QUFBQSxtQkFLWFIsR0FBRyxDQUFDRSxNQUFKLENBQVd3QixJQUFYLENBQWdCSyxJQUFoQixFQUxXOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQSwrQ0FPVjlCLElBQUksQ0FBQyxJQUFJRyxtQkFBSixDQUFpQixHQUFqQixnQ0FBNkMsY0FBaUJZLE9BQTlELEVBQUQsQ0FQTTs7QUFBQTtBQVVyQmYsWUFBQUEsSUFBSTs7QUFWaUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBVHVELFNBQVM7QUFBQTtBQUFBO0FBQUEsR0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzLCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiXHJcbmltcG9ydCB7IGZyb21CdWZmZXIgYXMgZmlsZXR5cGVGcm9tQnVmZmVyIH0gZnJvbSAnZmlsZS10eXBlJ1xyXG5pbXBvcnQgeyBQYXNzVGhyb3VnaCB9IGZyb20gJ3N0cmVhbSdcclxuaW1wb3J0ICogYXMgYXJjaGl2ZSBmcm9tICdhcmNoaXZlcidcclxuXHJcbmltcG9ydCB7IEVycm9ySGFuZGxlciB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2Vycm9yJ1xyXG5pbXBvcnQgZ2V0U3RvcmFnZSBmcm9tICcuLi9saWIvc3RvcmFnZS9hZGFwdGVycydcclxuXHJcbmNvbnN0IHN0b3JhZ2UgPSBnZXRTdG9yYWdlKClcclxuXHJcbmltcG9ydCB7IEZpbGUgfSBmcm9tICcuLi9tb2RlbHMvZmlsZSdcclxuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xyXG5cclxuLy9Nb2RlbCBGaW5kIE9wZXJhdGlvbnNcclxuZXhwb3J0IGNvbnN0IGdldE93bkZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IEZpbGUuZmluZCh7IG93bmVyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQgfSkuc29ydChyZXEuYm9keS5zb3J0ZWQgfHwgcmVxLnF1ZXJ5LnNvcnRlZCB8fCAnLWRhdGVkJykucG9wdWxhdGUoJ293bmVyJykuc2VsZWN0KCd0aXRsZSBkYXRlZCBmaWxlSWQgbG9ja2VkIGV4dGVuc2lvbiBvd25lci5zZXR0aW5ncy5kaXNwbGF5TmFtZSBvd25lci5hdmF0YXInKVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBmaWxlc1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNoYXJlZEZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IEZpbGUuZmluZCh7IHNoYXJlZFdpdGg6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCB9KS5zb3J0KHJlcS5ib2R5LnNvcnRlZCB8fCByZXEucXVlcnkuc29ydGVkIHx8ICctZGF0ZWQnKS5wb3B1bGF0ZSgnb3duZXInKS5zZWxlY3QoJ3RpdGxlIGRhdGVkIGZpbGVJZCBsb2NrZWQgZXh0ZW5zaW9uIG93bmVyLnVzZXJuYW1lIG93bmVyLmF2YXRhcicpXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlcyA9IGZpbGVzXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGFsbEZpbGVzID0gYXdhaXQgRmlsZS5maW5kKHt9KS5wb3B1bGF0ZSgnb3duZXInKVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBhbGxGaWxlc1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgZG9jdW1lbnRzOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNpbmdsZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgRmlsZS5maW5kT25lKHsgZmlsZUlkOiByZXEucGFyYW1zLmZpbGVpZCB9KVxyXG4gICAgICAgICAgICAucG9wdWxhdGUoJ293bmVyJylcclxuICAgICAgICAgICAgLnBvcHVsYXRlKCdsb2NrZWRCeScpXHJcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnc2hhcmVkV2l0aCcpXHJcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnbG9nLnVzZXInKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVTaW5nbGVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlSWQgPSByZXEucGFyYW1zLmZpbGVpZCB8fCByZXEuYm9keS5maWxlaWQgfHwgcmVxLnF1ZXJ5LmZpbGVpZFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IEZpbGUuZmluZE9uZUFuZERlbGV0ZSh7IGZpbGVJZDogZmlsZUlkIH0pXHJcbiAgICAgICAgYXdhaXQgc3RvcmFnZS5kZWxldGUocmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWQpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZGVsZXRpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vQ3JlYXRlIEFuZCBVcGRhdGUgTW9kZWxcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVOZXdGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlaWQgPSB1dWlkKClcclxuICAgICAgICBsZXQgZmlsZSA9IG5ldyBGaWxlKHJlcS5ib2R5KVxyXG4gICAgICAgIGZpbGUub3duZXIgPSByZXMubG9jYWxzLmF1dGhfdXNlci5faWRcclxuICAgICAgICBmaWxlLmZpbGVJZCA9IGZpbGVpZFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IGZpbGUuc2F2ZSgpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgY3JlYXRpbmcgZG9jdW1lbnQ6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXBsb2FkRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGZpbGV0eXBlID0gYXdhaXQgZmlsZXR5cGVGcm9tQnVmZmVyKHJlcS5maWxlLmJ1ZmZlcilcclxuXHJcbiAgICAgICAgbGV0IGJTdHJlYW0gPSBuZXcgUGFzc1Rocm91Z2goKVxyXG4gICAgICAgIGJTdHJlYW0uZW5kKHJlcS5maWxlLmJ1ZmZlcilcclxuXHJcbiAgICAgICAgbGV0IHN0b3JhZ2VJZCA9IGF3YWl0IHN0b3JhZ2UuYWRkKGJTdHJlYW0pXHJcblxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5maWxlU3RvcmFnZUlkID0gc3RvcmFnZUlkXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLm1pbWUgPSBmaWxldHlwZT8ubWltZVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5leHRlbnNpb24gPSBmaWxldHlwZT8uZXh0XHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxyXG4gICAgICAgIGRlbGV0ZSByZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZFxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgaGFuZGxpbmcgZmlsZSB1cGxvYWQ6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG4vLyBMb2NrIE9wZXJhdGlvbnNcclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja1Blcm1pc3Npb25Ub0ZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGlmICghKHJlcy5sb2NhbHMuYXV0aF91c2VyLnVzZXJuYW1lID09IHJlcy5sb2NhbHMuZmlsZS5vd25lci51c2VybmFtZSB8fCByZXMubG9jYWxzLmZpbGUuc2hhcmVkV2l0aC5pbmNsdWRlcyhyZXMubG9jYWxzLmF1dGhfdXNlcikpIHx8IHJlcy5sb2NhbHMuZmlsZS5sb2NrZWQpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAxLCBcIkZpbGUgY2FuJ3QgYmUgY2hlY2tlZCBvdXQgYnkgeW91XCIpKVxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja0ZpbGVPd25lcnNoaXAgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGlmICghKHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCA9PSByZXMubG9jYWxzLmZpbGUub3duZXIuX2lkKSkgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDEsICdZb3UgYXJlIG5vdCBwZXJtaXR0ZWQgdG8gYWNjZXMgdGhpcyBmaWxlJykpXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGxvY2tGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWRCeSA9IHJlcy5sb2NhbHMuYXV0aF91c2VyXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvY2tlZCA9IHRydWVcclxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgbG9ja2luZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVubG9ja0ZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvY2tlZEJ5ID0gbnVsbFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWQgPSBmYWxzZVxyXG4gICAgICAgIGF3YWl0IHJlcy5sb2NhbHMuZmlsZS5zYXZlKClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciB1bmxvY2tpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vIEZpbGUgZG93bmxvYWRcclxuXHJcbmV4cG9ydCBjb25zdCBkb3dubG9hZEZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy8gbGV0IHppcCA9IGF3YWl0IGFyY2hpdmUoJ3ppcCcpXHJcbiAgICAgICAgLy8gYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgLy8gICAgIHJlcy5sb2NhbHMuZmlsZS5wYWdlSGFzaGVzLmZvckVhY2goYXN5bmMgZWxlbWVudCA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICBsZXQgYnVmZmVyID0gYXdhaXQgc3RvcmFnZS5nZXQoZWxlbWVudClcclxuICAgICAgICAvLyAgICAgICAgIHppcC5hcHBlbmQoKVxyXG4gICAgICAgIC8vICAgICB9KVxyXG4gICAgICAgIC8vIClcclxuXHJcbiAgICAgICAgLy8gcmVzLmxvY2Fscy56aXAgPSB6aXBcclxuXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlQnVmZmVyID0gYXdhaXQgc3RvcmFnZS5nZXQocmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWQpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZG93bmxvYWRpbmcgZmlsZTsgJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vIFNoYXJlXHJcblxyXG5leHBvcnQgY29uc3Qgc2hhcmVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCB1c2VyVG9TaGFyZSA9IHJlcS5ib2R5LnVzZXJUb1NoYXJlIHx8IHJlcS5xdWVyeS51c2VyVG9TaGFyZVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5zaGFyZWRXaXRoLnB1c2godXNlclRvU2hhcmUuX2lkKVxyXG5cclxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3Igc2hhcmluZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufSJdfQ==