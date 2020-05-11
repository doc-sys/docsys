"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleQueue = exports.archiveFile = exports.shareFile = exports.downloadFile = exports.unlockFile = exports.lockFile = exports.checkFileOwnership = exports.checkPermissionToFile = exports.appendComment = exports.uploadFiles = exports.createNewFile = exports.deleteSingleFile = exports.getSingleFile = exports.getRecent = exports.getAllFiles = exports.getSharedFiles = exports.getOwnFiles = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fileType = require("file-type");

var _stream = require("stream");

var _socket = require("../socket");

var _keystore = require("../lib/helpers/keystore");

var _error = require("../lib/helpers/error");

var _adapters = _interopRequireDefault(require("../lib/storage/adapters"));

var _file = require("../models/file");

var _uuid = require("uuid");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var storage = (0, _adapters["default"])(); // const queue_client = queue()

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

var getRecent = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _file.File.find({
              '$or': [{
                owner: res.locals.auth_user._id
              }, {
                sharedWith: {
                  '$in': [res.locals.auth_user._id]
                }
              }]
            }).populate({
              path: 'log.user',
              select: 'user.settings.displayName user.avatar',
              options: {
                limit: 1
              }
            });

          case 3:
            res.locals.recent = _context4.sent;
            _context4.next = 9;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            return _context4.abrupt("return", next(new _error.ErrorHandler(500, "Error getting recent: ".concat(_context4.t0.message))));

          case 9:
            next();

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 6]]);
  }));

  return function getRecent(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getRecent = getRecent;

var getSingleFile = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _file.File.findOne({
              fileId: req.params.fileid
            }).populate('owner').populate('lockedBy').populate('sharedWith').populate('log.user');

          case 3:
            res.locals.file = _context5.sent;

            _socket.notification_channel.to(res.locals.auth_user.username).emit('notification', 'Getting file');

            _context5.next = 10;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            return _context5.abrupt("return", next(new _error.ErrorHandler(500, "Error getting file: ".concat(_context5.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 7]]);
  }));

  return function getSingleFile(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getSingleFile = getSingleFile;

var deleteSingleFile = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var fileId;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            fileId = req.params.fileid || req.body.fileid || req.query.fileid;
            _context6.next = 4;
            return _file.File.findOneAndDelete({
              fileId: fileId
            });

          case 4:
            res.locals.file = _context6.sent;
            _context6.next = 7;
            return storage["delete"](res.locals.file.fileStorageId);

          case 7:
            _context6.next = 12;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](0);
            return _context6.abrupt("return", next(new _error.ErrorHandler(500, "Error deleting file: ".concat(_context6.t0.message))));

          case 12:
            next();

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 9]]);
  }));

  return function deleteSingleFile(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}(); //Create And Update Model


exports.deleteSingleFile = deleteSingleFile;

var createNewFile = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var fileid, file;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
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
            _context7.next = 9;
            return file.save();

          case 9:
            res.locals.file = _context7.sent;
            _context7.next = 15;
            break;

          case 12:
            _context7.prev = 12;
            _context7.t0 = _context7["catch"](0);
            return _context7.abrupt("return", next(new _error.ErrorHandler(500, "Error creating document: ".concat(_context7.t0.message))));

          case 15:
            next();

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 12]]);
  }));

  return function createNewFile(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

exports.createNewFile = createNewFile;

var uploadFiles = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var filetype, bStream, storageId;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return (0, _fileType.fromBuffer)(req.file.buffer);

          case 3:
            filetype = _context8.sent;
            bStream = new _stream.PassThrough();
            bStream.end(req.file.buffer);
            _context8.next = 8;
            return storage.add(bStream);

          case 8:
            storageId = _context8.sent;
            res.locals.file.fileStorageId = storageId;
            res.locals.file.mime = filetype === null || filetype === void 0 ? void 0 : filetype.mime;
            res.locals.file.extension = filetype === null || filetype === void 0 ? void 0 : filetype.ext;
            res.locals.file.save();
            delete res.locals.file.fileStorageId;
            _context8.next = 20;
            break;

          case 16:
            _context8.prev = 16;
            _context8.t0 = _context8["catch"](0);
            console.error(_context8.t0);
            return _context8.abrupt("return", next(new _error.ErrorHandler(500, "Error handling file upload: ".concat(_context8.t0.message))));

          case 20:
            next();

          case 21:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 16]]);
  }));

  return function uploadFiles(_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();

exports.uploadFiles = uploadFiles;

var appendComment = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            res.locals.file.log.push({
              user: res.locals.auth_user,
              message: req.body.comment,
              logType: 'commented'
            });
            _context9.next = 4;
            return res.locals.file.save();

          case 4:
            _context9.next = 6;
            return emitNotification([res.locals.file.owner.username].concat((0, _toConsumableArray2["default"])(res.locals.file.sharedWith.map(function (e) {
              return e.username;
            }))), "".concat(res.locals.auth_user.settings.displayName, " commented on ").concat(res.locals.file.title), res.locals.auth_user.username);

          case 6:
            _context9.next = 11;
            break;

          case 8:
            _context9.prev = 8;
            _context9.t0 = _context9["catch"](0);
            return _context9.abrupt("return", next(new _error.ErrorHandler(500, "Error locking file: ".concat(_context9.t0.message))));

          case 11:
            next();

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 8]]);
  }));

  return function appendComment(_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}(); // Lock Operations


