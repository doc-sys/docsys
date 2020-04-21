"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _adapters = _interopRequireDefault(require("../lib/storage/adapters"));

var stream = _interopRequireWildcard(require("stream"));

//mport * as Storage from `../storage/adapters/${process.env.STORAGE_ENGINE}`
var storage = (0, _adapters["default"])();

var express = require('express');

var multer = require('multer');

var uuid = require('uuid/v4');

var ftype = require('file-type');

var archiver = require('archiver');

var router = express.Router();

var ErrorHandler = require('../lib/helpers/error'); // delay responses in developement


if (process.env.NODE_ENV == 'developement') {
  var delay = require('express-delay');

  router.use(delay(1000));
}

var doc = require('../models/document');

var user = require('../models/user');

var ALLOWED_FILETYPES = ['pdf', 'jpg', 'jpeg', 'png', 'tiff'];
var upload = multer({
  storage: multer.memoryStorage()
});
/**
 * @api {get} /document/own Own documents
 * @apiName documentGetOwn
 * @apiGroup Document
 * @apiDescription Returns the users documents
 * @apiSuccess {Array} ownDocs User documents basic metadata
 */

router.get('/own', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var ownDocs;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return doc.find({
              owner: req.user._id
            }).sort('-dated').select('title dated fileId locked');

          case 3:
            ownDocs = _context.sent;
            res.status(200).json({
              payload: ownDocs
            });
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
/**
 * @api {get} /document/shared Shared documents
 * @apiName documentGetShared
 * @apiGroup Document
 * @apiDescription Returns the documents shared with the user
 * @apiSuccess {Array} sharedDocs Shared documents basic metadata
 */

router.get('/shared', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var sharedDocs;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return doc.find({
              sharedWith: req.user._id
            }).sort('-dated').populate('owner').select('title dated fileId locked owner.avatar');

          case 2:
            sharedDocs = _context2.sent;
            res.status(200).json({
              payload: sharedDocs
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.route('/').get( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var ownDocs, sharedDocs;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return doc.find({
              owner: req.user._id
            }).sort('-dated').select('title dated fileId locked');

          case 2:
            ownDocs = _context3.sent;
            _context3.next = 5;
            return doc.find({
              sharedWith: req.user._id
            }).sort('-dated').populate('owner').select('title dated fileId locked owner');

          case 5:
            sharedDocs = _context3.sent;
            res.status(200).json({
              payload: {
                ownDocs: ownDocs,
                sharedDocs: sharedDocs
              }
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}())
/**
 * @api {post} /document/ New document
 * @apiName documentCreate
 * @apiGroup Document
 * @apiDescription Creates and uploads a new documents with its body.
 * @apiParam {Buffer[]} files Page(s) for the document
 * @apiParam {String} title Documents subject or title
 * @apiParam {Date} dated Date the original document was recieved
 * @apiParam {String} comment Optional comment to append to log
 * @apiSuccess {String} message Confirming upload
 * @apiError (500) {String} InternalError Something went wrong
 */
.post(upload.array('documents'), /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var uid, filetype, uploadedFile;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            uid = uuid();
            _context5.next = 4;
            return ftype.fromBuffer(req.files[0].buffer);

          case 4:
            filetype = _context5.sent;

            if (ALLOWED_FILETYPES.includes(filetype.ext)) {
              _context5.next = 7;
              break;
            }

            throw new ErrorHandler(415, 'Filetype not supported');

          case 7:
            uploadedFile = new doc({
              title: req.body.title,
              created: req.body.dated,
              fileId: uid,
              owner: req.user._id,
              mime: filetype.mime,
              extension: filetype.ext,
              log: [],
              pageHashes: []
            });
            uploadedFile.log.push({
              message: 'Document created',
              user: req.user._id
            });
            uploadedFile.log.push({
              message: req.body.comment,
              user: req.user._id
            });
            console.log(storage);
            req.files.forEach( /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(file, index) {
                var bStream, pageId;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        bStream = new stream.PassThrough();
                        bStream.end(file.buffer);
                        _context4.next = 4;
                        return storage.add(bStream);

                      case 4:
                        pageId = _context4.sent;
                        uploadedFile.pageHashes.push(pageId);

                      case 6:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x10, _x11) {
                return _ref5.apply(this, arguments);
              };
            }());
            _context5.next = 14;
            return uploadedFile.save();

          case 14:
            res.status(200).json({
              payload: {
                message: "Uploaded ".concat(req.files.length, " files")
              }
            });
            _context5.next = 20;
            break;

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5["catch"](0);
            next(_context5.t0);

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 17]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}());
router.route('/checkout/:fileid')
/**
 * @api {get} /document/checkout/:fileid Document checkout
 * @apiName documentCheckout
 * @apiGroup Document
 * @apiDescription Checks out document and sends files as ZIP archive
 * @apiParam {String} fileid The fileid as part of the GET URL
 * @apiSuccess (200) {Stream} ZIP file stream
 * @apiError (401) PermissionError Not allowed to GET this file
 */
.get( /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var file, zip;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return doc.findOne({
              fileId: req.params.fileid
            }).populate('owner').populate('sharedWith');

          case 2:
            file = _context7.sent;

            if (!(!(req.user.username == file.owner.username || file.sharedWith.includes(req.user)) || file.locked)) {
              _context7.next = 7;
              break;
            }

            res.status(401).json({
              payload: {
                message: 'Not allowed to download file'
              }
            });
            _context7.next = 20;
            break;

          case 7:
            file.lockedBy = req.user;
            file.locked = true;
            _context7.next = 11;
            return file.save();

          case 11:
            res.writeHead(200, {
              'Content-Type': 'application/zip',
              'Content-disposition': 'attachement; filename=files.zip'
            });
            _context7.next = 14;
            return archiver('zip');

          case 14:
            zip = _context7.sent;
            _context7.next = 17;
            return Promise.all(file.pageHashes.map( /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(pageId, i) {
                var buf;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        buf = new Buffer(0);
                        stream.on('data', function (d) {
                          buf = Buffer.concat([buf, d]);
                        });
                        _context6.next = 4;
                        return storage.get(pageId, zip);

                      case 4:
                        zip.append();

                      case 5:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x14, _x15) {
                return _ref7.apply(this, arguments);
              };
            }()));

          case 17:
            _context7.next = 19;
            return zip.pipe(res);

          case 19:
            zip.finalize();

          case 20:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}())
