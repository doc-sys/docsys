"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConversationHistory = exports.getConversations = exports.createNewConversation = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _error = require("../lib/helpers/error");

var _conversation = require("../models/conversation");

var _uuid = require("uuid");

var createNewConversation = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var conversationBody, newConversation;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            conversationBody = {
              convoId: (0, _uuid.v4)(),
              participants: [].concat((0, _toConsumableArray2["default"])(req.body.participants), [res.locals.auth_user._id]),
              messages: [{
                from: res.locals.auth_user._id,
                content: req.body.message
              }]
            };
            newConversation = new _conversation.conversation(conversationBody);
            _context.next = 5;
            return newConversation.save();

          case 5:
            _context.next = 7;
            return newConversation.populate('participants');

          case 7:
            newConversation = _context.sent;
            res.locals.conversationId = newConversation;
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", next(new _error.ErrorHandler(500, "Error creating conversation: ".concat(_context.t0.message))));

          case 14:
            next();

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function createNewConversation(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.createNewConversation = createNewConversation;

var getConversations = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var conversations;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _conversation.conversation.find({
              participants: {
                '$in': [res.locals.auth_user._id]
              }
            }).populate('participants').sort([['lastMessage', -1]]).select('convoId lastMessage participants').exec();

          case 3:
            conversations = _context2.sent;
            res.locals.conversations = conversations;
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", next(new _error.ErrorHandler(500, "Error creating conversation: ".concat(_context2.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function getConversations(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getConversations = getConversations;

var getConversationHistory = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var history;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _conversation.conversation.find({
              convoId: req.params.convoid || req.body.convoid
            }).populate('messages.from').sort([['messages.timestamp', 1]]).select('messages convoId').exec();

          case 3:
            history = _context3.sent;
            res.locals.history = history;
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", next(new _error.ErrorHandler(500, "Error creating conversation: ".concat(_context3.t0.message))));

          case 10:
            next();

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function getConversationHistory(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getConversationHistory = getConversationHistory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL21lc3NhZ2UuY29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJjcmVhdGVOZXdDb252ZXJzYXRpb24iLCJyZXEiLCJyZXMiLCJuZXh0IiwiY29udmVyc2F0aW9uQm9keSIsImNvbnZvSWQiLCJwYXJ0aWNpcGFudHMiLCJib2R5IiwibG9jYWxzIiwiYXV0aF91c2VyIiwiX2lkIiwibWVzc2FnZXMiLCJmcm9tIiwiY29udGVudCIsIm1lc3NhZ2UiLCJuZXdDb252ZXJzYXRpb24iLCJjb252ZXJzYXRpb24iLCJzYXZlIiwicG9wdWxhdGUiLCJjb252ZXJzYXRpb25JZCIsIkVycm9ySGFuZGxlciIsImdldENvbnZlcnNhdGlvbnMiLCJmaW5kIiwic29ydCIsInNlbGVjdCIsImV4ZWMiLCJjb252ZXJzYXRpb25zIiwiZ2V0Q29udmVyc2F0aW9uSGlzdG9yeSIsInBhcmFtcyIsImNvbnZvaWQiLCJoaXN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFTyxJQUFNQSxxQkFBcUI7QUFBQSwyRkFBRyxpQkFBT0MsR0FBUCxFQUFxQkMsR0FBckIsRUFBb0NDLElBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXZCQyxZQUFBQSxnQkFGdUIsR0FFSjtBQUNyQkMsY0FBQUEsT0FBTyxFQUFFLGVBRFk7QUFFckJDLGNBQUFBLFlBQVksZ0RBQ0xMLEdBQUcsQ0FBQ00sSUFBSixDQUFTRCxZQURKLElBRVJKLEdBQUcsQ0FBQ00sTUFBSixDQUFXQyxTQUFYLENBQXFCQyxHQUZiLEVBRlM7QUFNckJDLGNBQUFBLFFBQVEsRUFBRSxDQUNOO0FBQ0lDLGdCQUFBQSxJQUFJLEVBQUVWLEdBQUcsQ0FBQ00sTUFBSixDQUFXQyxTQUFYLENBQXFCQyxHQUQvQjtBQUVJRyxnQkFBQUEsT0FBTyxFQUFFWixHQUFHLENBQUNNLElBQUosQ0FBU087QUFGdEIsZUFETTtBQU5XLGFBRkk7QUFl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cXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvZXJyb3InO1xuaW1wb3J0IHsgY29udmVyc2F0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL2NvbnZlcnNhdGlvbidcblxuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOZXdDb252ZXJzYXRpb24gPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjb252ZXJzYXRpb25Cb2R5ID0ge1xuICAgICAgICAgICAgY29udm9JZDogdXVpZCgpLFxuICAgICAgICAgICAgcGFydGljaXBhbnRzOiBbXG4gICAgICAgICAgICAgICAgLi4ucmVxLmJvZHkucGFydGljaXBhbnRzLFxuICAgICAgICAgICAgICAgIHJlcy5sb2NhbHMuYXV0aF91c2VyLl9pZFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBmcm9tOiByZXMubG9jYWxzLmF1dGhfdXNlci5faWQsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHJlcS5ib2R5Lm1lc3NhZ2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG5ld0NvbnZlcnNhdGlvbiA9IG5ldyBjb252ZXJzYXRpb24oY29udmVyc2F0aW9uQm9keSlcbiAgICAgICAgYXdhaXQgbmV3Q29udmVyc2F0aW9uLnNhdmUoKVxuICAgICAgICBuZXdDb252ZXJzYXRpb24gPSBhd2FpdCBuZXdDb252ZXJzYXRpb24ucG9wdWxhdGUoJ3BhcnRpY2lwYW50cycpXG4gICAgICAgIHJlcy5sb2NhbHMuY29udmVyc2F0aW9uSWQgPSBuZXdDb252ZXJzYXRpb25cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyKDUwMCwgYEVycm9yIGNyZWF0aW5nIGNvbnZlcnNhdGlvbjogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCkpXG4gICAgfVxuXG4gICAgbmV4dCgpXG59XG5cbmV4cG9ydCBjb25zdCBnZXRDb252ZXJzYXRpb25zID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY29udmVyc2F0aW9ucyA9IGF3YWl0IGNvbnZlcnNhdGlvbi5maW5kKHsgcGFydGljaXBhbnRzOiB7ICckaW4nOiBbcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkXSB9IH0pLnBvcHVsYXRlKCdwYXJ0aWNpcGFudHMnKS5zb3J0KFtbJ2xhc3RNZXNzYWdlJywgLTFdXSkuc2VsZWN0KCdjb252b0lkIGxhc3RNZXNzYWdlIHBhcnRpY2lwYW50cycpLmV4ZWMoKVxuICAgICAgICByZXMubG9jYWxzLmNvbnZlcnNhdGlvbnMgPSBjb252ZXJzYXRpb25zXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjcmVhdGluZyBjb252ZXJzYXRpb246ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0Q29udmVyc2F0aW9uSGlzdG9yeSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGhpc3RvcnkgPSBhd2FpdCBjb252ZXJzYXRpb24uZmluZCh7IGNvbnZvSWQ6IHJlcS5wYXJhbXMuY29udm9pZCB8fCByZXEuYm9keS5jb252b2lkIH0pLnBvcHVsYXRlKCdtZXNzYWdlcy5mcm9tJykuc29ydChbWydtZXNzYWdlcy50aW1lc3RhbXAnLCAxXV0pLnNlbGVjdCgnbWVzc2FnZXMgY29udm9JZCcpLmV4ZWMoKVxuICAgICAgICByZXMubG9jYWxzLmhpc3RvcnkgPSBoaXN0b3J5XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjcmVhdGluZyBjb252ZXJzYXRpb246ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufSJdfQ==