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
            }).limit(3);

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
            console.log(res.locals.file);
            _context15.next = 11;
            return emitNotification([res.locals.file.owner.username].concat((0, _toConsumableArray2["default"])(res.locals.file.sharedWith.map(function (e) {
              return e.username;
            }))), "".concat(res.locals.auth_user.settings.displayName, " shared ").concat(res.locals.file.title, " with you"), res.locals.auth_user.username);

          case 11:
            _context15.next = 16;
            break;

          case 13:
            _context15.prev = 13;
            _context15.t0 = _context15["catch"](0);
            return _context15.abrupt("return", next(new _error.ErrorHandler(500, "Error sharing file: ".concat(_context15.t0.message))));

          case 16:
            next();

          case 17:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 13]]);
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
              _context18.next = 14;
              break;
            }

            recp = _step.value;

            if (!(recp !== emitter)) {
              _context18.next = 12;
              break;
            }

            console.log(recp);
            _context18.next = 9;
            return _keystore.socketStore.get(recp);

          case 9:
            recp_adress = _context18.sent;
            console.log(recp_adress);

            if (recp_adress) {
              _socket.notification_channel.to("/notifications#".concat(recp_adress)).emit('notification', actionContent);
            }

          case 12:
            _context18.next = 3;
            break;

          case 14:
            _context18.next = 19;
            break;

          case 16:
            _context18.prev = 16;
            _context18.t0 = _context18["catch"](1);

            _iterator.e(_context18.t0);

          case 19:
            _context18.prev = 19;

            _iterator.f();

            return _context18.finish(19);

          case 22:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[1, 16, 19, 22]]);
  }));
  return _emitNotification.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsic3RvcmFnZSIsImdldE93bkZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImxvY2FscyIsImF1dGhfdXNlciIsIkVycm9ySGFuZGxlciIsIkZpbGUiLCJmaW5kIiwib3duZXIiLCJfaWQiLCJzb3J0IiwiYm9keSIsInNvcnRlZCIsInF1ZXJ5IiwicG9wdWxhdGUiLCJzZWxlY3QiLCJmaWxlcyIsIm1lc3NhZ2UiLCJnZXRTaGFyZWRGaWxlcyIsInNoYXJlZFdpdGgiLCJnZXRBbGxGaWxlcyIsImFsbEZpbGVzIiwiZ2V0UmVjZW50IiwicGF0aCIsIm9wdGlvbnMiLCJsaW1pdCIsInJlY2VudCIsImdldFNpbmdsZUZpbGUiLCJmaW5kT25lIiwiZmlsZUlkIiwicGFyYW1zIiwiZmlsZWlkIiwiZmlsZSIsIm5vdGlmaWNhdGlvbl9jaGFubmVsIiwidG8iLCJ1c2VybmFtZSIsImVtaXQiLCJkZWxldGVTaW5nbGVGaWxlIiwiZmluZE9uZUFuZERlbGV0ZSIsImZpbGVTdG9yYWdlSWQiLCJjcmVhdGVOZXdGaWxlIiwibG9nIiwicHVzaCIsInVzZXIiLCJsb2dUeXBlIiwiY29tbWVudCIsInNhdmUiLCJ1cGxvYWRGaWxlcyIsImJ1ZmZlciIsImZpbGV0eXBlIiwiYlN0cmVhbSIsIlBhc3NUaHJvdWdoIiwiZW5kIiwiYWRkIiwic3RvcmFnZUlkIiwibWltZSIsImV4dGVuc2lvbiIsImV4dCIsImNvbnNvbGUiLCJlcnJvciIsImFwcGVuZENvbW1lbnQiLCJlbWl0Tm90aWZpY2F0aW9uIiwibWFwIiwiZSIsInNldHRpbmdzIiwiZGlzcGxheU5hbWUiLCJ0aXRsZSIsImNoZWNrUGVybWlzc2lvblRvRmlsZSIsInBlcm1pdHRlZCIsImZpbHRlciIsImxlbmd0aCIsImNoZWNrRmlsZU93bmVyc2hpcCIsImxvY2tGaWxlIiwibG9ja2VkQnkiLCJsb2NrZWQiLCJ1bmxvY2tGaWxlIiwiZG93bmxvYWRGaWxlIiwiYXJjaGl2ZWQiLCJFcnJvciIsImdldCIsImZpbGVCdWZmZXIiLCJzaGFyZUZpbGUiLCJ1c2VyVG9TaGFyZSIsIndob1RvU2hhcmUiLCJhcmNoaXZlRmlsZSIsImFyY2hpdmUiLCJoYW5kbGVRdWV1ZSIsInF1ZXVlIiwicmVjcHMiLCJhY3Rpb25Db250ZW50IiwiZW1pdHRlciIsInJlY3AiLCJzb2NrZXRTdG9yZSIsInJlY3BfYWRyZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFLQTs7QUFDQTs7Ozs7Ozs7QUFKQSxJQUFNQSxPQUFPLEdBQUcsMkJBQWhCLEMsQ0FDQTs7QUFLQTtBQUNPLElBQU1DLFdBQVc7QUFBQSwyRkFBRyxpQkFBT0MsR0FBUCxFQUFxQkMsR0FBckIsRUFBb0NDLElBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUNsQkQsR0FBRyxDQUFDRSxNQUFKLENBQVdDLFNBRE87QUFBQTtBQUFBO0FBQUE7O0FBQUEsNkNBQ1dGLElBQUksQ0FBQyxJQUFJRyxtQkFBSixDQUFpQixHQUFqQixFQUFzQiw0QkFBdEIsQ0FBRCxDQURmOztBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUlEQyxXQUFLQyxJQUFMLENBQVU7QUFBRUMsY0FBQUEsS0FBSyxFQUFFUCxHQUFHLENBQUNFLE1BQUosQ0FBV0MsU0FBWCxDQUFxQks7QUFBOUIsYUFBVixFQUErQ0MsSUFBL0MsQ0FBb0RWLEdBQUcsQ0FBQ1csSUFBSixDQUFTQyxNQUFULElBQW1CWixHQUFHLENBQUNhLEtBQUosQ0FBVUQsTUFBN0IsSUFBdUMsUUFBM0YsRUFBcUdFLFFBQXJHLENBQThHLE9BQTlHLEVBQXVIQyxNQUF2SCxDQUE4SCw2RUFBOUgsQ0FKQzs7QUFBQTtBQUlmQyxZQUFBQSxLQUplO0FBS25CZixZQUFBQSxHQUFHLENBQUNFLE1BQUosQ0FBV2EsS0FBWCxHQUFtQkEsS0FBbkI7QUFMbUI7QUFBQTs7QUFB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QUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSBcImV4cHJlc3NcIlxuaW1wb3J0IHsgZnJvbUJ1ZmZlciBhcyBmaWxldHlwZUZyb21CdWZmZXIgfSBmcm9tICdmaWxlLXR5cGUnXG5pbXBvcnQgeyBQYXNzVGhyb3VnaCB9IGZyb20gJ3N0cmVhbSdcbmltcG9ydCB7IG5vdGlmaWNhdGlvbl9jaGFubmVsIH0gZnJvbSAnLi4vc29ja2V0J1xuaW1wb3J0IHsgc29ja2V0U3RvcmUgfSBmcm9tICcuLi9saWIvaGVscGVycy9rZXlzdG9yZSdcbi8vIGltcG9ydCAqIGFzIHF1ZXVlIGZyb20gJ2Rvc2hpdCdcblxuaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvZXJyb3InXG5pbXBvcnQgZ2V0U3RvcmFnZSBmcm9tICcuLi9saWIvc3RvcmFnZS9hZGFwdGVycydcblxuY29uc3Qgc3RvcmFnZSA9IGdldFN0b3JhZ2UoKVxuLy8gY29uc3QgcXVldWVfY2xpZW50ID0gcXVldWUoKVxuXG5pbXBvcnQgeyBGaWxlIH0gZnJvbSAnLi4vbW9kZWxzL2ZpbGUnXG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5cbi8vTW9kZWwgRmluZCBPcGVyYXRpb25zXG5leHBvcnQgY29uc3QgZ2V0T3duRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcblxuICAgIHRyeSB7XG4gICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IEZpbGUuZmluZCh7IG93bmVyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQgfSkuc29ydChyZXEuYm9keS5zb3J0ZWQgfHwgcmVxLnF1ZXJ5LnNvcnRlZCB8fCAnLWRhdGVkJykucG9wdWxhdGUoJ293bmVyJykuc2VsZWN0KCd0aXRsZSBkYXRlZCBmaWxlSWQgbG9ja2VkIGV4dGVuc2lvbiBvd25lci5zZXR0aW5ncy5kaXNwbGF5TmFtZSBvd25lci5hdmF0YXInKVxuICAgICAgICByZXMubG9jYWxzLmZpbGVzID0gZmlsZXNcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGdldFNoYXJlZEZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgaWYgKCFyZXMubG9jYWxzLmF1dGhfdXNlcikgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIFwiQ2FuJ3QgYWNjZXNzIHVzZXIgcHJvcGVydHlcIikpXG5cbiAgICB0cnkge1xuICAgICAgICBsZXQgZmlsZXMgPSBhd2FpdCBGaWxlLmZpbmQoeyBzaGFyZWRXaXRoOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQgfSkuc29ydChyZXEuYm9keS5zb3J0ZWQgfHwgcmVxLnF1ZXJ5LnNvcnRlZCB8fCAnLWRhdGVkJykucG9wdWxhdGUoJ293bmVyJykuc2VsZWN0KCd0aXRsZSBkYXRlZCBmaWxlSWQgbG9ja2VkIGV4dGVuc2lvbiBvd25lci51c2VybmFtZSBvd25lci5hdmF0YXInKVxuICAgICAgICByZXMubG9jYWxzLmZpbGVzID0gZmlsZXNcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGdldEFsbEZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IGFsbEZpbGVzID0gYXdhaXQgRmlsZS5maW5kKHt9KS5wb3B1bGF0ZSgnb3duZXInKVxuICAgICAgICByZXMubG9jYWxzLmZpbGVzID0gYWxsRmlsZXNcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgZG9jdW1lbnRzOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGdldFJlY2VudCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJlcy5sb2NhbHMucmVjZW50ID0gYXdhaXQgRmlsZS5maW5kKHsgJyRvcic6IFt7IG93bmVyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQgfSwgeyBzaGFyZWRXaXRoOiB7ICckaW4nOiBbcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkXSB9IH1dIH0pLnBvcHVsYXRlKHsgcGF0aDogJ2xvZy51c2VyJywgc2VsZWN0OiAndXNlci5zZXR0aW5ncy5kaXNwbGF5TmFtZSB1c2VyLmF2YXRhcicsIG9wdGlvbnM6IHsgbGltaXQ6IDEgfSB9KS5saW1pdCgzKS8qIC5zb3J0KCctbG9nLnRpbWVzdGFtcCcpLnNsaWNlKCdsb2cnLCAtMikubGVhbigpLnNlbGVjdCgndGl0bGUgbG9nJykubGltaXQocmVxLnF1ZXJ5LmxpbWl0IHx8IDMpICovXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBnZXR0aW5nIHJlY2VudDogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXG4gICAgfVxuXG4gICAgbmV4dCgpXG59XG5cbmV4cG9ydCBjb25zdCBnZXRTaW5nbGVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgRmlsZS5maW5kT25lKHsgZmlsZUlkOiByZXEucGFyYW1zLmZpbGVpZCB9KVxuICAgICAgICAgICAgLnBvcHVsYXRlKCdvd25lcicpXG4gICAgICAgICAgICAucG9wdWxhdGUoJ2xvY2tlZEJ5JylcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnc2hhcmVkV2l0aCcpXG4gICAgICAgICAgICAucG9wdWxhdGUoJ2xvZy51c2VyJylcblxuICAgICAgICBub3RpZmljYXRpb25fY2hhbm5lbC50byhyZXMubG9jYWxzLmF1dGhfdXNlci51c2VybmFtZSkuZW1pdCgnbm90aWZpY2F0aW9uJywgJ0dldHRpbmcgZmlsZScpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBnZXR0aW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgZGVsZXRlU2luZ2xlRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGxldCBmaWxlSWQgPSByZXEucGFyYW1zLmZpbGVpZCB8fCByZXEuYm9keS5maWxlaWQgfHwgcmVxLnF1ZXJ5LmZpbGVpZFxuICAgICAgICByZXMubG9jYWxzLmZpbGUgPSBhd2FpdCBGaWxlLmZpbmRPbmVBbmREZWxldGUoeyBmaWxlSWQ6IGZpbGVJZCB9KVxuICAgICAgICBhd2FpdCBzdG9yYWdlLmRlbGV0ZShyZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGRlbGV0aW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG4vL0NyZWF0ZSBBbmQgVXBkYXRlIE1vZGVsXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOZXdGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IGZpbGVpZCA9IHV1aWQoKVxuICAgICAgICBsZXQgZmlsZSA9IG5ldyBGaWxlKHJlcS5ib2R5KVxuICAgICAgICBmaWxlLm93bmVyID0gcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkXG4gICAgICAgIGZpbGUuZmlsZUlkID0gZmlsZWlkXG4gICAgICAgIGZpbGUubG9nLnB1c2goe1xuICAgICAgICAgICAgdXNlcjogcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkLFxuICAgICAgICAgICAgbWVzc2FnZTogJ2NyZWF0ZWQgdGhpcyBmaWxlJ1xuICAgICAgICB9KVxuICAgICAgICBmaWxlLmxvZy5wdXNoKHtcbiAgICAgICAgICAgIHVzZXI6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCxcbiAgICAgICAgICAgIGxvZ1R5cGU6ICdjb21tZW50ZWQnLFxuICAgICAgICAgICAgbWVzc2FnZTogcmVxLmJvZHkuY29tbWVudFxuICAgICAgICB9KVxuICAgICAgICByZXMubG9jYWxzLmZpbGUgPSBhd2FpdCBmaWxlLnNhdmUoKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgY3JlYXRpbmcgZG9jdW1lbnQ6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgdXBsb2FkRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBsZXQgZmlsZXR5cGUgPSBhd2FpdCBmaWxldHlwZUZyb21CdWZmZXIocmVxLmZpbGUuYnVmZmVyKVxuXG4gICAgICAgIGxldCBiU3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoKClcbiAgICAgICAgYlN0cmVhbS5lbmQocmVxLmZpbGUuYnVmZmVyKVxuXG4gICAgICAgIGxldCBzdG9yYWdlSWQgPSBhd2FpdCBzdG9yYWdlLmFkZChiU3RyZWFtKVxuXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5maWxlU3RvcmFnZUlkID0gc3RvcmFnZUlkXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5taW1lID0gZmlsZXR5cGU/Lm1pbWVcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmV4dGVuc2lvbiA9IGZpbGV0eXBlPy5leHRcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxuICAgICAgICBkZWxldGUgcmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWRcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGhhbmRsaW5nIGZpbGUgdXBsb2FkOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGFwcGVuZENvbW1lbnQgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXMubG9jYWxzLmZpbGUubG9nLnB1c2goe1xuICAgICAgICAgICAgdXNlcjogcmVzLmxvY2Fscy5hdXRoX3VzZXIsXG4gICAgICAgICAgICBtZXNzYWdlOiByZXEuYm9keS5jb21tZW50LFxuICAgICAgICAgICAgbG9nVHlwZTogJ2NvbW1lbnRlZCdcbiAgICAgICAgfSlcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxuICAgICAgICBhd2FpdCBlbWl0Tm90aWZpY2F0aW9uKFtyZXMubG9jYWxzLmZpbGUub3duZXIudXNlcm5hbWUsIC4uLnJlcy5sb2NhbHMuZmlsZS5zaGFyZWRXaXRoLm1hcChlID0+IGUudXNlcm5hbWUpXSwgYCR7cmVzLmxvY2Fscy5hdXRoX3VzZXIuc2V0dGluZ3MuZGlzcGxheU5hbWV9IGNvbW1lbnRlZCBvbiAke3Jlcy5sb2NhbHMuZmlsZS50aXRsZX1gLCAocmVzLmxvY2Fscy5hdXRoX3VzZXIudXNlcm5hbWUgYXMgU3RyaW5nKSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGxvY2tpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXG4gICAgfVxuXG4gICAgbmV4dCgpXG59XG5cbi8vIExvY2sgT3BlcmF0aW9uc1xuXG5leHBvcnQgY29uc3QgY2hlY2tQZXJtaXNzaW9uVG9GaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgbGV0IHBlcm1pdHRlZCA9IGZhbHNlXG5cbiAgICByZXMubG9jYWxzLmZpbGUuc2hhcmVkV2l0aC5maWx0ZXIoZSA9PiBlLnVzZXJuYW1lID09PSByZXMubG9jYWxzLmF1dGhfdXNlci51c2VybmFtZSkubGVuZ3RoID4gMCA/IHBlcm1pdHRlZCA9IHRydWUgOiBwZXJtaXR0ZWQgPSBmYWxzZVxuXG4gICAgaWYgKCEocmVzLmxvY2Fscy5hdXRoX3VzZXIudXNlcm5hbWUgPT0gcmVzLmxvY2Fscy5maWxlLm93bmVyLnVzZXJuYW1lIHx8IHBlcm1pdHRlZCkpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAxLCBcIkZpbGUgY2FuJ3QgYmUgY2hlY2tlZCBvdXQgYnkgeW91XCIpKVxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgY2hlY2tGaWxlT3duZXJzaGlwID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgaWYgKCEocmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkID09IHJlcy5sb2NhbHMuZmlsZS5vd25lci5faWQpKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMSwgJ1lvdSBhcmUgbm90IHBlcm1pdHRlZCB0byBhY2NlcyB0aGlzIGZpbGUnKSlcbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGxvY2tGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvY2tlZEJ5ID0gcmVzLmxvY2Fscy5hdXRoX3VzZXJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvY2tlZCA9IHRydWVcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgbG9ja2luZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IHVubG9ja0ZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXMubG9jYWxzLmZpbGUubG9ja2VkQnkgPSBudWxsXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWQgPSBmYWxzZVxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciB1bmxvY2tpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXG4gICAgfVxuXG4gICAgbmV4dCgpXG59XG5cbi8vIEZpbGUgZG93bmxvYWRcblxuZXhwb3J0IGNvbnN0IGRvd25sb2FkRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIC8vIGxldCB6aXAgPSBhd2FpdCBhcmNoaXZlKCd6aXAnKVxuICAgICAgICAvLyBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgLy8gICAgIHJlcy5sb2NhbHMuZmlsZS5wYWdlSGFzaGVzLmZvckVhY2goYXN5bmMgZWxlbWVudCA9PiB7XG4gICAgICAgIC8vICAgICAgICAgbGV0IGJ1ZmZlciA9IGF3YWl0IHN0b3JhZ2UuZ2V0KGVsZW1lbnQpXG4gICAgICAgIC8vICAgICAgICAgemlwLmFwcGVuZCgpXG4gICAgICAgIC8vICAgICB9KVxuICAgICAgICAvLyApXG5cbiAgICAgICAgLy8gcmVzLmxvY2Fscy56aXAgPSB6aXBcbiAgICAgICAgaWYgKHJlcy5sb2NhbHMuZmlsZS5hcmNoaXZlZCkgdGhyb3cgbmV3IEVycm9yKCdGaWxlIGlzIGFyY2hpdmVkJylcblxuICAgICAgICByZXMubG9jYWxzLmZpbGVCdWZmZXIgPSBhd2FpdCBzdG9yYWdlLmdldChyZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGRvd25sb2FkaW5nIGZpbGU7ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG4vLyBTaGFyZVxuXG5leHBvcnQgY29uc3Qgc2hhcmVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IHVzZXJUb1NoYXJlID0gcmVxLmJvZHkud2hvVG9TaGFyZSB8fCByZXEucXVlcnkudXNlclRvU2hhcmVcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLnNoYXJlZFdpdGgucHVzaCh1c2VyVG9TaGFyZSlcblxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXG5cbiAgICAgICAgcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgRmlsZS5maW5kT25lKHsgZmlsZUlkOiByZXMubG9jYWxzLmZpbGUuZmlsZUlkIH0pXG4gICAgICAgICAgICAucG9wdWxhdGUoJ293bmVyJylcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnc2hhcmVkV2l0aCcpXG5cbiAgICAgICAgY29uc29sZS5sb2cocmVzLmxvY2Fscy5maWxlKVxuXG4gICAgICAgIGF3YWl0IGVtaXROb3RpZmljYXRpb24oW3Jlcy5sb2NhbHMuZmlsZS5vd25lci51c2VybmFtZSwgLi4ucmVzLmxvY2Fscy5maWxlLnNoYXJlZFdpdGgubWFwKGUgPT4gZS51c2VybmFtZSldLCBgJHtyZXMubG9jYWxzLmF1dGhfdXNlci5zZXR0aW5ncy5kaXNwbGF5TmFtZX0gc2hhcmVkICR7cmVzLmxvY2Fscy5maWxlLnRpdGxlfSB3aXRoIHlvdWAsIChyZXMubG9jYWxzLmF1dGhfdXNlci51c2VybmFtZSBhcyBTdHJpbmcpKVxuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBzaGFyaW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgYXJjaGl2ZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBzdG9yYWdlLmFyY2hpdmUocmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWQpXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5hcmNoaXZlZCA9IHRydWVcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgYXJjaGl2aW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgaGFuZGxlUXVldWUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICBzd2l0Y2ggKHJlcS5wYXJhbXMucXVldWUpIHtcbiAgICAgICAgY2FzZSBcIm9jclwiOlxuXG4gICAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05cbi8vIC0tLS0tLS0tLS0tLS0tLVxuXG5hc3luYyBmdW5jdGlvbiBlbWl0Tm90aWZpY2F0aW9uKHJlY3BzOiBbU3RyaW5nXSwgYWN0aW9uQ29udGVudDogU3RyaW5nLCBlbWl0dGVyOiBTdHJpbmcpIHtcbiAgICBmb3IgKGxldCByZWNwIG9mIHJlY3BzKSB7XG4gICAgICAgIGlmIChyZWNwICE9PSBlbWl0dGVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZWNwKVxuICAgICAgICAgICAgbGV0IHJlY3BfYWRyZXNzOiBTdHJpbmcgPSBhd2FpdCBzb2NrZXRTdG9yZS5nZXQocmVjcClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlY3BfYWRyZXNzKVxuICAgICAgICAgICAgaWYgKHJlY3BfYWRyZXNzKSB7XG4gICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uX2NoYW5uZWwudG8oYC9ub3RpZmljYXRpb25zIyR7cmVjcF9hZHJlc3N9YCkuZW1pdCgnbm90aWZpY2F0aW9uJywgYWN0aW9uQ29udGVudClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iXX0=