/**
 * @api {post} /document/checkout/:fileid
 */
.post(upload.array('documents'), /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var file;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return doc.findOne({
              fileId: req.params.fileid
            });

          case 3:
            file = _context8.sent;
            req.flash('success', "Uploaded ".concat(req.files.length, " files"));
            res.redirect(req.originalUrl);
            _context8.next = 12;
            break;

          case 8:
            _context8.prev = 8;
            _context8.t0 = _context8["catch"](0);
            req.flash('warn', 'Couldn`t upload files');
            res.redirect(req.originalUrl);

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 8]]);
  }));

  return function (_x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}());
router.route('/share/:fileid').post( /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var fileid, document, sharedUser;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            fileid = req.params.fileid;
            _context9.next = 3;
            return doc.findOne({
              fileId: fileid
            }).populate('owner');

          case 3:
            document = _context9.sent;
            _context9.next = 6;
            return user.findOne({
              username: req.body.shareUsername
            });

          case 6:
            sharedUser = _context9.sent;

            if (!(req.user.username == document.owner.username)) {
              _context9.next = 13;
              break;
            }

            document.sharedWith.push(sharedUser._id);
            _context9.next = 11;
            return document.save();

          case 11:
            _context9.next = 18;
            break;

          case 13:
            if (!(req.user.username == req.body.shareUsername)) {
              _context9.next = 17;
              break;
            }

            return _context9.abrupt("return", res.status(401).json({
              payload: {
                message: 'Cant share with yourself'
              }
            }));

          case 17:
            return _context9.abrupt("return", res.status(401).json({
              payload: {
                message: 'Not the owner'
              }
            }));

          case 18:
            res.status(200).json({
              payload: {
                message: 'Successfully shared'
              }
            });

          case 19:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}());
