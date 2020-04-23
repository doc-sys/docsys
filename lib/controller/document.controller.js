"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadFiles = exports.createNewDocument = exports.getAllDocuments = exports.getSharedDocuments = exports.getOwnDocuments = exports.checkPropertyUsername = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _error = require("../lib/helpers/error");

var _document = require("../models/document");

var router = _express["default"].Router(); //CheckPropertyHandler


var checkPropertyUsername = function checkPropertyUsername(req, res, next) {
  req.body.hasOwnProperty('username') || req.params.hasOwnProperty('username') ? next() : next(new _error.ErrorHandler(400, 'Please provide a username'));
}; //Model Find Operations


exports.checkPropertyUsername = checkPropertyUsername;

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
}(); //Create And Update Model


exports.getAllDocuments = getAllDocuments;

var createNewDocument = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var newDoc;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            newDoc = new _document.doc(req.body);
            _context4.next = 4;
            return newDoc.save();

          case 4:
            res.locals.doc = _context4.sent;
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            return _context4.abrupt("return", next(new _error.ErrorHandler(500, "Error creating document: ".concat(_context4.t0.message))));

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function createNewDocument(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.createNewDocument = createNewDocument;

var uploadFiles = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function uploadFiles(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.uploadFiles = uploadFiles;
module.exports = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsicm91dGVyIiwiZXhwcmVzcyIsIlJvdXRlciIsImNoZWNrUHJvcGVydHlVc2VybmFtZSIsInJlcSIsInJlcyIsIm5leHQiLCJib2R5IiwiaGFzT3duUHJvcGVydHkiLCJwYXJhbXMiLCJFcnJvckhhbmRsZXIiLCJnZXRPd25Eb2N1bWVudHMiLCJsb2NhbHMiLCJhdXRoX3VzZXIiLCJkb2MiLCJmaW5kIiwib3duZXIiLCJfaWQiLCJzb3J0Iiwic29ydGVkIiwicXVlcnkiLCJzZWxlY3QiLCJkb2NzIiwibWVzc2FnZSIsImdldFNoYXJlZERvY3VtZW50cyIsInNoYXJlZFdpdGgiLCJwb3B1bGF0ZSIsImdldEFsbERvY3VtZW50cyIsImFsbERvY3MiLCJjcmVhdGVOZXdEb2N1bWVudCIsIm5ld0RvYyIsInNhdmUiLCJ1cGxvYWRGaWxlcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFHQSxJQUFJQSxNQUFNLEdBQUdDLG9CQUFRQyxNQUFSLEVBQWIsQyxDQUVBOzs7QUFDTyxJQUFNQyxxQkFBcUIsR0FBRyxTQUF4QkEscUJBQXdCLENBQUNDLEdBQUQsRUFBZUMsR0FBZixFQUE4QkMsSUFBOUIsRUFBMkQ7QUFDNUZGLEVBQUFBLEdBQUcsQ0FBQ0csSUFBSixDQUFTQyxjQUFULENBQXdCLFVBQXhCLEtBQXVDSixHQUFHLENBQUNLLE1BQUosQ0FBV0QsY0FBWCxDQUEwQixVQUExQixDQUF2QyxHQUErRUYsSUFBSSxFQUFuRixHQUF3RkEsSUFBSSxDQUFDLElBQUlJLG1CQUFKLENBQWlCLEdBQWpCLEVBQXNCLDJCQUF0QixDQUFELENBQTVGO0FBQ0gsQ0FGTSxDLENBSVA7Ozs7O0FBQ08sSUFBTUMsZUFBZTtBQUFBLDJGQUFHLGlCQUFPUCxHQUFQLEVBQXFCQyxHQUFyQixFQUFvQ0MsSUFBcEM7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QUxZOztBQUFBO0FBUTNCakIsWUFBQUEsSUFBSTs7QUFSdUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBZnFCLGVBQWU7QUFBQTtBQUFBO0FBQUEsR0FBckIsQyxDQVdQOzs7OztBQUVPLElBQU1FLGlCQUFpQjtBQUFBLDRGQUFHLGtCQUFPekIsR0FBUCxFQUFxQkMsR0FBckIsRUFBb0NDLElBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXJCd0IsWUFBQUEsTUFGcUIsR0FFWixJQUFJaEIsYUFBSixDQUFRVixHQUFHLENBQUNHLElBQVosQ0FGWTtBQUFBO0FBQUEsbUJBR0Z1QixNQUFNLENBQUNDLElBQVAsRUFIRTs7QUFBQTtBQUd6QjFCLFlBQUFBLEdBQUcsQ0FBQ08sTUFBSixDQUFXRSxHQUhjO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FLbEJSLElBQUksQ0FBQyxJQUFJSSxtQkFBSixDQUFpQixHQUFqQixxQ0FBa0QsYUFBaUJhLE9BQW5FLEVBQUQsQ0FMYzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFqQk0saUJBQWlCO0FBQUE7QUFBQTtBQUFBLEdBQXZCOzs7O0FBU0EsSUFBTUcsV0FBVztBQUFBLDRGQUFHLGtCQUFPNUIsR0FBUCxFQUFxQkMsR0FBckIsRUFBb0NDLElBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBWDBCLFdBQVc7QUFBQTtBQUFBO0FBQUEsR0FBakI7OztBQUlQQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJsQyxNQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzLCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiXHJcbmltcG9ydCB7IGNoZWNrLCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InXHJcbmltcG9ydCB7IEVycm9ySGFuZGxlciwgaGFuZGxlRXJyb3IgfSBmcm9tICcuLi9saWIvaGVscGVycy9lcnJvcic7XHJcbmltcG9ydCB7IGRvYyB9IGZyb20gJy4uL21vZGVscy9kb2N1bWVudCdcclxuaW1wb3J0IHsgdXNlciB9IGZyb20gJy4uL21vZGVscy91c2VyJ1xyXG5cclxubGV0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKClcclxuXHJcbi8vQ2hlY2tQcm9wZXJ0eUhhbmRsZXJcclxuZXhwb3J0IGNvbnN0IGNoZWNrUHJvcGVydHlVc2VybmFtZSA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbik6IHZvaWQgPT4ge1xyXG4gICAgcmVxLmJvZHkuaGFzT3duUHJvcGVydHkoJ3VzZXJuYW1lJykgfHwgcmVxLnBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndXNlcm5hbWUnKSA/IG5leHQoKSA6IG5leHQobmV3IEVycm9ySGFuZGxlcig0MDAsICdQbGVhc2UgcHJvdmlkZSBhIHVzZXJuYW1lJykpXHJcbn1cclxuXHJcbi8vTW9kZWwgRmluZCBPcGVyYXRpb25zXHJcbmV4cG9ydCBjb25zdCBnZXRPd25Eb2N1bWVudHMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGlmICghcmVzLmxvY2Fscy5hdXRoX3VzZXIpIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBcIkNhbid0IGFjY2VzcyB1c2VyIHByb3BlcnR5XCIpKVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGRvY3MgPSBhd2FpdCBkb2MuZmluZCh7IG93bmVyOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQgfSkuc29ydChyZXEuYm9keS5zb3J0ZWQgfHwgcmVxLnF1ZXJ5LnNvcnRlZCB8fCAnLWRhdGVkJykuc2VsZWN0KCd0aXRsZSBkYXRlZCBmaWxlSWQgbG9ja2VkJylcclxuICAgICAgICByZXMubG9jYWxzLmRvY3MgPSBkb2NzXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpKVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0U2hhcmVkRG9jdW1lbnRzID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBpZiAoIXJlcy5sb2NhbHMuYXV0aF91c2VyKSByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgXCJDYW4ndCBhY2Nlc3MgdXNlciBwcm9wZXJ0eVwiKSlcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBkb2NzID0gYXdhaXQgZG9jLmZpbmQoeyBzaGFyZWRXaXRoOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQgfSkuc29ydChyZXEuYm9keS5zb3J0ZWQgfHwgcmVxLnF1ZXJ5LnNvcnRlZCB8fCAnLWRhdGVkJykucG9wdWxhdGUoJ293bmVyJykuc2VsZWN0KCd0aXRsZSBkYXRlZCBmaWxlSWQgbG9ja2VkIG93bmVyLnVzZXJuYW1lIG93bmVyLmF2YXRhcicpXHJcbiAgICAgICAgcmVzLmxvY2Fscy5kb2NzID0gZG9jc1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKSlcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbERvY3VtZW50cyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgYWxsRG9jcyA9IGF3YWl0IGRvYy5maW5kKHt9KS5wb3B1bGF0ZSgnb3duZXInKVxyXG4gICAgICAgIHJlcy5sb2NhbHMuZG9jcyA9IGFsbERvY3NcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBnZXR0aW5nIGRvY3VtZW50czogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpXHJcbn1cclxuXHJcbi8vQ3JlYXRlIEFuZCBVcGRhdGUgTW9kZWxcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVOZXdEb2N1bWVudCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgbmV3RG9jID0gbmV3IGRvYyhyZXEuYm9keSlcclxuICAgICAgICByZXMubG9jYWxzLmRvYyA9IGF3YWl0IG5ld0RvYy5zYXZlKClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjcmVhdGluZyBkb2N1bWVudDogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1cGxvYWRGaWxlcyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXIiXX0=