exports.appendComment = appendComment;

var checkPermissionToFile = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var permitted;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            permitted = false;
            res.locals.file.sharedWith.filter(function (e) {
              return e.username === res.locals.auth_user.username;
            }).length > 0 ? permitted = true : permitted = false;

            if (res.locals.auth_user.username == res.locals.file.owner.username || permitted) {
              _context10.next = 4;
              break;
            }

            return _context10.abrupt("return", next(new _error.ErrorHandler(401, "File can't be checked out by you")));

          case 4:
            next();

          case 5:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function checkPermissionToFile(_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}();

exports.checkPermissionToFile = checkPermissionToFile;

var checkFileOwnership = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            if (res.locals.auth_user._id == res.locals.file.owner._id) {
              _context11.next = 2;
              break;
            }

            return _context11.abrupt("return", next(new _error.ErrorHandler(401, 'You are not permitted to acces this file')));

          case 2:
            next();

          case 3:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function checkFileOwnership(_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}();

exports.checkFileOwnership = checkFileOwnership;

var lockFile = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            res.locals.file.lockedBy = res.locals.auth_user;
            res.locals.file.locked = true;
            _context12.next = 5;
            return res.locals.file.save();

          case 5:
            _context12.next = 10;
            break;

          case 7:
            _context12.prev = 7;
            _context12.t0 = _context12["catch"](0);
            return _context12.abrupt("return", next(new _error.ErrorHandler(500, "Error locking file: ".concat(_context12.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 7]]);
  }));

  return function lockFile(_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}();

exports.lockFile = lockFile;

var unlockFile = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            res.locals.file.lockedBy = null;
            res.locals.file.locked = false;
            _context13.next = 5;
            return res.locals.file.save();

          case 5:
            _context13.next = 10;
            break;

          case 7:
            _context13.prev = 7;
            _context13.t0 = _context13["catch"](0);
            return _context13.abrupt("return", next(new _error.ErrorHandler(500, "Error unlocking file: ".concat(_context13.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 7]]);
  }));

  return function unlockFile(_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}(); // File download


exports.unlockFile = unlockFile;

var downloadFile = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;

            if (!res.locals.file.archived) {
              _context14.next = 3;
              break;
            }

            throw new Error('File is archived');

          case 3:
            _context14.next = 5;
            return storage.get(res.locals.file.fileStorageId);

          case 5:
            res.locals.fileBuffer = _context14.sent;
            _context14.next = 11;
            break;

          case 8:
            _context14.prev = 8;
            _context14.t0 = _context14["catch"](0);
            return _context14.abrupt("return", next(new _error.ErrorHandler(500, "Error downloading file; ".concat(_context14.t0.message))));

          case 11:
            next();

          case 12:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[0, 8]]);
  }));

  return function downloadFile(_x40, _x41, _x42) {
    return _ref14.apply(this, arguments);
  };
}(); // Share


exports.downloadFile = downloadFile;

