"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shareFile = exports.downloadFile = exports.unlockFile = exports.lockFile = exports.checkFileOwnership = exports.checkPermissionToFile = exports.appendComment = exports.uploadFiles = exports.createNewFile = exports.deleteSingleFile = exports.getSingleFile = exports.getAllFiles = exports.getSharedFiles = exports.getOwnFiles = void 0;

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
            file.log.push({
              user: res.locals.auth_user._id,
              message: 'created this file'
            });
            file.log.push({
              user: res.locals.auth_user._id,
              logType: 'commented',
              message: req.body.comment
            });
            _context6.next = 9;
            return file.save();

          case 9:
            res.locals.file = _context6.sent;
            _context6.next = 15;
            break;

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6["catch"](0);
            return _context6.abrupt("return", next(new _error.ErrorHandler(500, "Error creating document: ".concat(_context6.t0.message))));

          case 15:
            next();

          case 16:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 12]]);
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
}();

exports.uploadFiles = uploadFiles;

var appendComment = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            res.locals.file.log.push({
              user: res.locals.auth_user,
              message: req.body.comment,
              logType: 'commented'
            });
            _context8.next = 4;
            return res.locals.file.save();

          case 4:
            _context8.next = 9;
            break;

          case 6:
            _context8.prev = 6;
            _context8.t0 = _context8["catch"](0);
            return _context8.abrupt("return", next(new _error.ErrorHandler(500, "Error locking file: ".concat(_context8.t0.message))));

          case 9:
            next();

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 6]]);
  }));

  return function appendComment(_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}(); // Lock Operations


exports.appendComment = appendComment;

var checkPermissionToFile = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (!(!(res.locals.auth_user.username == res.locals.file.owner.username || res.locals.file.sharedWith.includes(res.locals.auth_user)) || res.locals.file.locked)) {
              _context9.next = 2;
              break;
            }

            return _context9.abrupt("return", next(new _error.ErrorHandler(401, "File can't be checked out by you")));

          case 2:
            next();

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function checkPermissionToFile(_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}();

exports.checkPermissionToFile = checkPermissionToFile;

var checkFileOwnership = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            if (res.locals.auth_user._id == res.locals.file.owner._id) {
              _context10.next = 2;
              break;
            }

            return _context10.abrupt("return", next(new _error.ErrorHandler(401, 'You are not permitted to acces this file')));

          case 2:
            next();

          case 3:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function checkFileOwnership(_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}();

exports.checkFileOwnership = checkFileOwnership;

var lockFile = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            res.locals.file.lockedBy = res.locals.auth_user;
            res.locals.file.locked = true;
            _context11.next = 5;
            return res.locals.file.save();

          case 5:
            _context11.next = 10;
            break;

          case 7:
            _context11.prev = 7;
            _context11.t0 = _context11["catch"](0);
            return _context11.abrupt("return", next(new _error.ErrorHandler(500, "Error locking file: ".concat(_context11.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 7]]);
  }));

  return function lockFile(_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}();

exports.lockFile = lockFile;

var unlockFile = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            res.locals.file.lockedBy = null;
            res.locals.file.locked = false;
            _context12.next = 5;
            return res.locals.file.save();

          case 5:
            _context12.next = 10;
            break;

          case 7:
            _context12.prev = 7;
            _context12.t0 = _context12["catch"](0);
            return _context12.abrupt("return", next(new _error.ErrorHandler(500, "Error unlocking file: ".concat(_context12.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 7]]);
  }));

  return function unlockFile(_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}(); // File download


exports.unlockFile = unlockFile;

var downloadFile = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            _context13.next = 3;
            return storage.get(res.locals.file.fileStorageId);

          case 3:
            res.locals.fileBuffer = _context13.sent;
            _context13.next = 9;
            break;

          case 6:
            _context13.prev = 6;
            _context13.t0 = _context13["catch"](0);
            return _context13.abrupt("return", next(new _error.ErrorHandler(500, "Error downloading file; ".concat(_context13.t0.message))));

          case 9:
            next();

          case 10:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 6]]);
  }));

  return function downloadFile(_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
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
            res.locals.file.sharedWith.push(userToShare._id);
            _context14.next = 5;
            return res.locals.file.save();

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

  return function shareFile(_x40, _x41, _x42) {
    return _ref14.apply(this, arguments);
  };
}();