router.route('/:fileid').get( /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return doc.findOne({
              fileId: req.params.fileid
            }).populate('owner').populate('lockedBy').populate('sharedWith').populate('log.user');

          case 2:
            result = _context10.sent;
            res.status(200).json({
              payload: result
            });

          case 4:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}())["delete"]( /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return doc.deleteOne({
              fileId: req.params.fileid
            });

          case 3:
            _context11.next = 8;
            break;

          case 5:
            _context11.prev = 5;
            _context11.t0 = _context11["catch"](0);
            res.status(401).json({
              payload: {
                message: 'Couldnt delete file'
              }
            });

          case 8:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 5]]);
  }));

  return function (_x22, _x23) {
    return _ref11.apply(this, arguments);
  };
}());
module.exports = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvZG9jdW1lbnRzLnRzIl0sIm5hbWVzIjpbInN0b3JhZ2UiLCJleHByZXNzIiwicmVxdWlyZSIsIm11bHRlciIsInV1aWQiLCJmdHlwZSIsImFyY2hpdmVyIiwicm91dGVyIiwiUm91dGVyIiwiRXJyb3JIYW5kbGVyIiwicHJvY2VzcyIsImVudiIsIk5PREVfRU5WIiwiZGVsYXkiLCJ1c2UiLCJkb2MiLCJ1c2VyIiwiQUxMT1dFRF9GSUxFVFlQRVMiLCJ1cGxvYWQiLCJtZW1vcnlTdG9yYWdlIiwiZ2V0IiwicmVxIiwicmVzIiwiZmluZCIsIm93bmVyIiwiX2lkIiwic29ydCIsInNlbGVjdCIsIm93bkRvY3MiLCJzdGF0dXMiLCJqc29uIiwicGF5bG9hZCIsImNvbnNvbGUiLCJsb2ciLCJzaGFyZWRXaXRoIiwicG9wdWxhdGUiLCJzaGFyZWREb2NzIiwicm91dGUiLCJwb3N0IiwiYXJyYXkiLCJuZXh0IiwidWlkIiwiZnJvbUJ1ZmZlciIsImZpbGVzIiwiYnVmZmVyIiwiZmlsZXR5cGUiLCJpbmNsdWRlcyIsImV4dCIsInVwbG9hZGVkRmlsZSIsInRpdGxlIiwiYm9keSIsImNyZWF0ZWQiLCJkYXRlZCIsImZpbGVJZCIsIm1pbWUiLCJleHRlbnNpb24iLCJwYWdlSGFzaGVzIiwicHVzaCIsIm1lc3NhZ2UiLCJjb21tZW50IiwiZm9yRWFjaCIsImZpbGUiLCJpbmRleCIsImJTdHJlYW0iLCJzdHJlYW0iLCJQYXNzVGhyb3VnaCIsImVuZCIsImFkZCIsInBhZ2VJZCIsInNhdmUiLCJsZW5ndGgiLCJmaW5kT25lIiwicGFyYW1zIiwiZmlsZWlkIiwidXNlcm5hbWUiLCJsb2NrZWQiLCJsb2NrZWRCeSIsIndyaXRlSGVhZCIsInppcCIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJpIiwiYnVmIiwiQnVmZmVyIiwib24iLCJkIiwiY29uY2F0IiwiYXBwZW5kIiwicGlwZSIsImZpbmFsaXplIiwiZmxhc2giLCJyZWRpcmVjdCIsIm9yaWdpbmFsVXJsIiwiZG9jdW1lbnQiLCJzaGFyZVVzZXJuYW1lIiwic2hhcmVkVXNlciIsInJlc3VsdCIsImRlbGV0ZU9uZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQTs7QUFDQTs7QUFGQTtBQUtBLElBQUlBLE9BQU8sR0FBRywyQkFBZDs7QUFFQSxJQUFJQyxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxTQUFELENBQXJCOztBQUNBLElBQUlDLE1BQU0sR0FBR0QsT0FBTyxDQUFDLFFBQUQsQ0FBcEI7O0FBQ0EsSUFBSUUsSUFBSSxHQUFHRixPQUFPLENBQUMsU0FBRCxDQUFsQjs7QUFDQSxJQUFJRyxLQUFLLEdBQUdILE9BQU8sQ0FBQyxXQUFELENBQW5COztBQUNBLElBQUlJLFFBQVEsR0FBR0osT0FBTyxDQUFDLFVBQUQsQ0FBdEI7O0FBRUEsSUFBSUssTUFBTSxHQUFHTixPQUFPLENBQUNPLE1BQVIsRUFBYjs7QUFDQSxJQUFJQyxZQUFZLEdBQUdQLE9BQU8sQ0FBQyxzQkFBRCxDQUExQixDLENBRUE7OztBQUNBLElBQUlRLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFaLElBQXdCLGNBQTVCLEVBQTRDO0FBQzNDLE1BQUlDLEtBQUssR0FBR1gsT0FBTyxDQUFDLGVBQUQsQ0FBbkI7O0FBQ0FLLEVBQUFBLE1BQU0sQ0FBQ08sR0FBUCxDQUFXRCxLQUFLLENBQUMsSUFBRCxDQUFoQjtBQUNBOztBQUVELElBQUlFLEdBQUcsR0FBR2IsT0FBTyxDQUFDLG9CQUFELENBQWpCOztBQUNBLElBQUljLElBQUksR0FBR2QsT0FBTyxDQUFDLGdCQUFELENBQWxCOztBQUVBLElBQU1lLGlCQUFpQixHQUFHLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxNQUFmLEVBQXVCLEtBQXZCLEVBQThCLE1BQTlCLENBQTFCO0FBRUEsSUFBSUMsTUFBTSxHQUFHZixNQUFNLENBQUM7QUFDbkJILEVBQUFBLE9BQU8sRUFBRUcsTUFBTSxDQUFDZ0IsYUFBUDtBQURVLENBQUQsQ0FBbkI7QUFJ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QUlSLFlBSlEsRUFLakJBLFFBTGlCLENBS1IsVUFMUSxDQURmOztBQUFBO0FBQ0E4RCxZQUFBQSxNQURBO0FBT0ozRSxZQUFBQSxHQUFHLENBQUNPLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQjtBQUFFQyxjQUFBQSxPQUFPLEVBQUVrRTtBQUFYLGFBQXJCOztBQVBJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBRk47O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw2RkFXUyxtQkFBTzVFLEdBQVAsRUFBaUJDLEdBQWpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBRUFQLEdBQUcsQ0FBQ21GLFNBQUosQ0FBYztBQUFFN0MsY0FBQUEsTUFBTSxFQUFFaEMsR0FBRyxDQUFDbUQsTUFBSixDQUFXQztBQUFyQixhQUFkLENBRkE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQU1ObkQsWUFBQUEsR0FBRyxDQUFDTyxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUI7QUFBRUMsY0FBQUEsT0FBTyxFQUFFO0FBQUUyQixnQkFBQUEsT0FBTyxFQUFFO0FBQVg7QUFBWCxhQUFyQjs7QUFOTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQVhUOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBcUJBeUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCN0YsTUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmFnZUFkYXB0ZXIgZnJvbSAnLi4vbGliL3N0b3JhZ2UvYWRhcHRlcnMvaW50ZXJmYWNlJ1xyXG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXHJcbi8vbXBvcnQgKiBhcyBTdG9yYWdlIGZyb20gYC4uL3N0b3JhZ2UvYWRhcHRlcnMvJHtwcm9jZXNzLmVudi5TVE9SQUdFX0VOR0lORX1gXHJcbmltcG9ydCBnZXRTdG9yYWdlIGZyb20gJy4uL2xpYi9zdG9yYWdlL2FkYXB0ZXJzJ1xyXG5pbXBvcnQgKiBhcyBzdHJlYW0gZnJvbSAnc3RyZWFtJ1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcydcclxuXHJcbmxldCBzdG9yYWdlID0gZ2V0U3RvcmFnZSgpXHJcblxyXG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG52YXIgbXVsdGVyID0gcmVxdWlyZSgnbXVsdGVyJylcclxudmFyIHV1aWQgPSByZXF1aXJlKCd1dWlkL3Y0JylcclxudmFyIGZ0eXBlID0gcmVxdWlyZSgnZmlsZS10eXBlJylcclxudmFyIGFyY2hpdmVyID0gcmVxdWlyZSgnYXJjaGl2ZXInKVxyXG5cclxudmFyIHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKClcclxudmFyIEVycm9ySGFuZGxlciA9IHJlcXVpcmUoJy4uL2xpYi9oZWxwZXJzL2Vycm9yJylcclxuXHJcbi8vIGRlbGF5IHJlc3BvbnNlcyBpbiBkZXZlbG9wZW1lbnRcclxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09ICdkZXZlbG9wZW1lbnQnKSB7XHJcblx0bGV0IGRlbGF5ID0gcmVxdWlyZSgnZXhwcmVzcy1kZWxheScpXHJcblx0cm91dGVyLnVzZShkZWxheSgxMDAwKSlcclxufVxyXG5cclxudmFyIGRvYyA9IHJlcXVpcmUoJy4uL21vZGVscy9kb2N1bWVudCcpXHJcbnZhciB1c2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL3VzZXInKVxyXG5cclxuY29uc3QgQUxMT1dFRF9GSUxFVFlQRVMgPSBbJ3BkZicsICdqcGcnLCAnanBlZycsICdwbmcnLCAndGlmZiddXHJcblxyXG52YXIgdXBsb2FkID0gbXVsdGVyKHtcclxuXHRzdG9yYWdlOiBtdWx0ZXIubWVtb3J5U3RvcmFnZSgpLFxyXG59KVxyXG5cclxuLyoqXHJcbiAqIEBhcGkge2dldH0gL2RvY3VtZW50L293biBPd24gZG9jdW1lbnRzXHJcbiAqIEBhcGlOYW1lIGRvY3VtZW50R2V0T3duXHJcbiAqIEBhcGlHcm91cCBEb2N1bWVudFxyXG4gKiBAYXBpRGVzY3JpcHRpb24gUmV0dXJucyB0aGUgdXNlcnMgZG9jdW1lbnRzXHJcbiAqIEBhcGlTdWNjZXNzIHtBcnJheX0gb3duRG9jcyBVc2VyIGRvY3VtZW50cyBiYXNpYyBtZXRhZGF0YVxyXG4gKi9cclxucm91dGVyLmdldCgnL293bicsIGFzeW5jIChyZXE6IGFueSwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG5cdHRyeSB7XHJcblx0XHRsZXQgb3duRG9jcyA9IGF3YWl0IGRvY1xyXG5cdFx0XHQuZmluZCh7IG93bmVyOiByZXEudXNlci5faWQgfSlcclxuXHRcdFx0LnNvcnQoJy1kYXRlZCcpXHJcblx0XHRcdC5zZWxlY3QoJ3RpdGxlIGRhdGVkIGZpbGVJZCBsb2NrZWQnKVxyXG5cclxuXHRcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgcGF5bG9hZDogb3duRG9jcyB9KVxyXG5cdH0gY2F0Y2ggKGUpIHtcclxuXHRcdGNvbnNvbGUubG9nKGUpXHJcblx0fVxyXG59KVxyXG5cclxuLyoqXHJcbiAqIEBhcGkge2dldH0gL2RvY3VtZW50L3NoYXJlZCBTaGFyZWQgZG9jdW1lbnRzXHJcbiAqIEBhcGlOYW1lIGRvY3VtZW50R2V0U2hhcmVkXHJcbiAqIEBhcGlHcm91cCBEb2N1bWVudFxyXG4gKiBAYXBpRGVzY3JpcHRpb24gUmV0dXJucyB0aGUgZG9jdW1lbnRzIHNoYXJlZCB3aXRoIHRoZSB1c2VyXHJcbiAqIEBhcGlTdWNjZXNzIHtBcnJheX0gc2hhcmVkRG9jcyBTaGFyZWQgZG9jdW1lbnRzIGJhc2ljIG1ldGFkYXRhXHJcbiAqL1xyXG5yb3V0ZXIuZ2V0KCcvc2hhcmVkJywgYXN5bmMgKHJlcTogYW55LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcblx0bGV0IHNoYXJlZERvY3MgPSBhd2FpdCBkb2NcclxuXHRcdC5maW5kKHsgc2hhcmVkV2l0aDogcmVxLnVzZXIuX2lkIH0pXHJcblx0XHQuc29ydCgnLWRhdGVkJylcclxuXHRcdC5wb3B1bGF0ZSgnb3duZXInKVxyXG5cdFx0LnNlbGVjdCgndGl0bGUgZGF0ZWQgZmlsZUlkIGxvY2tlZCBvd25lci5hdmF0YXInKVxyXG5cclxuXHRyZXMuc3RhdHVzKDIwMCkuanNvbih7IHBheWxvYWQ6IHNoYXJlZERvY3MgfSlcclxufSlcclxuXHJcbnJvdXRlclxyXG5cdC5yb3V0ZSgnLycpXHJcblx0LmdldChhc3luYyAocmVxOiBhbnksIHJlczogUmVzcG9uc2UpID0+IHtcclxuXHRcdGxldCBvd25Eb2NzID0gYXdhaXQgZG9jXHJcblx0XHRcdC5maW5kKHsgb3duZXI6IHJlcS51c2VyLl9pZCB9KVxyXG5cdFx0XHQuc29ydCgnLWRhdGVkJylcclxuXHRcdFx0LnNlbGVjdCgndGl0bGUgZGF0ZWQgZmlsZUlkIGxvY2tlZCcpXHJcblx0XHRsZXQgc2hhcmVkRG9jcyA9IGF3YWl0IGRvY1xyXG5cdFx0XHQuZmluZCh7IHNoYXJlZFdpdGg6IHJlcS51c2VyLl9pZCB9KVxyXG5cdFx0XHQuc29ydCgnLWRhdGVkJylcclxuXHRcdFx0LnBvcHVsYXRlKCdvd25lcicpXHJcblx0XHRcdC5zZWxlY3QoJ3RpdGxlIGRhdGVkIGZpbGVJZCBsb2NrZWQgb3duZXInKVxyXG5cclxuXHRcdHJlc1xyXG5cdFx0XHQuc3RhdHVzKDIwMClcclxuXHRcdFx0Lmpzb24oeyBwYXlsb2FkOiB7IG93bkRvY3M6IG93bkRvY3MsIHNoYXJlZERvY3M6IHNoYXJlZERvY3MgfSB9KVxyXG5cdH0pXHJcblx0LyoqXHJcblx0ICogQGFwaSB7cG9zdH0gL2RvY3VtZW50LyBOZXcgZG9jdW1lbnRcclxuXHQgKiBAYXBpTmFtZSBkb2N1bWVudENyZWF0ZVxyXG5cdCAqIEBhcGlHcm91cCBEb2N1bWVudFxyXG5cdCAqIEBhcGlEZXNjcmlwdGlvbiBDcmVhdGVzIGFuZCB1cGxvYWRzIGEgbmV3IGRvY3VtZW50cyB3aXRoIGl0cyBib2R5LlxyXG5cdCAqIEBhcGlQYXJhbSB7QnVmZmVyW119IGZpbGVzIFBhZ2UocykgZm9yIHRoZSBkb2N1bWVudFxyXG5cdCAqIEBhcGlQYXJhbSB7U3RyaW5nfSB0aXRsZSBEb2N1bWVudHMgc3ViamVjdCBvciB0aXRsZVxyXG5cdCAqIEBhcGlQYXJhbSB7RGF0ZX0gZGF0ZWQgRGF0ZSB0aGUgb3JpZ2luYWwgZG9jdW1lbnQgd2FzIHJlY2lldmVkXHJcblx0ICogQGFwaVBhcmFtIHtTdHJpbmd9IGNvbW1lbnQgT3B0aW9uYWwgY29tbWVudCB0byBhcHBlbmQgdG8gbG9nXHJcblx0ICogQGFwaVN1Y2Nlc3Mge1N0cmluZ30gbWVzc2FnZSBDb25maXJtaW5nIHVwbG9hZFxyXG5cdCAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nXHJcblx0ICovXHJcblx0LnBvc3QodXBsb2FkLmFycmF5KCdkb2N1bWVudHMnKSwgYXN5bmMgKHJlcTogYW55LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBhbnkpID0+IHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGxldCB1aWQgPSB1dWlkKClcclxuXHRcdFx0bGV0IGZpbGV0eXBlID0gYXdhaXQgZnR5cGUuZnJvbUJ1ZmZlcihyZXEuZmlsZXNbMF0uYnVmZmVyKVxyXG5cclxuXHRcdFx0aWYgKCFBTExPV0VEX0ZJTEVUWVBFUy5pbmNsdWRlcyhmaWxldHlwZS5leHQpKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9ySGFuZGxlcig0MTUsICdGaWxldHlwZSBub3Qgc3VwcG9ydGVkJylcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHVwbG9hZGVkRmlsZSA9IG5ldyBkb2Moe1xyXG5cdFx0XHRcdHRpdGxlOiByZXEuYm9keS50aXRsZSxcclxuXHRcdFx0XHRjcmVhdGVkOiByZXEuYm9keS5kYXRlZCxcclxuXHRcdFx0XHRmaWxlSWQ6IHVpZCxcclxuXHRcdFx0XHRvd25lcjogcmVxLnVzZXIuX2lkLFxyXG5cdFx0XHRcdG1pbWU6IGZpbGV0eXBlLm1pbWUsXHJcblx0XHRcdFx0ZXh0ZW5zaW9uOiBmaWxldHlwZS5leHQsXHJcblx0XHRcdFx0bG9nOiBbXSxcclxuXHRcdFx0XHRwYWdlSGFzaGVzOiBbXSxcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdHVwbG9hZGVkRmlsZS5sb2cucHVzaCh7XHJcblx0XHRcdFx0bWVzc2FnZTogJ0RvY3VtZW50IGNyZWF0ZWQnLFxyXG5cdFx0XHRcdHVzZXI6IHJlcS51c2VyLl9pZCxcclxuXHRcdFx0fSlcclxuXHRcdFx0dXBsb2FkZWRGaWxlLmxvZy5wdXNoKHtcclxuXHRcdFx0XHRtZXNzYWdlOiByZXEuYm9keS5jb21tZW50LFxyXG5cdFx0XHRcdHVzZXI6IHJlcS51c2VyLl9pZCxcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdGNvbnNvbGUubG9nKHN0b3JhZ2UpXHJcblxyXG5cdFx0XHRyZXEuZmlsZXMuZm9yRWFjaChhc3luYyAoZmlsZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XHJcblx0XHRcdFx0bGV0IGJTdHJlYW0gPSBuZXcgc3RyZWFtLlBhc3NUaHJvdWdoKClcclxuXHRcdFx0XHRiU3RyZWFtLmVuZChmaWxlLmJ1ZmZlcilcclxuXHJcblx0XHRcdFx0bGV0IHBhZ2VJZCA9IGF3YWl0IHN0b3JhZ2UuYWRkKGJTdHJlYW0pXHJcblx0XHRcdFx0dXBsb2FkZWRGaWxlLnBhZ2VIYXNoZXMucHVzaChwYWdlSWQpXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRhd2FpdCB1cGxvYWRlZEZpbGUuc2F2ZSgpXHJcblxyXG5cdFx0XHRyZXNcclxuXHRcdFx0XHQuc3RhdHVzKDIwMClcclxuXHRcdFx0XHQuanNvbih7IHBheWxvYWQ6IHsgbWVzc2FnZTogYFVwbG9hZGVkICR7cmVxLmZpbGVzLmxlbmd0aH0gZmlsZXNgIH0gfSlcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdG5leHQoZXJyb3IpXHJcblx0XHR9XHJcblx0fSlcclxuXHJcbnJvdXRlclxyXG5cdC5yb3V0ZSgnL2NoZWNrb3V0LzpmaWxlaWQnKVxyXG5cdC8qKlxyXG5cdCAqIEBhcGkge2dldH0gL2RvY3VtZW50L2NoZWNrb3V0LzpmaWxlaWQgRG9jdW1lbnQgY2hlY2tvdXRcclxuXHQgKiBAYXBpTmFtZSBkb2N1bWVudENoZWNrb3V0XHJcblx0ICogQGFwaUdyb3VwIERvY3VtZW50XHJcblx0ICogQGFwaURlc2NyaXB0aW9uIENoZWNrcyBvdXQgZG9jdW1lbnQgYW5kIHNlbmRzIGZpbGVzIGFzIFpJUCBhcmNoaXZlXHJcblx0ICogQGFwaVBhcmFtIHtTdHJpbmd9IGZpbGVpZCBUaGUgZmlsZWlkIGFzIHBhcnQgb2YgdGhlIEdFVCBVUkxcclxuXHQgKiBAYXBpU3VjY2VzcyAoMjAwKSB7U3RyZWFtfSBaSVAgZmlsZSBzdHJlYW1cclxuXHQgKiBAYXBpRXJyb3IgKDQwMSkgUGVybWlzc2lvbkVycm9yIE5vdCBhbGxvd2VkIHRvIEdFVCB0aGlzIGZpbGVcclxuXHQgKi9cclxuXHQuZ2V0KGFzeW5jIChyZXE6IGFueSwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG5cdFx0bGV0IGZpbGUgPSBhd2FpdCBkb2NcclxuXHRcdFx0LmZpbmRPbmUoeyBmaWxlSWQ6IHJlcS5wYXJhbXMuZmlsZWlkIH0pXHJcblx0XHRcdC5wb3B1bGF0ZSgnb3duZXInKVxyXG5cdFx0XHQucG9wdWxhdGUoJ3NoYXJlZFdpdGgnKVxyXG5cclxuXHRcdC8vY2hlY2sgcGVybWlzc2lvbnNcclxuXHRcdGlmIChcclxuXHRcdFx0IShcclxuXHRcdFx0XHRyZXEudXNlci51c2VybmFtZSA9PSBmaWxlLm93bmVyLnVzZXJuYW1lIHx8XHJcblx0XHRcdFx0ZmlsZS5zaGFyZWRXaXRoLmluY2x1ZGVzKHJlcS51c2VyKVxyXG5cdFx0XHQpIHx8XHJcblx0XHRcdGZpbGUubG9ja2VkXHJcblx0XHQpIHtcclxuXHRcdFx0cmVzXHJcblx0XHRcdFx0LnN0YXR1cyg0MDEpXHJcblx0XHRcdFx0Lmpzb24oeyBwYXlsb2FkOiB7IG1lc3NhZ2U6ICdOb3QgYWxsb3dlZCB0byBkb3dubG9hZCBmaWxlJyB9IH0pXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRmaWxlLmxvY2tlZEJ5ID0gcmVxLnVzZXJcclxuXHRcdFx0ZmlsZS5sb2NrZWQgPSB0cnVlXHJcblx0XHRcdGF3YWl0IGZpbGUuc2F2ZSgpXHJcblxyXG5cdFx0XHRyZXMud3JpdGVIZWFkKDIwMCwge1xyXG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vemlwJyxcclxuXHRcdFx0XHQnQ29udGVudC1kaXNwb3NpdGlvbic6ICdhdHRhY2hlbWVudDsgZmlsZW5hbWU9ZmlsZXMuemlwJyxcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdGxldCB6aXAgPSBhd2FpdCBhcmNoaXZlcignemlwJylcclxuXHJcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKFxyXG5cdFx0XHRcdGZpbGUucGFnZUhhc2hlcy5tYXAoYXN5bmMgKHBhZ2VJZDogc3RyaW5nLCBpOiBudW1iZXIpID0+IHtcclxuXHRcdFx0XHRcdGxldCBidWYgPSBuZXcgQnVmZmVyKDApXHJcblx0XHRcdFx0XHRzdHJlYW0ub24oJ2RhdGEnLCAoZCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRidWYgPSBCdWZmZXIuY29uY2F0KFtidWYsIGRdKVxyXG5cdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHRhd2FpdCBzdG9yYWdlLmdldChwYWdlSWQsIHppcClcclxuXHJcblx0XHRcdFx0XHR6aXAuYXBwZW5kKClcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHRhd2FpdCB6aXAucGlwZShyZXMpXHJcblxyXG5cdFx0XHR6aXAuZmluYWxpemUoKVxyXG5cdFx0fVxyXG5cdH0pXHJcblx0LyoqXHJcblx0ICogQGFwaSB7cG9zdH0gL2RvY3VtZW50L2NoZWNrb3V0LzpmaWxlaWRcclxuXHQgKi9cclxuXHQucG9zdCh1cGxvYWQuYXJyYXkoJ2RvY3VtZW50cycpLCBhc3luYyAocmVxOiBhbnksIHJlczogUmVzcG9uc2UpID0+IHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGxldCBmaWxlID0gYXdhaXQgZG9jLmZpbmRPbmUoeyBmaWxlSWQ6IHJlcS5wYXJhbXMuZmlsZWlkIH0pXHJcblxyXG5cdFx0XHRyZXEuZmxhc2goJ3N1Y2Nlc3MnLCBgVXBsb2FkZWQgJHtyZXEuZmlsZXMubGVuZ3RofSBmaWxlc2ApXHJcblx0XHRcdHJlcy5yZWRpcmVjdChyZXEub3JpZ2luYWxVcmwpXHJcblx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRyZXEuZmxhc2goJ3dhcm4nLCAnQ291bGRuYHQgdXBsb2FkIGZpbGVzJylcclxuXHRcdFx0cmVzLnJlZGlyZWN0KHJlcS5vcmlnaW5hbFVybClcclxuXHRcdH1cclxuXHR9KVxyXG5cclxucm91dGVyLnJvdXRlKCcvc2hhcmUvOmZpbGVpZCcpLnBvc3QoYXN5bmMgKHJlcTogYW55LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcblx0bGV0IGZpbGVpZCA9IHJlcS5wYXJhbXMuZmlsZWlkXHJcblx0bGV0IGRvY3VtZW50ID0gYXdhaXQgZG9jLmZpbmRPbmUoeyBmaWxlSWQ6IGZpbGVpZCB9KS5wb3B1bGF0ZSgnb3duZXInKVxyXG5cdGxldCBzaGFyZWRVc2VyID0gYXdhaXQgdXNlci5maW5kT25lKHsgdXNlcm5hbWU6IHJlcS5ib2R5LnNoYXJlVXNlcm5hbWUgfSlcclxuXHJcblx0aWYgKHJlcS51c2VyLnVzZXJuYW1lID09IGRvY3VtZW50Lm93bmVyLnVzZXJuYW1lKSB7XHJcblx0XHRkb2N1bWVudC5zaGFyZWRXaXRoLnB1c2goc2hhcmVkVXNlci5faWQpXHJcblx0XHRhd2FpdCBkb2N1bWVudC5zYXZlKClcclxuXHR9IGVsc2UgaWYgKHJlcS51c2VyLnVzZXJuYW1lID09IHJlcS5ib2R5LnNoYXJlVXNlcm5hbWUpIHtcclxuXHRcdHJldHVybiByZXNcclxuXHRcdFx0LnN0YXR1cyg0MDEpXHJcblx0XHRcdC5qc29uKHsgcGF5bG9hZDogeyBtZXNzYWdlOiAnQ2FudCBzaGFyZSB3aXRoIHlvdXJzZWxmJyB9IH0pXHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7IHBheWxvYWQ6IHsgbWVzc2FnZTogJ05vdCB0aGUgb3duZXInIH0gfSlcclxuXHR9XHJcblxyXG5cdHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgcGF5bG9hZDogeyBtZXNzYWdlOiAnU3VjY2Vzc2Z1bGx5IHNoYXJlZCcgfSB9KVxyXG59KVxyXG5cclxucm91dGVyXHJcblx0LnJvdXRlKCcvOmZpbGVpZCcpXHJcblx0LmdldChhc3luYyAocmVxOiBhbnksIHJlczogUmVzcG9uc2UpID0+IHtcclxuXHRcdGxldCByZXN1bHQgPSBhd2FpdCBkb2NcclxuXHRcdFx0LmZpbmRPbmUoeyBmaWxlSWQ6IHJlcS5wYXJhbXMuZmlsZWlkIH0pXHJcblx0XHRcdC5wb3B1bGF0ZSgnb3duZXInKVxyXG5cdFx0XHQucG9wdWxhdGUoJ2xvY2tlZEJ5JylcclxuXHRcdFx0LnBvcHVsYXRlKCdzaGFyZWRXaXRoJylcclxuXHRcdFx0LnBvcHVsYXRlKCdsb2cudXNlcicpXHJcblx0XHRyZXMuc3RhdHVzKDIwMCkuanNvbih7IHBheWxvYWQ6IHJlc3VsdCB9KVxyXG5cdH0pXHJcblx0LmRlbGV0ZShhc3luYyAocmVxOiBhbnksIHJlczogUmVzcG9uc2UpID0+IHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGF3YWl0IGRvYy5kZWxldGVPbmUoeyBmaWxlSWQ6IHJlcS5wYXJhbXMuZmlsZWlkIH0pXHJcblxyXG5cclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdHJlcy5zdGF0dXMoNDAxKS5qc29uKHsgcGF5bG9hZDogeyBtZXNzYWdlOiAnQ291bGRudCBkZWxldGUgZmlsZScgfSB9KVxyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlclxyXG4iXX0=