var shareFile = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    var userToShare;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            userToShare = req.body.whoToShare || req.query.userToShare;
            res.locals.file.sharedWith.push(userToShare);
            _context15.next = 5;
            return res.locals.file.save();

          case 5:
            _context15.next = 7;
            return _file.File.findOne({
              fileId: res.locals.file.fileId
            }).populate('owner').populate('sharedWith');

          case 7:
            res.locals.file = _context15.sent;
            _context15.next = 10;
            return emitNotification([res.locals.file.owner.username].concat((0, _toConsumableArray2["default"])(res.locals.file.sharedWith.map(function (e) {
              return e.username;
            }))), "".concat(res.locals.auth_user.settings.displayName, " shared ").concat(res.locals.file.title, " with you"), res.locals.auth_user.username);

          case 10:
            _context15.next = 15;
            break;

          case 12:
            _context15.prev = 12;
            _context15.t0 = _context15["catch"](0);
            return _context15.abrupt("return", next(new _error.ErrorHandler(500, "Error sharing file: ".concat(_context15.t0.message))));

          case 15:
            next();

          case 16:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 12]]);
  }));

  return function shareFile(_x43, _x44, _x45) {
    return _ref15.apply(this, arguments);
  };
}();

exports.shareFile = shareFile;

var archiveFile = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return storage.archive(res.locals.file.fileStorageId);

          case 3:
            res.locals.file.archived = true;
            _context16.next = 6;
            return res.locals.file.save();

          case 6:
            res.locals.file = _context16.sent;
            _context16.next = 12;
            break;

          case 9:
            _context16.prev = 9;
            _context16.t0 = _context16["catch"](0);
            return _context16.abrupt("return", next(new _error.ErrorHandler(500, "Error archiving file: ".concat(_context16.t0.message))));

          case 12:
            next();

          case 13:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[0, 9]]);
  }));

  return function archiveFile(_x46, _x47, _x48) {
    return _ref16.apply(this, arguments);
  };
}();

exports.archiveFile = archiveFile;

var handleQueue = /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res, next) {
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            switch (req.params.queue) {
              case "ocr":
            }

          case 1:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function handleQueue(_x49, _x50, _x51) {
    return _ref17.apply(this, arguments);
  };
}(); // HELPER FUNCTION
// ---------------


exports.handleQueue = handleQueue;

function emitNotification(_x52, _x53, _x54) {
  return _emitNotification.apply(this, arguments);
}

