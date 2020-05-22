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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsic3RvcmFnZSIsImdldE93bkZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImxvY2FscyIsImF1dGhfdXNlciIsIkVycm9ySGFuZGxlciIsIkZpbGUiLCJmaW5kIiwib3duZXIiLCJfaWQiLCJzb3J0IiwiYm9keSIsInNvcnRlZCIsInF1ZXJ5IiwicG9wdWxhdGUiLCJzZWxlY3QiLCJmaWxlcyIsIm1lc3NhZ2UiLCJnZXRTaGFyZWRGaWxlcyIsInNoYXJlZFdpdGgiLCJnZXRBbGxGaWxlcyIsImFsbEZpbGVzIiwiZ2V0UmVjZW50IiwicGF0aCIsIm9wdGlvbnMiLCJsaW1pdCIsInJlY2VudCIsImdldFNpbmdsZUZpbGUiLCJmaW5kT25lIiwiZmlsZUlkIiwicGFyYW1zIiwiZmlsZWlkIiwiZmlsZSIsIm5vdGlmaWNhdGlvbl9jaGFubmVsIiwidG8iLCJ1c2VybmFtZSIsImVtaXQiLCJkZWxldGVTaW5nbGVGaWxlIiwiZmluZE9uZUFuZERlbGV0ZSIsImZpbGVTdG9yYWdlSWQiLCJjcmVhdGVOZXdGaWxlIiwibG9nIiwicHVzaCIsInVzZXIiLCJsb2dUeXBlIiwiY29tbWVudCIsInNhdmUiLCJ1cGxvYWRGaWxlcyIsImJ1ZmZlciIsImZpbGV0eXBlIiwiYlN0cmVhbSIsIlBhc3NUaHJvdWdoIiwiZW5kIiwiYWRkIiwic3RvcmFnZUlkIiwibWltZSIsImV4dGVuc2lvbiIsImV4dCIsImNvbnNvbGUiLCJlcnJvciIsImFwcGVuZENvbW1lbnQiLCJlbWl0Tm90aWZpY2F0aW9uIiwibWFwIiwiZSIsInNldHRpbmdzIiwiZGlzcGxheU5hbWUiLCJ0aXRsZSIsImNoZWNrUGVybWlzc2lvblRvRmlsZSIsInBlcm1pdHRlZCIsImZpbHRlciIsImxlbmd0aCIsImNoZWNrRmlsZU93bmVyc2hpcCIsImxvY2tGaWxlIiwibG9ja2VkQnkiLCJsb2NrZWQiLCJ1bmxvY2tGaWxlIiwiZG93bmxvYWRGaWxlIiwiYXJjaGl2ZWQiLCJFcnJvciIsImdldCIsImZpbGVCdWZmZXIiLCJzaGFyZUZpbGUiLCJ1c2VyVG9TaGFyZSIsIndob1RvU2hhcmUiLCJhcmNoaXZlRmlsZSIsImFyY2hpdmUiLCJoYW5kbGVRdWV1ZSIsInF1ZXVlIiwicmVjcHMiLCJhY3Rpb25Db250ZW50IiwiZW1pdHRlciIsInJlY3AiLCJzb2NrZXRTdG9yZSIsInJlY3BfYWRyZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFLQTs7QUFDQTs7Ozs7Ozs7QUFKQSxJQUFNQSxPQUFPLEdBQUcsMkJBQWhCLEMsQ0FDQTs7QUFLQTtBQUNPLElBQU1DLFdBQVc7QUFBQSwyRkFBRyxpQkFBT0MsR0FBUCxFQUFxQkMsR0FBckIsRUFBb0NDLElBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUNsQkQsR0FBRyxDQUFDRSxNQUFKLENBQVdDLFNBRE87QUFBQTtBQUFBO0FBQUE7O0FBQUEsNkNBQ1dGLElBQUksQ0FBQyxJQUFJRyxtQkFBSixDQUFpQixHQUFqQixFQUFzQiw0QkFBdEIsQ0FBRCxDQURmOztBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUlEQyxXQUFLQyxJQUFMLENBQVU7QUFBRUMsY0FBQUEsS0FBSyxFQUFFUCxHQUFHLENBQUNFLE1BQUosQ0FBV0MsU0FBWCxDQUFxQks7QUFBOUIsYUFBVixFQUErQ0MsSUFBL0MsQ0FBb0RWLEdBQUcsQ0FBQ1csSUFBSixDQUFTQyxNQUFULElBQW1CWixHQUFHLENBQUNhLEtBQUosQ0FBVUQsTUFBN0IsSUFBdUMsUUFBM0YsRUFBcUdFLFFBQXJHLENBQThHLE9BQTlHLEVBQXVIQyxNQUF2SCxDQUE4SCw2RUFBOUgsQ0FKQzs7QUFBQTtBQUlmQyxZQUFBQSxLQUplO0FBS25CZixZQUFBQSxHQUFHLENBQUNFLE1BQUosQ0FBV2EsS0FBWCxHQUFtQkEsS0FBbkI7QUFMbUI7QUFBQTs7QUFB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QUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSBcImV4cHJlc3NcIlxyXG5pbXBvcnQgeyBmcm9tQnVmZmVyIGFzIGZpbGV0eXBlRnJvbUJ1ZmZlciB9IGZyb20gJ2ZpbGUtdHlwZSdcclxuaW1wb3J0IHsgUGFzc1Rocm91Z2ggfSBmcm9tICdzdHJlYW0nXHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbl9jaGFubmVsIH0gZnJvbSAnLi4vc29ja2V0J1xyXG5pbXBvcnQgeyBzb2NrZXRTdG9yZSB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2tleXN0b3JlJ1xyXG4vLyBpbXBvcnQgKiBhcyBxdWV1ZSBmcm9tICdkb3NoaXQnXHJcblxyXG5pbXBvcnQgeyBFcnJvckhhbmRsZXIgfSBmcm9tICcuLi9saWIvaGVscGVycy9lcnJvcidcclxuaW1wb3J0IGdldFN0b3JhZ2UgZnJvbSAnLi4vbGliL3N0b3JhZ2UvYWRhcHRlcnMnXHJcblxyXG5jb25zdCBzdG9yYWdlID0gZ2V0U3RvcmFnZSgpXHJcbi8vIGNvbnN0IHF1ZXVlX2NsaWVudCA9IHF1ZXVlKClcclxuXHJcbmltcG9ydCB7IEZpbGUgfSBmcm9tICcuLi9tb2RlbHMvZmlsZSdcclxuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xyXG5cclxuLy9Nb2RlbCBGaW5kIE9wZXJhdGlvbnNcclxuZXhwb3J0IGNvbnN0IGdldE93bkZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IEZpbGUuZmluZCh7IG93bmVyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQgfSkuc29ydChyZXEuYm9keS5zb3J0ZWQgfHwgcmVxLnF1ZXJ5LnNvcnRlZCB8fCAnLWRhdGVkJykucG9wdWxhdGUoJ293bmVyJykuc2VsZWN0KCd0aXRsZSBkYXRlZCBmaWxlSWQgbG9ja2VkIGV4dGVuc2lvbiBvd25lci5zZXR0aW5ncy5kaXNwbGF5TmFtZSBvd25lci5hdmF0YXInKVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBmaWxlc1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNoYXJlZEZpbGVzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IEZpbGUuZmluZCh7IHNoYXJlZFdpdGg6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCB9KS5zb3J0KHJlcS5ib2R5LnNvcnRlZCB8fCByZXEucXVlcnkuc29ydGVkIHx8ICctZGF0ZWQnKS5wb3B1bGF0ZSgnb3duZXInKS5zZWxlY3QoJ3RpdGxlIGRhdGVkIGZpbGVJZCBsb2NrZWQgZXh0ZW5zaW9uIG93bmVyLnVzZXJuYW1lIG93bmVyLmF2YXRhcicpXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlcyA9IGZpbGVzXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGFsbEZpbGVzID0gYXdhaXQgRmlsZS5maW5kKHt9KS5wb3B1bGF0ZSgnb3duZXInKVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBhbGxGaWxlc1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgZG9jdW1lbnRzOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlY2VudCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXMubG9jYWxzLnJlY2VudCA9IGF3YWl0IEZpbGUuZmluZCh7ICckb3InOiBbeyBvd25lcjogcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkIH0sIHsgc2hhcmVkV2l0aDogeyAnJGluJzogW3Jlcy5sb2NhbHMuYXV0aF91c2VyLl9pZF0gfSB9XSB9KS5wb3B1bGF0ZSh7IHBhdGg6ICdsb2cudXNlcicsIHNlbGVjdDogJ3VzZXIuc2V0dGluZ3MuZGlzcGxheU5hbWUgdXNlci5hdmF0YXInLCBvcHRpb25zOiB7IGxpbWl0OiAxIH0gfSkubGltaXQoMykvKiAuc29ydCgnLWxvZy50aW1lc3RhbXAnKS5zbGljZSgnbG9nJywgLTIpLmxlYW4oKS5zZWxlY3QoJ3RpdGxlIGxvZycpLmxpbWl0KHJlcS5xdWVyeS5saW1pdCB8fCAzKSAqL1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgcmVjZW50OiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNpbmdsZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgRmlsZS5maW5kT25lKHsgZmlsZUlkOiByZXEucGFyYW1zLmZpbGVpZCB9KVxyXG4gICAgICAgICAgICAucG9wdWxhdGUoJ293bmVyJylcclxuICAgICAgICAgICAgLnBvcHVsYXRlKCdsb2NrZWRCeScpXHJcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnc2hhcmVkV2l0aCcpXHJcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnbG9nLnVzZXInKVxyXG5cclxuICAgICAgICBub3RpZmljYXRpb25fY2hhbm5lbC50byhyZXMubG9jYWxzLmF1dGhfdXNlci51c2VybmFtZSkuZW1pdCgnbm90aWZpY2F0aW9uJywgJ0dldHRpbmcgZmlsZScpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZ2V0dGluZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVNpbmdsZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGZpbGVJZCA9IHJlcS5wYXJhbXMuZmlsZWlkIHx8IHJlcS5ib2R5LmZpbGVpZCB8fCByZXEucXVlcnkuZmlsZWlkXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgRmlsZS5maW5kT25lQW5kRGVsZXRlKHsgZmlsZUlkOiBmaWxlSWQgfSlcclxuICAgICAgICBhd2FpdCBzdG9yYWdlLmRlbGV0ZShyZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBkZWxldGluZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuLy9DcmVhdGUgQW5kIFVwZGF0ZSBNb2RlbFxyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZU5ld0ZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGZpbGVpZCA9IHV1aWQoKVxyXG4gICAgICAgIGxldCBmaWxlID0gbmV3IEZpbGUocmVxLmJvZHkpXHJcbiAgICAgICAgZmlsZS5vd25lciA9IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZFxyXG4gICAgICAgIGZpbGUuZmlsZUlkID0gZmlsZWlkXHJcbiAgICAgICAgZmlsZS5sb2cucHVzaCh7XHJcbiAgICAgICAgICAgIHVzZXI6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ2NyZWF0ZWQgdGhpcyBmaWxlJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZmlsZS5sb2cucHVzaCh7XHJcbiAgICAgICAgICAgIHVzZXI6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCxcclxuICAgICAgICAgICAgbG9nVHlwZTogJ2NvbW1lbnRlZCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5LmNvbW1lbnRcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IGZpbGUuc2F2ZSgpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgY3JlYXRpbmcgZG9jdW1lbnQ6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXBsb2FkRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGZpbGV0eXBlID0gYXdhaXQgZmlsZXR5cGVGcm9tQnVmZmVyKHJlcS5maWxlLmJ1ZmZlcilcclxuXHJcbiAgICAgICAgbGV0IGJTdHJlYW0gPSBuZXcgUGFzc1Rocm91Z2goKVxyXG4gICAgICAgIGJTdHJlYW0uZW5kKHJlcS5maWxlLmJ1ZmZlcilcclxuXHJcbiAgICAgICAgbGV0IHN0b3JhZ2VJZCA9IGF3YWl0IHN0b3JhZ2UuYWRkKGJTdHJlYW0pXHJcblxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5maWxlU3RvcmFnZUlkID0gc3RvcmFnZUlkXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLm1pbWUgPSBmaWxldHlwZT8ubWltZVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5leHRlbnNpb24gPSBmaWxldHlwZT8uZXh0XHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxyXG4gICAgICAgIGRlbGV0ZSByZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZFxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgaGFuZGxpbmcgZmlsZSB1cGxvYWQ6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYXBwZW5kQ29tbWVudCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUubG9nLnB1c2goe1xyXG4gICAgICAgICAgICB1c2VyOiByZXMubG9jYWxzLmF1dGhfdXNlcixcclxuICAgICAgICAgICAgbWVzc2FnZTogcmVxLmJvZHkuY29tbWVudCxcclxuICAgICAgICAgICAgbG9nVHlwZTogJ2NvbW1lbnRlZCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIGF3YWl0IHJlcy5sb2NhbHMuZmlsZS5zYXZlKClcclxuICAgICAgICBhd2FpdCBlbWl0Tm90aWZpY2F0aW9uKFtyZXMubG9jYWxzLmZpbGUub3duZXIudXNlcm5hbWUsIC4uLnJlcy5sb2NhbHMuZmlsZS5zaGFyZWRXaXRoLm1hcChlID0+IGUudXNlcm5hbWUpXSwgYCR7cmVzLmxvY2Fscy5hdXRoX3VzZXIuc2V0dGluZ3MuZGlzcGxheU5hbWV9IGNvbW1lbnRlZCBvbiAke3Jlcy5sb2NhbHMuZmlsZS50aXRsZX1gLCAocmVzLmxvY2Fscy5hdXRoX3VzZXIudXNlcm5hbWUgYXMgU3RyaW5nKSlcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBsb2NraW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG4vLyBMb2NrIE9wZXJhdGlvbnNcclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja1Blcm1pc3Npb25Ub0ZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGxldCBwZXJtaXR0ZWQgPSBmYWxzZVxyXG5cclxuICAgIHJlcy5sb2NhbHMuZmlsZS5zaGFyZWRXaXRoLmZpbHRlcihlID0+IGUudXNlcm5hbWUgPT09IHJlcy5sb2NhbHMuYXV0aF91c2VyLnVzZXJuYW1lKS5sZW5ndGggPiAwID8gcGVybWl0dGVkID0gdHJ1ZSA6IHBlcm1pdHRlZCA9IGZhbHNlXHJcblxyXG4gICAgaWYgKCEocmVzLmxvY2Fscy5hdXRoX3VzZXIudXNlcm5hbWUgPT0gcmVzLmxvY2Fscy5maWxlLm93bmVyLnVzZXJuYW1lIHx8IHBlcm1pdHRlZCkpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAxLCBcIkZpbGUgY2FuJ3QgYmUgY2hlY2tlZCBvdXQgYnkgeW91XCIpKVxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja0ZpbGVPd25lcnNoaXAgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGlmICghKHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCA9PSByZXMubG9jYWxzLmZpbGUub3duZXIuX2lkKSkgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDEsICdZb3UgYXJlIG5vdCBwZXJtaXR0ZWQgdG8gYWNjZXMgdGhpcyBmaWxlJykpXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGxvY2tGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWRCeSA9IHJlcy5sb2NhbHMuYXV0aF91c2VyXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvY2tlZCA9IHRydWVcclxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgbG9ja2luZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVubG9ja0ZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvY2tlZEJ5ID0gbnVsbFxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWQgPSBmYWxzZVxyXG4gICAgICAgIGF3YWl0IHJlcy5sb2NhbHMuZmlsZS5zYXZlKClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciB1bmxvY2tpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vIEZpbGUgZG93bmxvYWRcclxuXHJcbmV4cG9ydCBjb25zdCBkb3dubG9hZEZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy8gbGV0IHppcCA9IGF3YWl0IGFyY2hpdmUoJ3ppcCcpXHJcbiAgICAgICAgLy8gYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgLy8gICAgIHJlcy5sb2NhbHMuZmlsZS5wYWdlSGFzaGVzLmZvckVhY2goYXN5bmMgZWxlbWVudCA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICBsZXQgYnVmZmVyID0gYXdhaXQgc3RvcmFnZS5nZXQoZWxlbWVudClcclxuICAgICAgICAvLyAgICAgICAgIHppcC5hcHBlbmQoKVxyXG4gICAgICAgIC8vICAgICB9KVxyXG4gICAgICAgIC8vIClcclxuXHJcbiAgICAgICAgLy8gcmVzLmxvY2Fscy56aXAgPSB6aXBcclxuICAgICAgICBpZiAocmVzLmxvY2Fscy5maWxlLmFyY2hpdmVkKSB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGUgaXMgYXJjaGl2ZWQnKVxyXG5cclxuICAgICAgICByZXMubG9jYWxzLmZpbGVCdWZmZXIgPSBhd2FpdCBzdG9yYWdlLmdldChyZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBkb3dubG9hZGluZyBmaWxlOyAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuLy8gU2hhcmVcclxuXHJcbmV4cG9ydCBjb25zdCBzaGFyZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHVzZXJUb1NoYXJlID0gcmVxLmJvZHkud2hvVG9TaGFyZSB8fCByZXEucXVlcnkudXNlclRvU2hhcmVcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUuc2hhcmVkV2l0aC5wdXNoKHVzZXJUb1NoYXJlKVxyXG5cclxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXHJcblxyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IEZpbGUuZmluZE9uZSh7IGZpbGVJZDogcmVzLmxvY2Fscy5maWxlLmZpbGVJZCB9KVxyXG4gICAgICAgICAgICAucG9wdWxhdGUoJ293bmVyJylcclxuICAgICAgICAgICAgLnBvcHVsYXRlKCdzaGFyZWRXaXRoJylcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzLmxvY2Fscy5maWxlKVxyXG5cclxuICAgICAgICBhd2FpdCBlbWl0Tm90aWZpY2F0aW9uKFtyZXMubG9jYWxzLmZpbGUub3duZXIudXNlcm5hbWUsIC4uLnJlcy5sb2NhbHMuZmlsZS5zaGFyZWRXaXRoLm1hcChlID0+IGUudXNlcm5hbWUpXSwgYCR7cmVzLmxvY2Fscy5hdXRoX3VzZXIuc2V0dGluZ3MuZGlzcGxheU5hbWV9IHNoYXJlZCAke3Jlcy5sb2NhbHMuZmlsZS50aXRsZX0gd2l0aCB5b3VgLCAocmVzLmxvY2Fscy5hdXRoX3VzZXIudXNlcm5hbWUgYXMgU3RyaW5nKSlcclxuXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3Igc2hhcmluZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFyY2hpdmVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHN0b3JhZ2UuYXJjaGl2ZShyZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZClcclxuICAgICAgICByZXMubG9jYWxzLmZpbGUuYXJjaGl2ZWQgPSB0cnVlXHJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGFyY2hpdmluZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGhhbmRsZVF1ZXVlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKHJlcS5wYXJhbXMucXVldWUpIHtcclxuICAgICAgICBjYXNlIFwib2NyXCI6XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBIRUxQRVIgRlVOQ1RJT05cclxuLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5hc3luYyBmdW5jdGlvbiBlbWl0Tm90aWZpY2F0aW9uKHJlY3BzOiBbU3RyaW5nXSwgYWN0aW9uQ29udGVudDogU3RyaW5nLCBlbWl0dGVyOiBTdHJpbmcpIHtcclxuICAgIGZvciAobGV0IHJlY3Agb2YgcmVjcHMpIHtcclxuICAgICAgICBpZiAocmVjcCAhPT0gZW1pdHRlcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZWNwKVxyXG4gICAgICAgICAgICBsZXQgcmVjcF9hZHJlc3M6IFN0cmluZyA9IGF3YWl0IHNvY2tldFN0b3JlLmdldChyZWNwKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZWNwX2FkcmVzcylcclxuICAgICAgICAgICAgaWYgKHJlY3BfYWRyZXNzKSB7XHJcbiAgICAgICAgICAgICAgICBub3RpZmljYXRpb25fY2hhbm5lbC50byhgL25vdGlmaWNhdGlvbnMjJHtyZWNwX2FkcmVzc31gKS5lbWl0KCdub3RpZmljYXRpb24nLCBhY3Rpb25Db250ZW50KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19