exports.shareFile = shareFile;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsic3RvcmFnZSIsImdldE93bkZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImxvY2FscyIsImF1dGhfdXNlciIsIkVycm9ySGFuZGxlciIsIkZpbGUiLCJmaW5kIiwib3duZXIiLCJfaWQiLCJzb3J0IiwiYm9keSIsInNvcnRlZCIsInF1ZXJ5IiwicG9wdWxhdGUiLCJzZWxlY3QiLCJmaWxlcyIsIm1lc3NhZ2UiLCJnZXRTaGFyZWRGaWxlcyIsInNoYXJlZFdpdGgiLCJnZXRBbGxGaWxlcyIsImFsbEZpbGVzIiwiZ2V0U2luZ2xlRmlsZSIsImZpbmRPbmUiLCJmaWxlSWQiLCJwYXJhbXMiLCJmaWxlaWQiLCJmaWxlIiwiZGVsZXRlU2luZ2xlRmlsZSIsImZpbmRPbmVBbmREZWxldGUiLCJmaWxlU3RvcmFnZUlkIiwiY3JlYXRlTmV3RmlsZSIsImxvZyIsInB1c2giLCJ1c2VyIiwibG9nVHlwZSIsImNvbW1lbnQiLCJzYXZlIiwidXBsb2FkRmlsZXMiLCJidWZmZXIiLCJmaWxldHlwZSIsImJTdHJlYW0iLCJQYXNzVGhyb3VnaCIsImVuZCIsImFkZCIsInN0b3JhZ2VJZCIsIm1pbWUiLCJleHRlbnNpb24iLCJleHQiLCJjb25zb2xlIiwiZXJyb3IiLCJhcHBlbmRDb21tZW50IiwiY2hlY2tQZXJtaXNzaW9uVG9GaWxlIiwidXNlcm5hbWUiLCJpbmNsdWRlcyIsImxvY2tlZCIsImNoZWNrRmlsZU93bmVyc2hpcCIsImxvY2tGaWxlIiwibG9ja2VkQnkiLCJ1bmxvY2tGaWxlIiwiZG93bmxvYWRGaWxlIiwiZ2V0IiwiZmlsZUJ1ZmZlciIsInNoYXJlRmlsZSIsInVzZXJUb1NoYXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBSUE7O0FBQ0E7O0FBSEEsSUFBTUEsT0FBTyxHQUFHLDJCQUFoQjs7QUFLQTtBQUNP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QTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFaMEQsWUFBWTtBQUFBO0FBQUE7QUFBQSxHQUFsQixDLENBb0JQOzs7OztBQUVPLElBQU1HLFNBQVM7QUFBQSw2RkFBRyxtQkFBTy9ELEdBQVAsRUFBcUJDLEdBQXJCLEVBQW9DQyxJQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUViOEQsWUFBQUEsV0FGYSxHQUVDaEUsR0FBRyxDQUFDVyxJQUFKLENBQVNxRCxXQUFULElBQXdCaEUsR0FBRyxDQUFDYSxLQUFKLENBQVVtRCxXQUZuQztBQUdqQi9ELFlBQUFBLEdBQUcsQ0FBQ0UsTUFBSixDQUFXd0IsSUFBWCxDQUFnQlIsVUFBaEIsQ0FBMkJjLElBQTNCLENBQWdDK0IsV0FBVyxDQUFDdkQsR0FBNUM7QUFIaUI7QUFBQSxtQkFLWFIsR0FBRyxDQUFDRSxNQUFKLENBQVd3QixJQUFYLENBQWdCVSxJQUFoQixFQUxXOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQSwrQ0FPVm5DLElBQUksQ0FBQyxJQUFJRyxtQkFBSixDQUFpQixHQUFqQixnQ0FBNkMsY0FBaUJZLE9BQTlELEVBQUQsQ0FQTTs7QUFBQTtBQVVyQmYsWUFBQUEsSUFBSTs7QUFWaUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBVDZELFNBQVM7QUFBQTtBQUFBO0FBQUEsR0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzLCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiXHJcbmltcG9ydCB7IGZyb21CdWZmZXIgYXMgZmlsZXR5cGVGcm9tQnVmZmVyIH0gZnJvbSAnZmlsZS10eXBlJ1xyXG5pbXBvcnQgeyBQYXNzVGhyb3VnaCB9IGZyb20gJ3N0cmVhbSdcclxuaW1wb3J0ICogYXMgYXJjaGl2ZSBmcm9tICdhcmNoaXZlcidcclxuXHJcbmltcG9ydCB7IEVycm9ySGFuZGxlciB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2Vycm9yJ1xyXG5pbXBvcnQgZ2V0U3RvcmFnZSBmcm9tICcuLi9saWIvc3RvcmFnZS9hZGFwdGVycydcclxuXHJcbmNvbnN0IHN0b3JhZ2UgPSBnZXRTdG9yYWdlKClcclxuXHJcbmltcG9ydCB7IEZpbGUgfSBmcm9tICcuLi9tb2RlbHMvZmlsZSdcclxuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xyXG5cclxuLy9Nb2RlbCBGaW5kIE9wZXJhdGlvbnNcclxuZXhwb3J0IGNvbnN0IGdldE93bkZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IEZpbGUuZmluZCh7IG93bmVyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQgfSkuc29ydChyZXEuYm9keS5zb3J0ZWQgfHwgcmVxLnF1ZXJ5LnNvcnRlZCB8fCAnLWRhdGVkJykucG9wdWxhdGUoJ293bmVyJykuc2VsZWN0KCd0aXRsZSBkYXRlZCBmaWxlSWQgbG9ja2VkIGV4dGVuc2lvbiBvd25lci5zZXR0aW5ncy5kaXNwbGF5TmFtZSBvd25lci5hdmF0YXInKVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBmaWxlc1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNoYXJlZEZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IEZpbGUuZmluZCh7IHNoYXJlZFdpdGg6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCB9KS5zb3J0KHJlcS5ib2R5LnNvcnRlZCB8fCByZXEucXVlcnkuc29ydGVkIHx8ICctZGF0ZWQnKS5wb3B1bGF0ZSgnb3duZXInKS5zZWxlY3QoJ3RpdGxlIGRhdGVkIGZpbGVJZCBsb2NrZWQgZXh0ZW5zaW9uIG93bmVyLnVzZXJuYW1lIG93bmVyLmF2YXRhcicpXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlcyA9IGZpbGVzXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGFsbEZpbGVzID0gYXdhaXQgRmlsZS5maW5kKHt9KS5wb3B1bGF0ZSgnb3duZXInKVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBhbGxGaWxlc1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgZG9jdW1lbnRzOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNpbmdsZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgRmlsZS5maW5kT25lKHsgZmlsZUlkOiByZXEucGFyYW1zLmZpbGVpZCB9KVxyXG4gICAgICAgICAgICAucG9wdWxhdGUoJ293bmVyJylcclxuICAgICAgICAgICAgLnBvcHVsYXRlKCdsb2NrZWRCeScpXHJcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnc2hhcmVkV2l0aCcpXHJcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnbG9nLnVzZXInKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVTaW5nbGVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlSWQgPSByZXEucGFyYW1zLmZpbGVpZCB8fCByZXEuYm9keS5maWxlaWQgfHwgcmVxLnF1ZXJ5LmZpbGVpZFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IEZpbGUuZmluZE9uZUFuZERlbGV0ZSh7IGZpbGVJZDogZmlsZUlkIH0pXHJcbiAgICAgICAgYXdhaXQgc3RvcmFnZS5kZWxldGUocmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWQpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZGVsZXRpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vQ3JlYXRlIEFuZCBVcGRhdGUgTW9kZWxcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVOZXdGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlaWQgPSB1dWlkKClcclxuICAgICAgICBsZXQgZmlsZSA9IG5ldyBGaWxlKHJlcS5ib2R5KVxyXG4gICAgICAgIGZpbGUub3duZXIgPSByZXMubG9jYWxzLmF1dGhfdXNlci5faWRcclxuICAgICAgICBmaWxlLmZpbGVJZCA9IGZpbGVpZFxyXG4gICAgICAgIGZpbGUubG9nLnB1c2goe1xyXG4gICAgICAgICAgICB1c2VyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdjcmVhdGVkIHRoaXMgZmlsZSdcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZpbGUubG9nLnB1c2goe1xyXG4gICAgICAgICAgICB1c2VyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQsXHJcbiAgICAgICAgICAgIGxvZ1R5cGU6ICdjb21tZW50ZWQnLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiByZXEuYm9keS5jb21tZW50XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUgPSBhd2FpdCBmaWxlLnNhdmUoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGNyZWF0aW5nIGRvY3VtZW50OiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVwbG9hZEZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxldHlwZSA9IGF3YWl0IGZpbGV0eXBlRnJvbUJ1ZmZlcihyZXEuZmlsZS5idWZmZXIpXHJcblxyXG4gICAgICAgIGxldCBiU3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoKClcclxuICAgICAgICBiU3RyZWFtLmVuZChyZXEuZmlsZS5idWZmZXIpXHJcblxyXG4gICAgICAgIGxldCBzdG9yYWdlSWQgPSBhd2FpdCBzdG9yYWdlLmFkZChiU3RyZWFtKVxyXG5cclxuICAgICAgICByZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZCA9IHN0b3JhZ2VJZFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5taW1lID0gZmlsZXR5cGU/Lm1pbWVcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUuZXh0ZW5zaW9uID0gZmlsZXR5cGU/LmV4dFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5zYXZlKClcclxuICAgICAgICBkZWxldGUgcmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWRcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGhhbmRsaW5nIGZpbGUgdXBsb2FkOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFwcGVuZENvbW1lbnQgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvZy5wdXNoKHtcclxuICAgICAgICAgICAgdXNlcjogcmVzLmxvY2Fscy5hdXRoX3VzZXIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5LmNvbW1lbnQsXHJcbiAgICAgICAgICAgIGxvZ1R5cGU6ICdjb21tZW50ZWQnXHJcbiAgICAgICAgfSlcclxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXHJcblxyXG4gICAgICAgIC8vcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgcmVzLmxvY2Fscy5maWxlLnBvcHVsYXRlKCdsb2cudXNlcicpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgbG9ja2luZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuLy8gTG9jayBPcGVyYXRpb25zXHJcblxyXG5leHBvcnQgY29uc3QgY2hlY2tQZXJtaXNzaW9uVG9GaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIShyZXMubG9jYWxzLmF1dGhfdXNlci51c2VybmFtZSA9PSByZXMubG9jYWxzLmZpbGUub3duZXIudXNlcm5hbWUgfHwgcmVzLmxvY2Fscy5maWxlLnNoYXJlZFdpdGguaW5jbHVkZXMocmVzLmxvY2Fscy5hdXRoX3VzZXIpKSB8fCByZXMubG9jYWxzLmZpbGUubG9ja2VkKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMSwgXCJGaWxlIGNhbid0IGJlIGNoZWNrZWQgb3V0IGJ5IHlvdVwiKSlcclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2hlY2tGaWxlT3duZXJzaGlwID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIShyZXMubG9jYWxzLmF1dGhfdXNlci5faWQgPT0gcmVzLmxvY2Fscy5maWxlLm93bmVyLl9pZCkpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAxLCAnWW91IGFyZSBub3QgcGVybWl0dGVkIHRvIGFjY2VzIHRoaXMgZmlsZScpKVxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBsb2NrRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUubG9ja2VkQnkgPSByZXMubG9jYWxzLmF1dGhfdXNlclxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWQgPSB0cnVlXHJcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGxvY2tpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1bmxvY2tGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWRCeSA9IG51bGxcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUubG9ja2VkID0gZmFsc2VcclxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgdW5sb2NraW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG4vLyBGaWxlIGRvd25sb2FkXHJcblxyXG5leHBvcnQgY29uc3QgZG93bmxvYWRGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vIGxldCB6aXAgPSBhd2FpdCBhcmNoaXZlKCd6aXAnKVxyXG4gICAgICAgIC8vIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgIC8vICAgICByZXMubG9jYWxzLmZpbGUucGFnZUhhc2hlcy5mb3JFYWNoKGFzeW5jIGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgbGV0IGJ1ZmZlciA9IGF3YWl0IHN0b3JhZ2UuZ2V0KGVsZW1lbnQpXHJcbiAgICAgICAgLy8gICAgICAgICB6aXAuYXBwZW5kKClcclxuICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAvLyApXHJcblxyXG4gICAgICAgIC8vIHJlcy5sb2NhbHMuemlwID0gemlwXHJcblxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZUJ1ZmZlciA9IGF3YWl0IHN0b3JhZ2UuZ2V0KHJlcy5sb2NhbHMuZmlsZS5maWxlU3RvcmFnZUlkKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGRvd25sb2FkaW5nIGZpbGU7ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG4vLyBTaGFyZVxyXG5cclxuZXhwb3J0IGNvbnN0IHNoYXJlRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgdXNlclRvU2hhcmUgPSByZXEuYm9keS51c2VyVG9TaGFyZSB8fCByZXEucXVlcnkudXNlclRvU2hhcmVcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUuc2hhcmVkV2l0aC5wdXNoKHVzZXJUb1NoYXJlLl9pZClcclxuXHJcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIHNoYXJpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn0iXX0=