function _emitNotification() {
  _emitNotification = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(recps, actionContent, emitter) {
    var _iterator, _step, recp, recp_adress;

    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _iterator = _createForOfIteratorHelper(recps);
            _context18.prev = 1;

            _iterator.s();

          case 3:
            if ((_step = _iterator.n()).done) {
              _context18.next = 12;
              break;
            }

            recp = _step.value;

            if (!(recp !== emitter)) {
              _context18.next = 10;
              break;
            }

            _context18.next = 8;
            return _keystore.socketStore.get(recp);

          case 8:
            recp_adress = _context18.sent;

            if (recp_adress) {
              _socket.notification_channel.to("/notifications#".concat(recp_adress)).emit('notification', actionContent);
            }

          case 10:
            _context18.next = 3;
            break;

          case 12:
            _context18.next = 17;
            break;

          case 14:
            _context18.prev = 14;
            _context18.t0 = _context18["catch"](1);

            _iterator.e(_context18.t0);

          case 17:
            _context18.prev = 17;

            _iterator.f();

            return _context18.finish(17);

          case 20:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[1, 14, 17, 20]]);
  }));
  return _emitNotification.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsic3RvcmFnZSIsImdldE93bkZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImxvY2FscyIsImF1dGhfdXNlciIsIkVycm9ySGFuZGxlciIsIkZpbGUiLCJmaW5kIiwib3duZXIiLCJfaWQiLCJzb3J0IiwiYm9keSIsInNvcnRlZCIsInF1ZXJ5IiwicG9wdWxhdGUiLCJzZWxlY3QiLCJmaWxlcyIsIm1lc3NhZ2UiLCJnZXRTaGFyZWRGaWxlcyIsInNoYXJlZFdpdGgiLCJnZXRBbGxGaWxlcyIsImFsbEZpbGVzIiwiZ2V0UmVjZW50IiwicGF0aCIsIm9wdGlvbnMiLCJsaW1pdCIsInJlY2VudCIsImdldFNpbmdsZUZpbGUiLCJmaW5kT25lIiwiZmlsZUlkIiwicGFyYW1zIiwiZmlsZWlkIiwiZmlsZSIsIm5vdGlmaWNhdGlvbl9jaGFubmVsIiwidG8iLCJ1c2VybmFtZSIsImVtaXQiLCJkZWxldGVTaW5nbGVGaWxlIiwiZmluZE9uZUFuZERlbGV0ZSIsImZpbGVTdG9yYWdlSWQiLCJjcmVhdGVOZXdGaWxlIiwibG9nIiwicHVzaCIsInVzZXIiLCJsb2dUeXBlIiwiY29tbWVudCIsInNhdmUiLCJ1cGxvYWRGaWxlcyIsImJ1ZmZlciIsImZpbGV0eXBlIiwiYlN0cmVhbSIsIlBhc3NUaHJvdWdoIiwiZW5kIiwiYWRkIiwic3RvcmFnZUlkIiwibWltZSIsImV4dGVuc2lvbiIsImV4dCIsImNvbnNvbGUiLCJlcnJvciIsImFwcGVuZENvbW1lbnQiLCJlbWl0Tm90aWZpY2F0aW9uIiwibWFwIiwiZSIsInNldHRpbmdzIiwiZGlzcGxheU5hbWUiLCJ0aXRsZSIsImNoZWNrUGVybWlzc2lvblRvRmlsZSIsInBlcm1pdHRlZCIsImZpbHRlciIsImxlbmd0aCIsImNoZWNrRmlsZU93bmVyc2hpcCIsImxvY2tGaWxlIiwibG9ja2VkQnkiLCJsb2NrZWQiLCJ1bmxvY2tGaWxlIiwiZG93bmxvYWRGaWxlIiwiYXJjaGl2ZWQiLCJFcnJvciIsImdldCIsImZpbGVCdWZmZXIiLCJzaGFyZUZpbGUiLCJ1c2VyVG9TaGFyZSIsIndob1RvU2hhcmUiLCJhcmNoaXZlRmlsZSIsImFyY2hpdmUiLCJoYW5kbGVRdWV1ZSIsInF1ZXVlIiwicmVjcHMiLCJhY3Rpb25Db250ZW50IiwiZW1pdHRlciIsInJlY3AiLCJzb2NrZXRTdG9yZSIsInJlY3BfYWRyZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFLQTs7QUFDQTs7Ozs7Ozs7QUFKQSxJQUFNQSxPQUFPLEdBQUcsMkJBQWhCLEMsQ0FDQTs7QUFLQTtBQUNPLElBQU1DLFdBQVc7QUFBQSwyRkFBRyxpQkFBT0MsR0FBUCxFQUFxQkMsR0FBckIsRUFBb0NDLElBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUNsQkQsR0FBRyxDQUFDRSxNQUFKLENBQVdDLFNBRE87QUFBQTtBQUFBO0FBQUE7O0FBQUEsNkNBQ1dGLElBQUksQ0FBQyxJQUFJRyxtQkFBSixDQUFpQixHQUFqQixFQUFzQiw0QkFBdEIsQ0FBRCxDQURmOztBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUlEQyxXQUFLQyxJQUFMLENBQVU7QUFBRUMsY0FBQUEsS0FBSyxFQUFFUCxHQUFHLENBQUNFLE1BQUosQ0FBV0MsU0FBWCxDQUFxQks7QUFBOUIsYUFBVixFQUErQ0MsSUFBL0MsQ0FBb0RWLEdBQUcsQ0FBQ1csSUFBSixDQUFTQyxNQUFULElBQW1CWixHQUFHLENBQUNhLEtBQUosQ0FBVUQsTUFBN0IsSUFBdUMsUUFBM0YsRUFBcUdFLFFBQXJHLENBQThHLE9BQTlHLEVBQXVIQyxNQUF2SCxDQUE4SCw2RUFBOUgsQ0FKQzs7QUFBQTtBQUlmQyxZQUFBQSxLQUplO0FBS25CZixZQUFBQSxHQUFHLENBQUNFLE1BQUosQ0FBV2EsS0FBWCxHQUFtQkEsS0FBbkI7QUFMbUI7QUFBQTs7QUFB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QTtBQUFBO0FBQUEsR0FBakI7Ozs7QUFZQSxJQUFNRSxXQUFXO0FBQUEsNkZBQUcsbUJBQU90RixHQUFQLEVBQXFCQyxHQUFyQixFQUFvQ0MsSUFBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUN2QixvQkFBUUYsR0FBRyxDQUFDOEIsTUFBSixDQUFXeUQsS0FBbkI7QUFDSSxtQkFBSyxLQUFMO0FBREo7O0FBRHVCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUg7O0FBQUEsa0JBQVhELFdBQVc7QUFBQTtBQUFBO0FBQUEsR0FBakIsQyxDQU9QO0FBQ0E7Ozs7O1NBRWV6QixnQjs7Ozs7b0dBQWYsbUJBQWdDMkIsS0FBaEMsRUFBaURDLGFBQWpELEVBQXdFQyxPQUF4RTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbURBQ3FCRixLQURyQjtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ2FHLFlBQUFBLElBRGI7O0FBQUEsa0JBRVlBLElBQUksS0FBS0QsT0FGckI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxtQkFHNENFLHNCQUFZYixHQUFaLENBQWdCWSxJQUFoQixDQUg1Qzs7QUFBQTtBQUdnQkUsWUFBQUEsV0FIaEI7O0FBSVksZ0JBQUlBLFdBQUosRUFBaUI7QUFDYjVELDJDQUFxQkMsRUFBckIsMEJBQTBDMkQsV0FBMUMsR0FBeUR6RCxJQUF6RCxDQUE4RCxjQUE5RCxFQUE4RXFELGFBQTlFO0FBQ0g7O0FBTmI7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gXCJleHByZXNzXCJcclxuaW1wb3J0IHsgZnJvbUJ1ZmZlciBhcyBmaWxldHlwZUZyb21CdWZmZXIgfSBmcm9tICdmaWxlLXR5cGUnXHJcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSAnc3RyZWFtJ1xyXG5pbXBvcnQgeyBub3RpZmljYXRpb25fY2hhbm5lbCB9IGZyb20gJy4uL3NvY2tldCdcclxuaW1wb3J0IHsgc29ja2V0U3RvcmUgfSBmcm9tICcuLi9saWIvaGVscGVycy9rZXlzdG9yZSdcclxuLy8gaW1wb3J0ICogYXMgcXVldWUgZnJvbSAnZG9zaGl0J1xyXG5cclxuaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvZXJyb3InXHJcbmltcG9ydCBnZXRTdG9yYWdlIGZyb20gJy4uL2xpYi9zdG9yYWdlL2FkYXB0ZXJzJ1xyXG5cclxuY29uc3Qgc3RvcmFnZSA9IGdldFN0b3JhZ2UoKVxyXG4vLyBjb25zdCBxdWV1ZV9jbGllbnQgPSBxdWV1ZSgpXHJcblxyXG5pbXBvcnQgeyBGaWxlIH0gZnJvbSAnLi4vbW9kZWxzL2ZpbGUnXHJcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcclxuXHJcbi8vTW9kZWwgRmluZCBPcGVyYXRpb25zXHJcbmV4cG9ydCBjb25zdCBnZXRPd25GaWxlcyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgaWYgKCFyZXMubG9jYWxzLmF1dGhfdXNlcikgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIFwiQ2FuJ3QgYWNjZXNzIHVzZXIgcHJvcGVydHlcIikpXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgZmlsZXMgPSBhd2FpdCBGaWxlLmZpbmQoeyBvd25lcjogcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkIH0pLnNvcnQocmVxLmJvZHkuc29ydGVkIHx8IHJlcS5xdWVyeS5zb3J0ZWQgfHwgJy1kYXRlZCcpLnBvcHVsYXRlKCdvd25lcicpLnNlbGVjdCgndGl0bGUgZGF0ZWQgZmlsZUlkIGxvY2tlZCBleHRlbnNpb24gb3duZXIuc2V0dGluZ3MuZGlzcGxheU5hbWUgb3duZXIuYXZhdGFyJylcclxuICAgICAgICByZXMubG9jYWxzLmZpbGVzID0gZmlsZXNcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIChlcnJvciBhcyBFcnJvcikubWVzc2FnZSkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRTaGFyZWRGaWxlcyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgaWYgKCFyZXMubG9jYWxzLmF1dGhfdXNlcikgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIFwiQ2FuJ3QgYWNjZXNzIHVzZXIgcHJvcGVydHlcIikpXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgZmlsZXMgPSBhd2FpdCBGaWxlLmZpbmQoeyBzaGFyZWRXaXRoOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQgfSkuc29ydChyZXEuYm9keS5zb3J0ZWQgfHwgcmVxLnF1ZXJ5LnNvcnRlZCB8fCAnLWRhdGVkJykucG9wdWxhdGUoJ293bmVyJykuc2VsZWN0KCd0aXRsZSBkYXRlZCBmaWxlSWQgbG9ja2VkIGV4dGVuc2lvbiBvd25lci51c2VybmFtZSBvd25lci5hdmF0YXInKVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBmaWxlc1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbEZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBhbGxGaWxlcyA9IGF3YWl0IEZpbGUuZmluZCh7fSkucG9wdWxhdGUoJ293bmVyJylcclxuICAgICAgICByZXMubG9jYWxzLmZpbGVzID0gYWxsRmlsZXNcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBnZXR0aW5nIGRvY3VtZW50czogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSZWNlbnQgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmVzLmxvY2Fscy5yZWNlbnQgPSBhd2FpdCBGaWxlLmZpbmQoeyAnJG9yJzogW3sgb3duZXI6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCB9LCB7IHNoYXJlZFdpdGg6IHsgJyRpbic6IFtyZXMubG9jYWxzLmF1dGhfdXNlci5faWRdIH0gfV0gfSkucG9wdWxhdGUoeyBwYXRoOiAnbG9nLnVzZXInLCBzZWxlY3Q6ICd1c2VyLnNldHRpbmdzLmRpc3BsYXlOYW1lIHVzZXIuYXZhdGFyJywgb3B0aW9uczogeyBsaW1pdDogMSB9IH0pLyogLnNvcnQoJy1sb2cudGltZXN0YW1wJykuc2xpY2UoJ2xvZycsIC0yKS5sZWFuKCkuc2VsZWN0KCd0aXRsZSBsb2cnKS5saW1pdChyZXEucXVlcnkubGltaXQgfHwgMykgKi9cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBnZXR0aW5nIHJlY2VudDogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRTaW5nbGVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IEZpbGUuZmluZE9uZSh7IGZpbGVJZDogcmVxLnBhcmFtcy5maWxlaWQgfSlcclxuICAgICAgICAgICAgLnBvcHVsYXRlKCdvd25lcicpXHJcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnbG9ja2VkQnknKVxyXG4gICAgICAgICAgICAucG9wdWxhdGUoJ3NoYXJlZFdpdGgnKVxyXG4gICAgICAgICAgICAucG9wdWxhdGUoJ2xvZy51c2VyJylcclxuXHJcbiAgICAgICAgbm90aWZpY2F0aW9uX2NoYW5uZWwudG8ocmVzLmxvY2Fscy5hdXRoX3VzZXIudXNlcm5hbWUpLmVtaXQoJ25vdGlmaWNhdGlvbicsICdHZXR0aW5nIGZpbGUnKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVTaW5nbGVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlSWQgPSByZXEucGFyYW1zLmZpbGVpZCB8fCByZXEuYm9keS5maWxlaWQgfHwgcmVxLnF1ZXJ5LmZpbGVpZFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IEZpbGUuZmluZE9uZUFuZERlbGV0ZSh7IGZpbGVJZDogZmlsZUlkIH0pXHJcbiAgICAgICAgYXdhaXQgc3RvcmFnZS5kZWxldGUocmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWQpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZGVsZXRpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vQ3JlYXRlIEFuZCBVcGRhdGUgTW9kZWxcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVOZXdGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlaWQgPSB1dWlkKClcclxuICAgICAgICBsZXQgZmlsZSA9IG5ldyBGaWxlKHJlcS5ib2R5KVxyXG4gICAgICAgIGZpbGUub3duZXIgPSByZXMubG9jYWxzLmF1dGhfdXNlci5faWRcclxuICAgICAgICBmaWxlLmZpbGVJZCA9IGZpbGVpZFxyXG4gICAgICAgIGZpbGUubG9nLnB1c2goe1xyXG4gICAgICAgICAgICB1c2VyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdjcmVhdGVkIHRoaXMgZmlsZSdcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZpbGUubG9nLnB1c2goe1xyXG4gICAgICAgICAgICB1c2VyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQsXHJcbiAgICAgICAgICAgIGxvZ1R5cGU6ICdjb21tZW50ZWQnLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiByZXEuYm9keS5jb21tZW50XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUgPSBhd2FpdCBmaWxlLnNhdmUoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGNyZWF0aW5nIGRvY3VtZW50OiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVwbG9hZEZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxldHlwZSA9IGF3YWl0IGZpbGV0eXBlRnJvbUJ1ZmZlcihyZXEuZmlsZS5idWZmZXIpXHJcblxyXG4gICAgICAgIGxldCBiU3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoKClcclxuICAgICAgICBiU3RyZWFtLmVuZChyZXEuZmlsZS5idWZmZXIpXHJcblxyXG4gICAgICAgIGxldCBzdG9yYWdlSWQgPSBhd2FpdCBzdG9yYWdlLmFkZChiU3RyZWFtKVxyXG5cclxuICAgICAgICByZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZCA9IHN0b3JhZ2VJZFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5taW1lID0gZmlsZXR5cGU/Lm1pbWVcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUuZXh0ZW5zaW9uID0gZmlsZXR5cGU/LmV4dFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5zYXZlKClcclxuICAgICAgICBkZWxldGUgcmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWRcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGhhbmRsaW5nIGZpbGUgdXBsb2FkOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFwcGVuZENvbW1lbnQgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvZy5wdXNoKHtcclxuICAgICAgICAgICAgdXNlcjogcmVzLmxvY2Fscy5hdXRoX3VzZXIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5LmNvbW1lbnQsXHJcbiAgICAgICAgICAgIGxvZ1R5cGU6ICdjb21tZW50ZWQnXHJcbiAgICAgICAgfSlcclxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXHJcbiAgICAgICAgYXdhaXQgZW1pdE5vdGlmaWNhdGlvbihbcmVzLmxvY2Fscy5maWxlLm93bmVyLnVzZXJuYW1lLCAuLi5yZXMubG9jYWxzLmZpbGUuc2hhcmVkV2l0aC5tYXAoZSA9PiBlLnVzZXJuYW1lKV0sIGAke3Jlcy5sb2NhbHMuYXV0aF91c2VyLnNldHRpbmdzLmRpc3BsYXlOYW1lfSBjb21tZW50ZWQgb24gJHtyZXMubG9jYWxzLmZpbGUudGl0bGV9YCwgKHJlcy5sb2NhbHMuYXV0aF91c2VyLnVzZXJuYW1lIGFzIFN0cmluZykpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgbG9ja2luZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuLy8gTG9jayBPcGVyYXRpb25zXHJcblxyXG5leHBvcnQgY29uc3QgY2hlY2tQZXJtaXNzaW9uVG9GaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBsZXQgcGVybWl0dGVkID0gZmFsc2VcclxuXHJcbiAgICByZXMubG9jYWxzLmZpbGUuc2hhcmVkV2l0aC5maWx0ZXIoZSA9PiBlLnVzZXJuYW1lID09PSByZXMubG9jYWxzLmF1dGhfdXNlci51c2VybmFtZSkubGVuZ3RoID4gMCA/IHBlcm1pdHRlZCA9IHRydWUgOiBwZXJtaXR0ZWQgPSBmYWxzZVxyXG5cclxuICAgIGlmICghKHJlcy5sb2NhbHMuYXV0aF91c2VyLnVzZXJuYW1lID09IHJlcy5sb2NhbHMuZmlsZS5vd25lci51c2VybmFtZSB8fCBwZXJtaXR0ZWQpKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMSwgXCJGaWxlIGNhbid0IGJlIGNoZWNrZWQgb3V0IGJ5IHlvdVwiKSlcclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2hlY2tGaWxlT3duZXJzaGlwID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIShyZXMubG9jYWxzLmF1dGhfdXNlci5faWQgPT0gcmVzLmxvY2Fscy5maWxlLm93bmVyLl9pZCkpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAxLCAnWW91IGFyZSBub3QgcGVybWl0dGVkIHRvIGFjY2VzIHRoaXMgZmlsZScpKVxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBsb2NrRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUubG9ja2VkQnkgPSByZXMubG9jYWxzLmF1dGhfdXNlclxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWQgPSB0cnVlXHJcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGxvY2tpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1bmxvY2tGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWRCeSA9IG51bGxcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUubG9ja2VkID0gZmFsc2VcclxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgdW5sb2NraW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG4vLyBGaWxlIGRvd25sb2FkXHJcblxyXG5leHBvcnQgY29uc3QgZG93bmxvYWRGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vIGxldCB6aXAgPSBhd2FpdCBhcmNoaXZlKCd6aXAnKVxyXG4gICAgICAgIC8vIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgIC8vICAgICByZXMubG9jYWxzLmZpbGUucGFnZUhhc2hlcy5mb3JFYWNoKGFzeW5jIGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgbGV0IGJ1ZmZlciA9IGF3YWl0IHN0b3JhZ2UuZ2V0KGVsZW1lbnQpXHJcbiAgICAgICAgLy8gICAgICAgICB6aXAuYXBwZW5kKClcclxuICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAvLyApXHJcblxyXG4gICAgICAgIC8vIHJlcy5sb2NhbHMuemlwID0gemlwXHJcbiAgICAgICAgaWYgKHJlcy5sb2NhbHMuZmlsZS5hcmNoaXZlZCkgdGhyb3cgbmV3IEVycm9yKCdGaWxlIGlzIGFyY2hpdmVkJylcclxuXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlQnVmZmVyID0gYXdhaXQgc3RvcmFnZS5nZXQocmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWQpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZG93bmxvYWRpbmcgZmlsZTsgJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vIFNoYXJlXHJcblxyXG5leHBvcnQgY29uc3Qgc2hhcmVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCB1c2VyVG9TaGFyZSA9IHJlcS5ib2R5Lndob1RvU2hhcmUgfHwgcmVxLnF1ZXJ5LnVzZXJUb1NoYXJlXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLnNoYXJlZFdpdGgucHVzaCh1c2VyVG9TaGFyZSlcclxuXHJcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxyXG5cclxuICAgICAgICByZXMubG9jYWxzLmZpbGUgPSBhd2FpdCBGaWxlLmZpbmRPbmUoeyBmaWxlSWQ6IHJlcy5sb2NhbHMuZmlsZS5maWxlSWQgfSlcclxuICAgICAgICAgICAgLnBvcHVsYXRlKCdvd25lcicpXHJcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnc2hhcmVkV2l0aCcpXHJcblxyXG4gICAgICAgIGF3YWl0IGVtaXROb3RpZmljYXRpb24oW3Jlcy5sb2NhbHMuZmlsZS5vd25lci51c2VybmFtZSwgLi4ucmVzLmxvY2Fscy5maWxlLnNoYXJlZFdpdGgubWFwKGUgPT4gZS51c2VybmFtZSldLCBgJHtyZXMubG9jYWxzLmF1dGhfdXNlci5zZXR0aW5ncy5kaXNwbGF5TmFtZX0gc2hhcmVkICR7cmVzLmxvY2Fscy5maWxlLnRpdGxlfSB3aXRoIHlvdWAsIChyZXMubG9jYWxzLmF1dGhfdXNlci51c2VybmFtZSBhcyBTdHJpbmcpKVxyXG5cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBzaGFyaW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYXJjaGl2ZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgc3RvcmFnZS5hcmNoaXZlKHJlcy5sb2NhbHMuZmlsZS5maWxlU3RvcmFnZUlkKVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5hcmNoaXZlZCA9IHRydWVcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUgPSBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgYXJjaGl2aW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaGFuZGxlUXVldWUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAocmVxLnBhcmFtcy5xdWV1ZSkge1xyXG4gICAgICAgIGNhc2UgXCJvY3JcIjpcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEhFTFBFUiBGVU5DVElPTlxyXG4vLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGVtaXROb3RpZmljYXRpb24ocmVjcHM6IFtTdHJpbmddLCBhY3Rpb25Db250ZW50OiBTdHJpbmcsIGVtaXR0ZXI6IFN0cmluZykge1xyXG4gICAgZm9yIChsZXQgcmVjcCBvZiByZWNwcykge1xyXG4gICAgICAgIGlmIChyZWNwICE9PSBlbWl0dGVyKSB7XHJcbiAgICAgICAgICAgIGxldCByZWNwX2FkcmVzczogU3RyaW5nID0gYXdhaXQgc29ja2V0U3RvcmUuZ2V0KHJlY3ApXHJcbiAgICAgICAgICAgIGlmIChyZWNwX2FkcmVzcykge1xyXG4gICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uX2NoYW5uZWwudG8oYC9ub3RpZmljYXRpb25zIyR7cmVjcF9hZHJlc3N9YCkuZW1pdCgnbm90aWZpY2F0aW9uJywgYWN0aW9uQ29udGVudClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==