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
            console.log(history);
            res.locals.history = history[0];
            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", next(new _error.ErrorHandler(500, "Error creating conversation: ".concat(_context3.t0.message))));

          case 11:
            next();

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));

  return function getConversationHistory(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getConversationHistory = getConversationHistory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL21lc3NhZ2UuY29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJjcmVhdGVOZXdDb252ZXJzYXRpb24iLCJyZXEiLCJyZXMiLCJuZXh0IiwiY29udmVyc2F0aW9uQm9keSIsImNvbnZvSWQiLCJwYXJ0aWNpcGFudHMiLCJib2R5IiwibG9jYWxzIiwiYXV0aF91c2VyIiwiX2lkIiwibWVzc2FnZXMiLCJmcm9tIiwiY29udGVudCIsIm1lc3NhZ2UiLCJuZXdDb252ZXJzYXRpb24iLCJjb252ZXJzYXRpb24iLCJzYXZlIiwicG9wdWxhdGUiLCJjb252ZXJzYXRpb25JZCIsIkVycm9ySGFuZGxlciIsImdldENvbnZlcnNhdGlvbnMiLCJmaW5kIiwic29ydCIsInNlbGVjdCIsImV4ZWMiLCJjb252ZXJzYXRpb25zIiwiZ2V0Q29udmVyc2F0aW9uSGlzdG9yeSIsInBhcmFtcyIsImNvbnZvaWQiLCJoaXN0b3J5IiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRU8sSUFBTUEscUJBQXFCO0FBQUEsMkZBQUcsaUJBQU9DLEdBQVAsRUFBcUJDLEdBQXJCLEVBQW9DQyxJQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUV2QkMsWUFBQUEsZ0JBRnVCLEdBRUo7QUFDckJDLGNBQUFBLE9BQU8sRUFBRSxlQURZO0FBRXJCQyxjQUFBQSxZQUFZLGdEQUNMTCxHQUFHLENBQUNNLElBQUosQ0FBU0QsWUFESixJQUVSSixHQUFHLENBQUNNLE1BQUosQ0FBV0MsU0FBWCxDQUFxQkMsR0FGYixFQUZTO0FBTXJCQyxjQUFBQSxRQUFRLEVBQUUsQ0FDTjtBQUNJQyxnQkFBQUEsSUFBSSxFQUFFVixHQUFHLENBQUNNLE1BQUosQ0FBV0MsU0FBWCxDQUFxQkMsR0FEL0I7QUFFSUcsZ0JBQUFBLE9BQU8sRUFBRVosR0FBRyxDQUFDTSxJQUFKLENBQVNPO0FBRnRCLGVB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QSxrQkFBdEJ3QixzQkFBc0I7QUFBQTtBQUFBO0FBQUEsR0FBNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IEVycm9ySGFuZGxlciB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2Vycm9yJztcbmltcG9ydCB7IGNvbnZlcnNhdGlvbiB9IGZyb20gJy4uL21vZGVscy9jb252ZXJzYXRpb24nXG5cbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJ1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTmV3Q29udmVyc2F0aW9uID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY29udmVyc2F0aW9uQm9keSA9IHtcbiAgICAgICAgICAgIGNvbnZvSWQ6IHV1aWQoKSxcbiAgICAgICAgICAgIHBhcnRpY2lwYW50czogW1xuICAgICAgICAgICAgICAgIC4uLnJlcS5ib2R5LnBhcnRpY2lwYW50cyxcbiAgICAgICAgICAgICAgICByZXMubG9jYWxzLmF1dGhfdXNlci5faWRcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBtZXNzYWdlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogcmVzLmxvY2Fscy5hdXRoX3VzZXIuX2lkLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiByZXEuYm9keS5tZXNzYWdlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIGxldCBuZXdDb252ZXJzYXRpb24gPSBuZXcgY29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbkJvZHkpXG4gICAgICAgIGF3YWl0IG5ld0NvbnZlcnNhdGlvbi5zYXZlKClcbiAgICAgICAgbmV3Q29udmVyc2F0aW9uID0gYXdhaXQgbmV3Q29udmVyc2F0aW9uLnBvcHVsYXRlKCdwYXJ0aWNpcGFudHMnKVxuICAgICAgICByZXMubG9jYWxzLmNvbnZlcnNhdGlvbklkID0gbmV3Q29udmVyc2F0aW9uXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlcig1MDAsIGBFcnJvciBjcmVhdGluZyBjb252ZXJzYXRpb246ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApKVxuICAgIH1cblxuICAgIG5leHQoKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0Q29udmVyc2F0aW9ucyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNvbnZlcnNhdGlvbnMgPSBhd2FpdCBjb252ZXJzYXRpb24uZmluZCh7IHBhcnRpY2lwYW50czogeyAnJGluJzogW3Jlcy5sb2NhbHMuYXV0aF91c2VyLl9pZF0gfSB9KS5wb3B1bGF0ZSgncGFydGljaXBhbnRzJykuc29ydChbWydsYXN0TWVzc2FnZScsIC0xXV0pLnNlbGVjdCgnY29udm9JZCBsYXN0TWVzc2FnZSBwYXJ0aWNpcGFudHMnKS5leGVjKClcbiAgICAgICAgcmVzLmxvY2Fscy5jb252ZXJzYXRpb25zID0gY29udmVyc2F0aW9uc1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgY3JlYXRpbmcgY29udmVyc2F0aW9uOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn1cblxuZXhwb3J0IGNvbnN0IGdldENvbnZlcnNhdGlvbkhpc3RvcnkgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBoaXN0b3J5ID0gYXdhaXQgY29udmVyc2F0aW9uLmZpbmQoeyBjb252b0lkOiByZXEucGFyYW1zLmNvbnZvaWQgfHwgcmVxLmJvZHkuY29udm9pZCB9KS5wb3B1bGF0ZSgnbWVzc2FnZXMuZnJvbScpLnNvcnQoW1snbWVzc2FnZXMudGltZXN0YW1wJywgMV1dKS5zZWxlY3QoJ21lc3NhZ2VzIGNvbnZvSWQnKS5leGVjKClcbiAgICAgICAgY29uc29sZS5sb2coaGlzdG9yeSlcbiAgICAgICAgcmVzLmxvY2Fscy5oaXN0b3J5ID0gaGlzdG9yeVswXVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIoNTAwLCBgRXJyb3IgY3JlYXRpbmcgY29udmVyc2F0aW9uOiAkeyhlcnJvciBhcyBFcnJvcikubWVzc2FnZX1gKSlcbiAgICB9XG5cbiAgICBuZXh0KClcbn0iXX0=