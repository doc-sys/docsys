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
            }).populate('owner').populate('lockedBy').populate('sharedWith').populate('log.user').sort('');

          case 3:
            res.locals.file = _context5.sent;
            _context5.next = 9;
            break;

          case 6:
            _context5.prev = 6;
            _context5.t0 = _context5["catch"](0);
            return _context5.abrupt("return", next(new _error.ErrorHandler(500, "Error getting file: ".concat(_context5.t0.message))));

          case 9:
            next();

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 6]]);
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
              console.log("emitting to ".concat(recp_adress));

              _socket.notification_channel.to("/api/notifications#".concat(recp_adress)).emit('notification', {
                type: actionContext,
                payload: actionData
              });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsic3RvcmFnZSIsImdldE93bkZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImxvY2FscyIsImF1dGhfdXNlciIsIkVycm9ySGFuZGxlciIsIkZpbGUiLCJmaW5kIiwib3duZXIiLCJfaWQiLCJzb3J0IiwiYm9keSIsInNvcnRlZCIsInF1ZXJ5IiwicG9wdWxhdGUiLCJzZWxlY3QiLCJmaWxlcyIsIm1lc3NhZ2UiLCJnZXRTaGFyZWRGaWxlcyIsInNoYXJlZFdpdGgiLCJnZXRBbGxGaWxlcyIsImFsbEZpbGVzIiwiZ2V0UmVjZW50IiwicGF0aCIsIm9wdGlvbnMiLCJsaW1pdCIsInJlY2VudCIsImdldFNpbmdsZUZpbGUiLCJmaW5kT25lIiwiZmlsZUlkIiwicGFyYW1zIiwiZmlsZWlkIiwiZmlsZSIsImRlbGV0ZVNpbmdsZUZpbGUiLCJmaW5kT25lQW5kRGVsZXRlIiwiZmlsZVN0b3JhZ2VJZCIsImNyZWF0ZU5ld0ZpbGUiLCJsb2ciLCJwdXNoIiwidXNlciIsImxvZ1R5cGUiLCJjb21tZW50Iiwic2F2ZSIsInVwbG9hZEZpbGVzIiwiYnVmZmVyIiwiZmlsZXR5cGUiLCJiU3RyZWFtIiwiUGFzc1Rocm91Z2giLCJlbmQiLCJhZGQiLCJzdG9yYWdlSWQiLCJtaW1lIiwiZXh0ZW5zaW9uIiwiZXh0IiwiY29uc29sZSIsImVycm9yIiwiYXBwZW5kQ29tbWVudCIsImVtaXROb3RpZmljYXRpb24iLCJ1c2VybmFtZSIsIm1hcCIsImUiLCJhY3Rpb25Db250ZXh0Iiwibm90aWZpY2F0aW9uVGVtcGxhdGUiLCJzZXR0aW5ncyIsImRpc3BsYXlOYW1lIiwidGl0bGUiLCJwYXlsb2FkIiwicGxheU5vdGlmaWNhdGlvbiIsImFjdGlvbkF0dGVudGlvblVSTCIsImNoZWNrUGVybWlzc2lvblRvRmlsZSIsInBlcm1pdHRlZCIsImZpbHRlciIsImxlbmd0aCIsImNoZWNrRmlsZU93bmVyc2hpcCIsImxvY2tGaWxlIiwibG9ja2VkQnkiLCJsb2NrZWQiLCJ1bmxvY2tGaWxlIiwiZG93bmxvYWRGaWxlIiwiYXJjaGl2ZWQiLCJFcnJvciIsImdldCIsImZpbGVCdWZmZXIiLCJzaGFyZUZpbGUiLCJ1c2VyVG9TaGFyZSIsIndob1RvU2hhcmUiLCJzaGFyZSIsInRleHRUZW1wbGF0ZSIsImFyY2hpdmVGaWxlIiwiYXJjaGl2ZSIsImhhbmRsZVF1ZXVlIiwicXVldWUiLCJyZWNwcyIsImFjdGlvbkRhdGEiLCJlbWl0dGVyIiwicmVjcCIsInNvY2tldFN0b3JlIiwicmVjcF9hZHJlc3MiLCJub3RpZmljYXRpb25fY2hhbm5lbCIsInRvIiwiZW1pdCIsInR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOztBQUtBOztBQUNBOzs7Ozs7OztBQUpBLElBQU1BLE9BQU8sR0FBRywyQkFBaEIsQyxDQUNBOztBQU1BO0FBQ08sSUFBTUMsV0FBVztBQUFBLDJGQUFHLGlCQUFPQyxHQUFQLEVBQXFCQyxHQUFyQixFQUFvQ0MsSUFBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBQ2xCRCxHQUFHLENBQUNFLE1BQUosQ0FBV0MsU0FETztBQUFBO0FBQUE7QUFBQTs7QUFBQSw2Q0FDV0YsSUFBSSxDQUFDLElBQUlHLG1CQUFKLENBQWlCLEdBQWpCLEVBQXNCLDRCQUF0QixDQUFELENBRGY7O0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBSURDLFdBQUtDLElBQUwsQ0FBVTtBQUFFQyxjQUFBQSxLQUFLLEVBQUVQLEdBQUcsQ0FBQ0UsTUFBSixDQUFXQyxTQUFYLENBQXFCSztBQUE5QixhQUFWLEVBQStDQyxJQUEvQyxDQUFvRFYsR0FBRyxDQUFDVyxJQUFKLENBQVNDLE1BQVQsSUFBbUJaLEdBQUcsQ0FBQ2EsS0FBSixDQUFVRCxNQUE3QixJQUF1QyxRQUEzRixFQUFxR0UsUUFBckcsQ0FBOEcsT0FBOUcsRUFBdUhD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Ozs7O29HQUFmLG1CQUFnQ21DLEtBQWhDLEVBQWlEL0IsYUFBakQsRUFBK0VnQyxVQUEvRSxFQUF5R0MsT0FBekc7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1EQUNxQkYsS0FEckI7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNhRyxZQUFBQSxJQURiOztBQUFBLGtCQUVZQSxJQUFJLEtBQUtELE9BRnJCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsbUJBRzRDRSxzQkFBWWYsR0FBWixDQUFnQmMsSUFBaEIsQ0FINUM7O0FBQUE7QUFHZ0JFLFlBQUFBLFdBSGhCOztBQUlZLGdCQUFJQSxXQUFKLEVBQWlCO0FBQ2IzQyxjQUFBQSxPQUFPLENBQUNqQixHQUFSLHVCQUEyQjRELFdBQTNCOztBQUNBQywyQ0FBcUJDLEVBQXJCLDhCQUE4Q0YsV0FBOUMsR0FBNkRHLElBQTdELENBQWtFLGNBQWxFLEVBQWtGO0FBQzlFQyxnQkFBQUEsSUFBSSxFQUFFeEMsYUFEd0U7QUFFOUVLLGdCQUFBQSxPQUFPLEVBQUUyQjtBQUZxRSxlQUFsRjtBQUlIOztBQVZiO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiXG5pbXBvcnQgeyBmcm9tQnVmZmVyIGFzIGZpbGV0eXBlRnJvbUJ1ZmZlciB9IGZyb20gJ2ZpbGUtdHlwZSdcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSAnc3RyZWFtJ1xuaW1wb3J0IHsgbm90aWZpY2F0aW9uX2NoYW5uZWwgfSBmcm9tICcuLi9zb2NrZXQnXG5pbXBvcnQgeyBzb2NrZXRTdG9yZSB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2tleXN0b3JlJ1xuLy8gaW1wb3J0ICogYXMgcXVldWUgZnJvbSAnZG9zaGl0J1xuXG5pbXBvcnQgeyBFcnJvckhhbmRsZXIgfSBmcm9tICcuLi9saWIvaGVscGVycy9lcnJvcidcbmltcG9ydCBnZXRTdG9yYWdlIGZyb20gJy4uL2xpYi9zdG9yYWdlL2FkYXB0ZXJzJ1xuXG5jb25zdCBzdG9yYWdlID0gZ2V0U3RvcmFnZSgpXG4vLyBjb25zdCBxdWV1ZV9jbGllbnQgPSBxdWV1ZSgpXG5cbmltcG9ydCB7IEZpbGUgfSBmcm9tICcuLi9tb2RlbHMvZmlsZSdcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IEJvb2wgfSBmcm9tIFwiYXdzLXNkay9jbGllbnRzL2Nsb3VkZGlyZWN0b3J5XCJcblxuLy9Nb2RlbCBGaW5kIE9wZXJhdGlvbnNcbmV4cG9ydCBjb25zdCBnZXRPd25GaWxlcyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIGlmICghcmVzLmxvY2Fscy5hdXRoX3VzZXIpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBcIkNhbid0IGFjY2VzcyB1c2VyIHByb3BlcnR5XCIpKVxuXG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IGZpbGVzID0gYXdhaXQgRmlsZS5maW5kKHsgb3duZXI6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCB9KS5zb3J0KHJlcS5ib2R5LnNvcnRlZCB8fCByZXEucXVlcnkuc29ydGVkIHx8ICctZGF0ZWQnKS5wb3B1bGF0ZSgnb3duZXInKS5zZWxlY3QoJ3RpdGxlIGRhdGVkIGZpbGVJZCBsb2NrZWQgZXh0ZW5zaW9uIG93bmVyLnNldHRpbmdzLmRpc3BsYXlOYW1lIG93bmVyLmF2YXRhcicpXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBmaWxlc1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0U2hhcmVkRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcblxuICAgIHRyeSB7XG4gICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IEZpbGUuZmluZCh7IHNoYXJlZFdpdGg6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCB9KS5zb3J0KHJlcS5ib2R5LnNvcnRlZCB8fCByZXEucXVlcnkuc29ydGVkIHx8ICctZGF0ZWQnKS5wb3B1bGF0ZSgnb3duZXInKS5zZWxlY3QoJ3RpdGxlIGRhdGVkIGZpbGVJZCBsb2NrZWQgZXh0ZW5zaW9uIG93bmVyLnVzZXJuYW1lIG93bmVyLmF2YXRhcicpXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBmaWxlc1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0QWxsRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBsZXQgYWxsRmlsZXMgPSBhd2FpdCBGaWxlLmZpbmQoe30pLnBvcHVsYXRlKCdvd25lcicpXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZXMgPSBhbGxGaWxlc1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgZ2V0dGluZyBkb2N1bWVudHM6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0UmVjZW50ID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzLmxvY2Fscy5yZWNlbnQgPSBhd2FpdCBGaWxlLmZpbmQoeyAnJG9yJzogW3sgb3duZXI6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCB9LCB7IHNoYXJlZFdpdGg6IHsgJyRpbic6IFtyZXMubG9jYWxzLmF1dGhfdXNlci5faWRdIH0gfV0gfSkucG9wdWxhdGUoeyBwYXRoOiAnbG9nLnVzZXInLCBzZWxlY3Q6ICd1c2VyLnNldHRpbmdzLmRpc3BsYXlOYW1lIHVzZXIuYXZhdGFyJywgb3B0aW9uczogeyBsaW1pdDogMSB9IH0pLmxpbWl0KDMpLyogLnNvcnQoJy1sb2cudGltZXN0YW1wJykuc2xpY2UoJ2xvZycsIC0yKS5sZWFuKCkuc2VsZWN0KCd0aXRsZSBsb2cnKS5saW1pdChyZXEucXVlcnkubGltaXQgfHwgMykgKi9cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGdldHRpbmcgcmVjZW50OiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGdldFNpbmdsZUZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXMubG9jYWxzLmZpbGUgPSBhd2FpdCBGaWxlLmZpbmRPbmUoeyBmaWxlSWQ6IHJlcS5wYXJhbXMuZmlsZWlkIH0pXG4gICAgICAgICAgICAucG9wdWxhdGUoJ293bmVyJylcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnbG9ja2VkQnknKVxuICAgICAgICAgICAgLnBvcHVsYXRlKCdzaGFyZWRXaXRoJylcbiAgICAgICAgICAgIC5wb3B1bGF0ZSgnbG9nLnVzZXInKVxuICAgICAgICAgICAgLnNvcnQoJycpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBnZXR0aW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgZGVsZXRlU2luZ2xlRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGxldCBmaWxlSWQgPSByZXEucGFyYW1zLmZpbGVpZCB8fCByZXEuYm9keS5maWxlaWQgfHwgcmVxLnF1ZXJ5LmZpbGVpZFxuICAgICAgICByZXMubG9jYWxzLmZpbGUgPSBhd2FpdCBGaWxlLmZpbmRPbmVBbmREZWxldGUoeyBmaWxlSWQ6IGZpbGVJZCB9KVxuICAgICAgICBhd2FpdCBzdG9yYWdlLmRlbGV0ZShyZXMubG9jYWxzLmZpbGUuZmlsZVN0b3JhZ2VJZClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGRlbGV0aW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG4vL0NyZWF0ZSBBbmQgVXBkYXRlIE1vZGVsXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOZXdGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IGZpbGVpZCA9IHV1aWQoKVxuICAgICAgICBsZXQgZmlsZSA9IG5ldyBGaWxlKHJlcS5ib2R5KVxuICAgICAgICBmaWxlLm93bmVyID0gcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkXG4gICAgICAgIGZpbGUuZmlsZUlkID0gZmlsZWlkXG4gICAgICAgIGZpbGUubG9nLnB1c2goe1xuICAgICAgICAgICAgdXNlcjogcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkLFxuICAgICAgICAgICAgbWVzc2FnZTogJ2NyZWF0ZWQgdGhpcyBmaWxlJ1xuICAgICAgICB9KVxuICAgICAgICBmaWxlLmxvZy5wdXNoKHtcbiAgICAgICAgICAgIHVzZXI6IHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCxcbiAgICAgICAgICAgIGxvZ1R5cGU6ICdjb21tZW50ZWQnLFxuICAgICAgICAgICAgbWVzc2FnZTogcmVxLmJvZHkuY29tbWVudFxuICAgICAgICB9KVxuICAgICAgICByZXMubG9jYWxzLmZpbGUgPSBhd2FpdCBmaWxlLnNhdmUoKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgY3JlYXRpbmcgZG9jdW1lbnQ6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgdXBsb2FkRmlsZXMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBsZXQgZmlsZXR5cGUgPSBhd2FpdCBmaWxldHlwZUZyb21CdWZmZXIocmVxLmZpbGUuYnVmZmVyKVxuXG4gICAgICAgIGxldCBiU3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoKClcbiAgICAgICAgYlN0cmVhbS5lbmQocmVxLmZpbGUuYnVmZmVyKVxuXG4gICAgICAgIGxldCBzdG9yYWdlSWQgPSBhd2FpdCBzdG9yYWdlLmFkZChiU3RyZWFtKVxuXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5maWxlU3RvcmFnZUlkID0gc3RvcmFnZUlkXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5taW1lID0gZmlsZXR5cGU/Lm1pbWVcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmV4dGVuc2lvbiA9IGZpbGV0eXBlPy5leHRcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxuICAgICAgICBkZWxldGUgcmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWRcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGhhbmRsaW5nIGZpbGUgdXBsb2FkOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGFwcGVuZENvbW1lbnQgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXMubG9jYWxzLmZpbGUubG9nLnB1c2goe1xuICAgICAgICAgICAgdXNlcjogcmVzLmxvY2Fscy5hdXRoX3VzZXIsXG4gICAgICAgICAgICBtZXNzYWdlOiByZXEuYm9keS5jb21tZW50LFxuICAgICAgICAgICAgbG9nVHlwZTogJ2NvbW1lbnRlZCdcbiAgICAgICAgfSlcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxuICAgICAgICBhd2FpdCBlbWl0Tm90aWZpY2F0aW9uKFtyZXMubG9jYWxzLmZpbGUub3duZXIudXNlcm5hbWUsIC4uLnJlcy5sb2NhbHMuZmlsZS5zaGFyZWRXaXRoLm1hcChlID0+IGUudXNlcm5hbWUpXSwgYWN0aW9uQ29udGV4dC5sb2csIHtcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvblRlbXBsYXRlOiBbYCR7cmVzLmxvY2Fscy5hdXRoX3VzZXIuc2V0dGluZ3MuZGlzcGxheU5hbWV9YCwgJ2NvbW1lbnRlZCBvbicsIGAke3Jlcy5sb2NhbHMuZmlsZS50aXRsZX1gXSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHJlcy5sb2NhbHMuZmlsZS5sb2csXG4gICAgICAgICAgICBwbGF5Tm90aWZpY2F0aW9uOiB0cnVlLFxuICAgICAgICAgICAgYWN0aW9uQXR0ZW50aW9uVVJMOiBgL3ZpZXcvJHtyZXMubG9jYWxzLmZpbGUuZmlsZUlkfWBcbiAgICAgICAgfSwgKHJlcy5sb2NhbHMuYXV0aF91c2VyLnVzZXJuYW1lIGFzIFN0cmluZykpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBsb2NraW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG4vLyBMb2NrIE9wZXJhdGlvbnNcblxuZXhwb3J0IGNvbnN0IGNoZWNrUGVybWlzc2lvblRvRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIGxldCBwZXJtaXR0ZWQgPSBmYWxzZVxuXG4gICAgcmVzLmxvY2Fscy5maWxlLnNoYXJlZFdpdGguZmlsdGVyKGUgPT4gZS51c2VybmFtZSA9PT0gcmVzLmxvY2Fscy5hdXRoX3VzZXIudXNlcm5hbWUpLmxlbmd0aCA+IDAgPyBwZXJtaXR0ZWQgPSB0cnVlIDogcGVybWl0dGVkID0gZmFsc2VcblxuICAgIGlmICghKHJlcy5sb2NhbHMuYXV0aF91c2VyLnVzZXJuYW1lID09IHJlcy5sb2NhbHMuZmlsZS5vd25lci51c2VybmFtZSB8fCBwZXJtaXR0ZWQpKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDQwMSwgXCJGaWxlIGNhbid0IGJlIGNoZWNrZWQgb3V0IGJ5IHlvdVwiKSlcbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGNoZWNrRmlsZU93bmVyc2hpcCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIGlmICghKHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZCA9PSByZXMubG9jYWxzLmZpbGUub3duZXIuX2lkKSkgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig0MDEsICdZb3UgYXJlIG5vdCBwZXJtaXR0ZWQgdG8gYWNjZXMgdGhpcyBmaWxlJykpXG4gICAgbmV4dCgpXG59XG5cbmV4cG9ydCBjb25zdCBsb2NrRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWRCeSA9IHJlcy5sb2NhbHMuYXV0aF91c2VyXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5sb2NrZWQgPSB0cnVlXG4gICAgICAgIGF3YWl0IHJlcy5sb2NhbHMuZmlsZS5zYXZlKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGxvY2tpbmcgZmlsZTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXG4gICAgfVxuXG4gICAgbmV4dCgpXG59XG5cbmV4cG9ydCBjb25zdCB1bmxvY2tGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzLmxvY2Fscy5maWxlLmxvY2tlZEJ5ID0gbnVsbFxuICAgICAgICByZXMubG9jYWxzLmZpbGUubG9ja2VkID0gZmFsc2VcbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgdW5sb2NraW5nIGZpbGU6ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG4vLyBGaWxlIGRvd25sb2FkXG5cbmV4cG9ydCBjb25zdCBkb3dubG9hZEZpbGUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICAvLyBsZXQgemlwID0gYXdhaXQgYXJjaGl2ZSgnemlwJylcbiAgICAgICAgLy8gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIC8vICAgICByZXMubG9jYWxzLmZpbGUucGFnZUhhc2hlcy5mb3JFYWNoKGFzeW5jIGVsZW1lbnQgPT4ge1xuICAgICAgICAvLyAgICAgICAgIGxldCBidWZmZXIgPSBhd2FpdCBzdG9yYWdlLmdldChlbGVtZW50KVxuICAgICAgICAvLyAgICAgICAgIHppcC5hcHBlbmQoKVxuICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgLy8gKVxuXG4gICAgICAgIC8vIHJlcy5sb2NhbHMuemlwID0gemlwXG4gICAgICAgIGlmIChyZXMubG9jYWxzLmZpbGUuYXJjaGl2ZWQpIHRocm93IG5ldyBFcnJvcignRmlsZSBpcyBhcmNoaXZlZCcpXG5cbiAgICAgICAgcmVzLmxvY2Fscy5maWxlQnVmZmVyID0gYXdhaXQgc3RvcmFnZS5nZXQocmVzLmxvY2Fscy5maWxlLmZpbGVTdG9yYWdlSWQpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBkb3dubG9hZGluZyBmaWxlOyAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuLy8gU2hhcmVcblxuZXhwb3J0IGNvbnN0IHNoYXJlRmlsZSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGxldCB1c2VyVG9TaGFyZSA9IHJlcS5ib2R5Lndob1RvU2hhcmUgfHwgcmVxLnF1ZXJ5LnVzZXJUb1NoYXJlXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZS5zaGFyZWRXaXRoLnB1c2godXNlclRvU2hhcmUpXG5cbiAgICAgICAgYXdhaXQgcmVzLmxvY2Fscy5maWxlLnNhdmUoKVxuXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IEZpbGUuZmluZE9uZSh7IGZpbGVJZDogcmVzLmxvY2Fscy5maWxlLmZpbGVJZCB9KVxuICAgICAgICAgICAgLnBvcHVsYXRlKCdvd25lcicpXG4gICAgICAgICAgICAucG9wdWxhdGUoJ3NoYXJlZFdpdGgnKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcy5sb2NhbHMuZmlsZSlcblxuICAgICAgICBhd2FpdCBlbWl0Tm90aWZpY2F0aW9uKFtyZXMubG9jYWxzLmZpbGUub3duZXIudXNlcm5hbWUsIC4uLnJlcy5sb2NhbHMuZmlsZS5zaGFyZWRXaXRoLm1hcChlID0+IGUudXNlcm5hbWUpXSwgYWN0aW9uQ29udGV4dC5zaGFyZSwge1xuICAgICAgICAgICAgdGV4dFRlbXBsYXRlOiBbYCR7cmVzLmxvY2Fscy5hdXRoX3VzZXIuc2V0dGluZ3MuZGlzcGxheU5hbWV9YCwgJ3NoYXJlZCcsIGAke3Jlcy5sb2NhbHMuZmlsZS50aXRsZX1gLCAnd2l0aCB5b3UnXSxcbiAgICAgICAgICAgIHBsYXlOb3RpZmljYXRpb246IHRydWUsXG4gICAgICAgICAgICBhY3Rpb25BdHRlbnRpb25VUkw6IGAvdmlldy8ke3Jlcy5sb2NhbHMuZmlsZS5maWxlSWR9YFxuICAgICAgICB9LCAocmVzLmxvY2Fscy5hdXRoX3VzZXIudXNlcm5hbWUgYXMgU3RyaW5nKSlcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3Igc2hhcmluZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGFyY2hpdmVGaWxlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc3RvcmFnZS5hcmNoaXZlKHJlcy5sb2NhbHMuZmlsZS5maWxlU3RvcmFnZUlkKVxuICAgICAgICByZXMubG9jYWxzLmZpbGUuYXJjaGl2ZWQgPSB0cnVlXG4gICAgICAgIHJlcy5sb2NhbHMuZmlsZSA9IGF3YWl0IHJlcy5sb2NhbHMuZmlsZS5zYXZlKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGFyY2hpdmluZyBmaWxlOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGhhbmRsZVF1ZXVlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgc3dpdGNoIChyZXEucGFyYW1zLnF1ZXVlKSB7XG4gICAgICAgIGNhc2UgXCJvY3JcIjpcblxuICAgIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OXG4vLyAtLS0tLS0tLS0tLS0tLS1cbmludGVyZmFjZSBhY3Rpb25EYXRhSWYge1xuICAgIHBheWxvYWQ/OiBhbnksXG4gICAgbm90aWZpY2F0aW9uVGVtcGxhdGU6IEFycmF5PFN0cmluZz4sXG4gICAgcGxheU5vdGlmaWNhdGlvbj86IEJvb2wsXG4gICAgYWN0aW9uQXR0ZW50aW9uVVJMPzogU3RyaW5nXG59XG5cbmVudW0gYWN0aW9uQ29udGV4dCB7XG4gICAgbG9nID0gJ2xvZycsXG4gICAgc2hhcmUgPSAnc2hhcmUnXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGVtaXROb3RpZmljYXRpb24ocmVjcHM6IFtTdHJpbmddLCBhY3Rpb25Db250ZXh0OiBhY3Rpb25Db250ZXh0LCBhY3Rpb25EYXRhOiBhY3Rpb25EYXRhSWYsIGVtaXR0ZXI6IFN0cmluZykge1xuICAgIGZvciAobGV0IHJlY3Agb2YgcmVjcHMpIHtcbiAgICAgICAgaWYgKHJlY3AgIT09IGVtaXR0ZXIpIHtcbiAgICAgICAgICAgIGxldCByZWNwX2FkcmVzczogU3RyaW5nID0gYXdhaXQgc29ja2V0U3RvcmUuZ2V0KHJlY3ApXG4gICAgICAgICAgICBpZiAocmVjcF9hZHJlc3MpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgZW1pdHRpbmcgdG8gJHtyZWNwX2FkcmVzc31gKVxuICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbl9jaGFubmVsLnRvKGAvYXBpL25vdGlmaWNhdGlvbnMjJHtyZWNwX2FkcmVzc31gKS5lbWl0KCdub3RpZmljYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGFjdGlvbkNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IGFjdGlvbkRhdGFcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSJdfQ==