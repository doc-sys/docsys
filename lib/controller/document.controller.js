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
            }))), actionContext.log, {
              notificationTemplate: ["".concat(res.locals.auth_user.settings.displayName), 'commented on', "".concat(res.locals.file.title)],
              payload: res.locals.file.log,
              playNotification: true,
              actionAttentionURL: "/view/".concat(res.locals.file.fileId)
            }, res.locals.auth_user.username);

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
            }))), actionContext.share, {
              textTemplate: ["".concat(res.locals.auth_user.settings.displayName), 'shared', "".concat(res.locals.file.title), 'with you'],
              playNotification: true,
              actionAttentionURL: "/view/".concat(res.locals.file.fileId)
            }, res.locals.auth_user.username);

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
var actionContext;

(function (actionContext) {
  actionContext["log"] = "log";
  actionContext["share"] = "share";
})(actionContext || (actionContext = {}));

function emitNotification(_x52, _x53, _x54, _x55) {
  return _emitNotification.apply(this, arguments);
}

function _emitNotification() {
  _emitNotification = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(recps, actionContext, actionData, emitter) {
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

            console.log("recp: " + recp);
            _context18.next = 9;
            return _keystore.socketStore.get(recp);

          case 9:
            recp_adress = _context18.sent;
            console.log("recp_addr: " + recp_adress);

            if (recp_adress) {
              _socket.notification_channel.to("/notifications#".concat(recp_adress)).emit('notification', {
                type: actionContext,
                payload: actionData
              });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsic3RvcmFnZSIsImdldE93bkZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImxvY2FscyIsImF1dGhfdXNlciIsIkVycm9ySGFuZGxlciIsIkZpbGUiLCJmaW5kIiwib3duZXIiLCJfaWQiLCJzb3J0IiwiYm9keSIsInNvcnRlZCIsInF1ZXJ5IiwicG9wdWxhdGUiLCJzZWxlY3QiLCJmaWxlcyIsIm1lc3NhZ2UiLCJnZXRTaGFyZWRGaWxlcyIsInNoYXJlZFdpdGgiLCJnZXRBbGxGaWxlcyIsImFsbEZpbGVzIiwiZ2V0UmVjZW50IiwicGF0aCIsIm9wdGlvbnMiLCJsaW1pdCIsInJlY2VudCIsImdldFNpbmdsZUZpbGUiLCJmaW5kT25lIiwiZmlsZUlkIiwicGFyYW1zIiwiZmlsZWlkIiwiZmlsZSIsIm5vdGlmaWNhdGlvbl9jaGFubmVsIiwidG8iLCJ1c2VybmFtZSIsImVtaXQiLCJkZWxldGVTaW5nbGVGaWxlIiwiZmluZE9uZUFuZERlbGV0ZSIsImZpbGVTdG9yYWdlSWQiLCJjcmVhdGVOZXdGaWxlIiwibG9nIiwicHVzaCIsInVzZXIiLCJsb2dUeXBlIiwiY29tbWVudCIsInNhdmUiLCJ1cGxvYWRGaWxlcyIsImJ1ZmZlciIsImZpbGV0eXBlIiwiYlN0cmVhbSIsIlBhc3NUaHJvdWdoIiwiZW5kIiwiYWRkIiwic3RvcmFnZUlkIiwibWltZSIsImV4dGVuc2lvbiIsImV4dCIsImNvbnNvbGUiLCJlcnJvciIsImFwcGVuZENvbW1lbnQiLCJlbWl0Tm90aWZpY2F0aW9uIiwibWFwIiwiZSIsImFjdGlvbkNvbnRleHQiLCJub3RpZmljYXRpb25UZW1wbGF0ZSIsInNldHRpbmdzIiwiZGlzcGxheU5hbWUiLCJ0aXRsZSIsInBheWxvYWQiLCJwbGF5Tm90aWZpY2F0aW9uIiwiYWN0aW9uQXR0ZW50aW9uVVJMIiwiY2hlY2tQZXJtaXNzaW9uVG9GaWxlIiwicGVybWl0dGVkIiwiZmlsdGVyIiwibGVuZ3RoIiwiY2hlY2tGaWxlT3duZXJzaGlwIiwibG9ja0ZpbGUiLCJsb2NrZWRCeSIsImxvY2tlZCIsInVubG9ja0ZpbGUiLCJkb3dubG9hZEZpbGUiLCJhcmNoaXZlZCIsIkVycm9yIiwiZ2V0IiwiZmlsZUJ1ZmZlciIsInNoYXJlRmlsZSIsInVzZXJUb1NoYXJlIiwid2hvVG9TaGFyZSIsInNoYXJlIiwidGV4dFRlbXBsYXRlIiwiYXJjaGl2ZUZpbGUiLCJhcmNoaXZlIiwiaGFuZGxlUXVldWUiLCJxdWV1ZSIsInJlY3BzIiwiYWN0aW9uRGF0YSIsImVtaXR0ZXIiLCJyZWNwIiwic29ja2V0U3RvcmUiLCJyZWNwX2FkcmVzcyIsInR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOztBQUtBOztBQUNBOzs7Ozs7OztBQUpBLElBQU1BLE9BQU8sR0FBRywyQkFBaEIsQyxDQUNBOztBQU1BO0FBQ08sSUFBTUMsV0FBVztBQUFBLDJGQUFHLGlCQUFPQyxHQUFQLEVBQXFCQyxHQUFyQixFQUFvQ0MsSUFBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBQ2xCRCxHQUFHLENBQUNFLE1BQUosQ0FBV0MsU0FETztBQUFBO0FBQUE7QUFBQTs7QUFBQSw2Q0FDV0YsSUFBSSxDQUFDLElBQUlHLG1CQUFKLENBQWlCLEdBQWpCLEVBQXNCLDRCQUF0QixDQUFELENBRGY7O0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBSURDLFdBQUtDLElBQUwsQ0FBVTtBQUFFQyxjQUFBQSxLQUFLLEVBQUVQLEdBQUcsQ0FBQ0UsTUFBSixDQUFXQyxTQUFYLENBQXFCSztBQUE5QixhQUFWLEVBQStDQyxJQUEvQyxDQUFvRFYsR0FBRyxDQUFDVyxJQUFKLENBQVNDLE1BQVQsSUFBbUJaLEdBQUcsQ0FBQ2EsS0FBSixDQUFVRCxNQUE3QixJQUF1QyxRQUEzRixFQUFxR0UsUUFBckcsQ0FBOEcsT0FBOUcsRUFBdUhD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QUFBLEdBQWpCLEMsQ0FPUDtBQUNBOzs7O0lBUUs3QixhOztXQUFBQSxhO0FBQUFBLEVBQUFBLGE7QUFBQUEsRUFBQUEsYTtHQUFBQSxhLEtBQUFBLGE7O1NBS1VILGdCOzs7OztvR0FBZixtQkFBZ0NrQyxLQUFoQyxFQUFpRC9CLGFBQWpELEVBQStFZ0MsVUFBL0UsRUFBeUdDLE9BQXpHO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtREFDcUJGLEtBRHJCO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDYUcsWUFBQUEsSUFEYjs7QUFBQSxrQkFFWUEsSUFBSSxLQUFLRCxPQUZyQjtBQUFBO0FBQUE7QUFBQTs7QUFHWXZDLFlBQUFBLE9BQU8sQ0FBQ2pCLEdBQVIsQ0FBWSxXQUFXeUQsSUFBdkI7QUFIWjtBQUFBLG1CQUk0Q0Msc0JBQVlmLEdBQVosQ0FBZ0JjLElBQWhCLENBSjVDOztBQUFBO0FBSWdCRSxZQUFBQSxXQUpoQjtBQUtZMUMsWUFBQUEsT0FBTyxDQUFDakIsR0FBUixDQUFZLGdCQUFnQjJELFdBQTVCOztBQUNBLGdCQUFJQSxXQUFKLEVBQWlCO0FBQ2JuRSwyQ0FBcUJDLEVBQXJCLDBCQUEwQ2tFLFdBQTFDLEdBQXlEaEUsSUFBekQsQ0FBOEQsY0FBOUQsRUFBOEU7QUFDMUVpRSxnQkFBQUEsSUFBSSxFQUFFckMsYUFEb0U7QUFFMUVLLGdCQUFBQSxPQUFPLEVBQUUyQjtBQUZpRSxlQUE5RTtBQUlIOztBQVhiO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiXG5pbXBvcnQgeyBmcm9tQnVmZmVyIGFzIGZpbGV0eXBlRnJvbUJ1ZmZlciB9IGZyb20gJ2ZpbGUtdHlwZSdcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSAnc3RyZWFtJ1xuaW1wb3J0IHsgbm90aWZpY2F0aW9uX2NoYW5uZWwgfSBmcm9tICcuLi9zb2NrZXQnXG5pbXBvcnQgeyBzb2NrZXRTdG9yZSB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2tleXN0b3JlJ1xuLy8gaW1wb3J0ICogYXMgcXVldWUgZnJvbSAnZG9zaGl0J1xuXG5pbXBvcnQgeyBFcnJvckhhbmRsZXIgfSBmcm9tICcuLi9saWIvaGVscGVycy9lcnJvcidcbmltcG9ydCBnZXRTdG9yYWdlIGZyb20gJy4uL2xpYi9zdG9yYWdlL2FkYXB0ZXJzJ1xuXG5jb25zdCBzdG9yYWdlID0gZ2V0U3RvcmFnZSgpXG4vLyBjb25zdCBxdWV1ZV9jbGllbnQgPSBxdWV1ZSgpXG5cbmltcG9ydCB7IEZpbGUgfSBmcm9tICcuLi9tb2RlbHMvZmlsZSdcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IEJvb2wgfSBmcm9tIFwiYXdzLXNkay9jbGllbnRzL2Nsb3VkZGlyZWN0b3J5XCJcblxuLy9Nb2RlbCBGaW5kIE9wZXJhdGlvbnNcbmV4cG9ydCBjb25zdCBnZXRPd25GaWxlcyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIGlmICghcmVzLmxvY2Fscy5hdXRoX3VzZXIpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBcIkNhbid0IGFjY2VzcyB1c2VyIHByb3BlcnR5XCIpKVxuXG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IGZpbGVzID0gYXdhaXQgRmlsZS5maW5kKHsgb3duZXI6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCB9KS5zb3J0KHJlcS5ib2R5LnNvcnRlZCB8fCByZXEucXVlcnkuc29ydGVkIHx8ICctZGF0ZWQnKS5wb3B1bGF0ZSgnb3duZXInKS5zZWxlY3QoJ3RpdGxlIGRhdGVkIGZpbGVJZCBsb2NrZWQgZXh0ZW5zaW9uIG93bmVyLnNldHRpbmdzLmRpc3BsYXlOYW1lIG93bmVyLmF2YXRhcicpXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBmaWxlc1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmVkRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcblxuICAgIHRyeSB7XG4gICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IEZpbGUuZmluZCh7IHNoYXJlZFdpdGg6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCB9KS5zb3J0KHJlcS5ib2R5LnNvcnRlZCB8fCByZXEucXVlcnkuc29ydGVkIHx8ICctZGF0ZWQnKS5wb3B1bGF0ZSgnb3duZXInKS5zZWxlY3QoJ3RpdGxlIGRhdGVkIGZpbGVJZCBsb2NrZWQgZXh0ZW5zaW9uIG93bmVyLnVzZXJuYW1lIG93bmVyLmF2YXRhcicpXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBmaWxlc1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0QWxsRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBsZXQgYWxsRmlsZXMgPSBhd2FpdCBGaWxlLmZpbmQoe30pLnBvcHVsYXRlKCdvd25lcicpXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBhbGxGaWxlc1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZ2V0dGluZyBkb2N1bWVudHM6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0UmVjZW50ID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzLmxvY2Fscy5yZWNlbnQgPSBhd2FpdCBGaWxlLmZpbmQoeyAnJG9yJzogW3sgb3duZXI6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCB9LCB7IHNoYXJlZFdpdGg6IHsgJyRpbic6IFtyZXMubG9jYWxzLmF1dGhfdXNlci5faWRdIH0gfV0gfSkucG9wdWxhdGUoeyBwYXRoOiAnbG9nLnVzZXInLCBzZWxlY3Q6ICd1c2VyLnNldHRpbmdzLmRpc3BsYXlOYW1lIHVzZXIuYXZhdGFyJywgb3B0aW9uczogeyBsaW1pdDogMSB9IH0pLmxpbWl0KDMpLyogLnNvcnQoJy1sb2cudGltZXN0YW1wJykuc2xpY2UoJ2xvZycsIC0yKS5sZWFuKCkuc2VsZWN0KCd0aXRsZSBsb2cnKS5saW1pdChyZXEucXVlcnkubGltaXQgfHwgMykgKi9cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgcmVjZW50OiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGdldFNpbmdsZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXMubG9jYWxzLmZpbGUgPSBhd2FpdCBGaWxlLmZpbmRPbmUoeyBmaWxlSWQ6IHJlcS5wYXJhbXMuZmlsZWlkIH0pXG4gICAgICAgICAgICAucG9wdWxhdGUoJ293bmVyJylcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnbG9ja2VkQnknKVxuICAgICAgICAgICAgLnBvcHVsYXRlKCdzaGFyZWRXaXRoJylcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnbG9nLnVzZXInKVxuXG4gICAgICAgIG5vdGlmaWNhdGlvbl9jaGFubmVsLnRvKHJlcy5sb2NhbHMuYXV0aF91c2VyLnVzZXJuYW1lKS5lbWl0KCdub3RpZmljYXRpb24nLCAnR2V0dGluZyBmaWxlJylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXG4gICAgfVxuXG4gICAgbmV4dCgpXG59XG5cbmV4cG9ydCBjb25zdCBkZWxldGVTaW5nbGVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IGZpbGVJZCA9IHJlcS5wYXJhbXMuZmlsZWlkIHx8IHJlcS5ib2R5LmZpbGVpZCB8fCByZXEucXVlcnkuZmlsZWlkXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IEZpbGUuZmluZE9uZUFuZERlbGV0ZSh7IGZpbGVJZDogZmlsZUlkIH0pXG4gICAgICAgIGF3YWl0IHN0b3JhZ2UuZGVsZXRlKHJlcy5sb2NhbHMuZmlsZS5maWxlU3RvcmFnZUlkKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZGVsZXRpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXG4gICAgfVxuXG4gICAgbmV4dCgpXG59XG5cbi8vQ3JlYXRlIEFuZCBVcGRhdGUgTW9kZWxcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZU5ld0ZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBsZXQgZmlsZWlkID0gdXVpZCgpXG4gICAgICAgIGxldCBmaWxlID0gbmV3IEZpbGUocmVxLmJvZHkpXG4gICAgICAgIGZpbGUub3duZXIgPSByZXMubG9jYWxzLmF1dGhfdXNlci5faWRcbiAgICAgICAgZmlsZS5maWxlSWQgPSBmaWxlaWRcbiAgICAgICAgZmlsZS5sb2cucHVzaCh7XG4gICAgICAgICAgICB1c2VyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQsXG4gICAgICAgICAgICBtZXNzYWdlOiAnY3JlYXRlZCB0aGlzIGZpbGUnXG4gICAgICAgIH0pXG4gICAgICAgIGZpbGUubG9nLnB1c2goe1xuICAgICAgICAgICAgdXNlcjogcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkLFxuICAgICAgICAgICAgbG9nVHlwZTogJ2NvbW1lbnRlZCcsXG4gICAgICAgICAgICBtZXNzYWdlOiByZXEuYm9keS5jb21tZW50XG4gICAgICAgIH0pXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IGZpbGUuc2F2ZSgpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjcmVhdGluZyBkb2N1bWVudDogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXG4gICAgfVxuXG4gICAgbmV4dCgpXG59XG5cbmV4cG9ydCBjb25zdCB1cGxvYWRGaWxlcyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGxldCBmaWxldHlwZSA9IGF3YWl0IGZpbGV0eXBlRnJvbUJ1ZmZlcihyZXEuZmlsZS5idWZmZXIpXG5cbiAgICAgICAgbGV0IGJTdHJlYW0gPSBuZXcgUGFzc1Rocm91Z2goKVxuICAgICAgICBiU3RyZWFtLmVuZChyZXEuZmlsZS5idWZmZXIpXG5cbiAgICAgICAgbGV0IHN0b3JhZ2VJZCA9IGF3YWl0IHN0b3JhZ2UuYWRkKGJTdHJlYW0pXG5cbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWQgPSBzdG9yYWdlSWRcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLm1pbWUgPSBmaWxldHlwZT8ubWltZVxuICAgICAgICByZXMubG9jYWxzLmZpbGUuZXh0ZW5zaW9uID0gZmlsZXR5cGU/LmV4dFxuICAgICAgICByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXG4gICAgICAgIGRlbGV0ZSByZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZFxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgaGFuZGxpbmcgZmlsZSB1cGxvYWQ6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgYXBwZW5kQ29tbWVudCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2cucHVzaCh7XG4gICAgICAgICAgICB1c2VyOiByZXMubG9jYWxzLmF1dGhfdXNlcixcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5LmNvbW1lbnQsXG4gICAgICAgICAgICBsb2dUeXBlOiAnY29tbWVudGVkJ1xuICAgICAgICB9KVxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXG4gICAgICAgIGF3YWl0IGVtaXROb3RpZmljYXRpb24oW3Jlcy5sb2NhbHMuZmlsZS5vd25lci51c2VybmFtZSwgLi4ucmVzLmxvY2Fscy5maWxlLnNoYXJlZFdpdGgubWFwKGUgPT4gZS51c2VybmFtZSldLCBhY3Rpb25Db250ZXh0LmxvZywge1xuICAgICAgICAgICAgbm90aWZpY2F0aW9uVGVtcGxhdGU6IFtgJHtyZXMubG9jYWxzLmF1dGhfdXNlci5zZXR0aW5ncy5kaXNwbGF5TmFtZX1gLCAnY29tbWVudGVkIG9uJywgYCR7cmVzLmxvY2Fscy5maWxlLnRpdGxlfWBdLFxuICAgICAgICAgICAgcGF5bG9hZDogcmVzLmxvY2Fscy5maWxlLmxvZyxcbiAgICAgICAgICAgIHBsYXlOb3RpZmljYXRpb246IHRydWUsXG4gICAgICAgICAgICBhY3Rpb25BdHRlbnRpb25VUkw6IGAvdmlldy8ke3Jlcy5sb2NhbHMuZmlsZS5maWxlSWR9YFxuICAgICAgICB9LCAocmVzLmxvY2Fscy5hdXRoX3VzZXIudXNlcm5hbWUgYXMgU3RyaW5nKSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGxvY2tpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXG4gICAgfVxuXG4gICAgbmV4dCgpXG59XG5cbi8vIExvY2sgT3BlcmF0aW9uc1xuXG5leHBvcnQgY29uc3QgY2hlY2tQZXJtaXNzaW9uVG9GaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgbGV0IHBlcm1pdHRlZCA9IGZhbHNlXG5cbiAgICByZXMubG9jYWxzLmZpbGUuc2hhcmVkV2l0aC5maWx0ZXIoZSA9PiBlLnVzZXJuYW1lID09PSByZXMubG9jYWxzLmF1dGhfdXNlci51c2VybmFtZSkubGVuZ3RoID4gMCA/IHBlcm1pdHRlZCA9IHRydWUgOiBwZXJtaXR0ZWQgPSBmYWxzZVxuXG4gICAgaWYgKCEocmVzLmxvY2Fscy5hdXRoX3VzZXIudXNlcm5hbWUgPT0gcmVzLmxvY2Fscy5maWxlLm93bmVyLnVzZXJuYW1lIHx8IHBlcm1pdHRlZCkpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNDAxLCBcIkZpbGUgY2FuJ3QgYmUgY2hlY2tlZCBvdXQgYnkgeW91XCIpKVxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgY2hlY2tGaWxlT3duZXJzaGlwID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgaWYgKCEocmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkID09IHJlcy5sb2NhbHMuZmlsZS5vd25lci5faWQpKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMSwgJ1lvdSBhcmUgbm90IHBlcm1pdHRlZCB0byBhY2NlcyB0aGlzIGZpbGUnKSlcbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGxvY2tGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvY2tlZEJ5ID0gcmVzLmxvY2Fscy5hdXRoX3VzZXJcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvY2tlZCA9IHRydWVcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgbG9ja2luZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IHVubG9ja0ZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXMubG9jYWxzLmZpbGUubG9ja2VkQnkgPSBudWxsXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWQgPSBmYWxzZVxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciB1bmxvY2tpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXG4gICAgfVxuXG4gICAgbmV4dCgpXG59XG5cbi8vIEZpbGUgZG93bmxvYWRcblxuZXhwb3J0IGNvbnN0IGRvd25sb2FkRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIC8vIGxldCB6aXAgPSBhd2FpdCBhcmNoaXZlKCd6aXAnKVxuICAgICAgICAvLyBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgLy8gICAgIHJlcy5sb2NhbHMuZmlsZS5wYWdlSGFzaGVzLmZvckVhY2goYXN5bmMgZWxlbWVudCA9PiB7XG4gICAgICAgIC8vICAgICAgICAgbGV0IGJ1ZmZlciA9IGF3YWl0IHN0b3JhZ2UuZ2V0KGVsZW1lbnQpXG4gICAgICAgIC8vICAgICAgICAgemlwLmFwcGVuZCgpXG4gICAgICAgIC8vICAgICB9KVxuICAgICAgICAvLyApXG5cbiAgICAgICAgLy8gcmVzLmxvY2Fscy56aXAgPSB6aXBcbiAgICAgICAgaWYgKHJlcy5sb2NhbHMuZmlsZS5hcmNoaXZlZCkgdGhyb3cgbmV3IEVycm9yKCdGaWxlIGlzIGFyY2hpdmVkJylcblxuICAgICAgICByZXMubG9jYWxzLmZpbGVCdWZmZXIgPSBhd2FpdCBzdG9yYWdlLmdldChyZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGRvd25sb2FkaW5nIGZpbGU7ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG4vLyBTaGFyZVxuXG5leHBvcnQgY29uc3Qgc2hhcmVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IHVzZXJUb1NoYXJlID0gcmVxLmJvZHkud2hvVG9TaGFyZSB8fCByZXEucXVlcnkudXNlclRvU2hhcmVcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLnNoYXJlZFdpdGgucHVzaCh1c2VyVG9TaGFyZSlcblxuICAgICAgICBhd2FpdCByZXMubG9jYWxzLmZpbGUuc2F2ZSgpXG5cbiAgICAgICAgcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgRmlsZS5maW5kT25lKHsgZmlsZUlkOiByZXMubG9jYWxzLmZpbGUuZmlsZUlkIH0pXG4gICAgICAgICAgICAucG9wdWxhdGUoJ293bmVyJylcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnc2hhcmVkV2l0aCcpXG5cbiAgICAgICAgY29uc29sZS5sb2cocmVzLmxvY2Fscy5maWxlKVxuXG4gICAgICAgIGF3YWl0IGVtaXROb3RpZmljYXRpb24oW3Jlcy5sb2NhbHMuZmlsZS5vd25lci51c2VybmFtZSwgLi4ucmVzLmxvY2Fscy5maWxlLnNoYXJlZFdpdGgubWFwKGUgPT4gZS51c2VybmFtZSldLCBhY3Rpb25Db250ZXh0LnNoYXJlLCB7XG4gICAgICAgICAgICB0ZXh0VGVtcGxhdGU6IFtgJHtyZXMubG9jYWxzLmF1dGhfdXNlci5zZXR0aW5ncy5kaXNwbGF5TmFtZX1gLCAnc2hhcmVkJywgYCR7cmVzLmxvY2Fscy5maWxlLnRpdGxlfWAsICd3aXRoIHlvdSddLFxuICAgICAgICAgICAgcGxheU5vdGlmaWNhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGFjdGlvbkF0dGVudGlvblVSTDogYC92aWV3LyR7cmVzLmxvY2Fscy5maWxlLmZpbGVJZH1gXG4gICAgICAgIH0sIChyZXMubG9jYWxzLmF1dGhfdXNlci51c2VybmFtZSBhcyBTdHJpbmcpKVxuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBzaGFyaW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgYXJjaGl2ZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBzdG9yYWdlLmFyY2hpdmUocmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWQpXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5hcmNoaXZlZCA9IHRydWVcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlID0gYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgYXJjaGl2aW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgaGFuZGxlUXVldWUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICBzd2l0Y2ggKHJlcS5wYXJhbXMucXVldWUpIHtcbiAgICAgICAgY2FzZSBcIm9jclwiOlxuXG4gICAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05cbi8vIC0tLS0tLS0tLS0tLS0tLVxuaW50ZXJmYWNlIGFjdGlvbkRhdGFJZiB7XG4gICAgcGF5bG9hZD86IGFueSxcbiAgICBub3RpZmljYXRpb25UZW1wbGF0ZTogQXJyYXk8U3RyaW5nPixcbiAgICBwbGF5Tm90aWZpY2F0aW9uPzogQm9vbCxcbiAgICBhY3Rpb25BdHRlbnRpb25VUkw/OiBTdHJpbmdcbn1cblxuZW51bSBhY3Rpb25Db250ZXh0IHtcbiAgICBsb2cgPSAnbG9nJyxcbiAgICBzaGFyZSA9ICdzaGFyZSdcbn1cblxuYXN5bmMgZnVuY3Rpb24gZW1pdE5vdGlmaWNhdGlvbihyZWNwczogW1N0cmluZ10sIGFjdGlvbkNvbnRleHQ6IGFjdGlvbkNvbnRleHQsIGFjdGlvbkRhdGE6IGFjdGlvbkRhdGFJZiwgZW1pdHRlcjogU3RyaW5nKSB7XG4gICAgZm9yIChsZXQgcmVjcCBvZiByZWNwcykge1xuICAgICAgICBpZiAocmVjcCAhPT0gZW1pdHRlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWNwOiBcIiArIHJlY3ApXG4gICAgICAgICAgICBsZXQgcmVjcF9hZHJlc3M6IFN0cmluZyA9IGF3YWl0IHNvY2tldFN0b3JlLmdldChyZWNwKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWNwX2FkZHI6IFwiICsgcmVjcF9hZHJlc3MpXG4gICAgICAgICAgICBpZiAocmVjcF9hZHJlc3MpIHtcbiAgICAgICAgICAgICAgICBub3RpZmljYXRpb25fY2hhbm5lbC50byhgL25vdGlmaWNhdGlvbnMjJHtyZWNwX2FkcmVzc31gKS5lbWl0KCdub3RpZmljYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGFjdGlvbkNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IGFjdGlvbkRhdGFcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSJdfQ==