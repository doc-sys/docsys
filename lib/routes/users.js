"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/* eslint-disable no-prototype-builtins */
var express = require('express');

var jwt = require('jsonwebtoken');

var router = express.Router();

var _require = require('../lib/helpers/error'),
    ErrorHandler = _require.ErrorHandler;

var user = require('../models/user');

router.route('/login')
/**
 * @api {post} /user/login User login
 * @apiName userLogin
 * @apiGroup User
 * @apiDescription Logs user in and returns the user and API token
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiSuccess {Object} user User profile
 * @apiSuccess {String} token API token
 * @apiError (401) {String} LoginFailed
 */
.post( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var result, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password')) {
              _context.next = 3;
              break;
            }

            throw new ErrorHandler(400, 'Please provide valid information');

          case 3:
            _context.prev = 3;
            _context.next = 6;
            return user.getAuthenticated(req.body.username, req.body.password);

          case 6:
            result = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](3);
            throw new ErrorHandler(401, 'Login data is incorrect');

          case 12:
            _context.next = 14;
            return jwt.sign(result.toJSON(), process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES
            });

          case 14:
            token = _context.sent;
            res.status(200).json({
              payload: {
                user: result,
                token: token
              }
            });
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t1 = _context["catch"](0);
            next(_context.t1);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 18], [3, 9]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.route('/signup')
/**
 * @api {post} /user/signup User signup
 * @apiName userSignup
 * @apiGroup User
 * @apiDescription Signs user up and logs in automatically
 * @apiParam {String} username Username
 * @apiParam {String} password Password according to policy
 * @apiParam {String} mail Valid email
 * @apiParam {String} displayName Full name
 * @apiSuccess {Object} user User profile
 * @apiSuccess {String} token API token
 * @apiError (500) {String} InternalError Something went wrong during signup. Most likely to be during validation.
 * @apiDeprecated Users should not be allowed to sign up by themselfes but rather be invited to use docSys
 */
.post( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var newUser, token;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password') && req.body.hasOwnProperty('mail') && req.body.hasOwnProperty('displayName')) {
              _context2.next = 3;
              break;
            }

            throw new ErrorHandler(400, 'Please provide valid information');

          case 3:
            newUser = new user({
              username: req.body.username,
              password: req.body.password,
              mail: req.body.mail,
              settings: {
                language: 'en',
                displayName: req.body.displayName
              }
            });
            token = jwt.sign(newUser.toObject(), process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES
            });
            _context2.prev = 5;
            _context2.next = 8;
            return newUser.save();

          case 8:
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](5);
            throw new ErrorHandler(400, 'Please provide valid syntax for your request');

          case 13:
            res.status(200).json({
              payload: {
                user: newUser,
                token: token
              }
            });
            _context2.next = 19;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t1 = _context2["catch"](0);
            next(_context2.t1);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 16], [5, 10]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.route('/signup/:inviteid')
/**
 * @api {post} /user/signup/:inviteid User signup with invite
 * @apiName userInvite
 * @apiGroup User
 * @apiDescription New alternative for userSignup. Potential user should recieve a token per mail with that he can join the organistaion.
 * @apiParam {String} inviteid The invitatation ID as part of the POST URL
 * @apiSuccess {Object} user User profile
 * @apiSuccess {String} token API token
 * @apiError (500) {String} InternalError Something went wrong during signup. Most likely to be during validation.
 * @apiError (401) {String} InvalidInvite User didn't provide a valid ID
 */
.post( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            res.status(200).json();

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());
router.route('/autocomplete')
/**
 * @api {get} /user/autocomplete Username Autocomplete JSON
 * @apiName UserNameAutoComplete
 * @apiGroup User
 * @apiDescription Gives back the full user list (names and usernames) for use in autocomplete
 * @apiSuccess {Array} userList List of user profiles
 * @apiError (500) {String} InternalError Something went wrong.
 */
.get( /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var userList;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return user.find().select('username settings.displayName avatar');

          case 3:
            userList = _context4.sent;
            res.status(200).json({
              payload: userList
            });
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            res.status(500).json({
              payload: {
                message: _context4.t0.message
              }
            });

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function (_x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}());
module.exports = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvdXNlcnMuanMiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJqd3QiLCJyb3V0ZXIiLCJSb3V0ZXIiLCJFcnJvckhhbmRsZXIiLCJ1c2VyIiwicm91dGUiLCJwb3N0IiwicmVxIiwicmVzIiwibmV4dCIsImJvZHkiLCJoYXNPd25Qcm9wZXJ0eSIsImdldEF1dGhlbnRpY2F0ZWQiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwicmVzdWx0Iiwic2lnbiIsInRvSlNPTiIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwiZXhwaXJlc0luIiwiSldUX0VYUElSRVMiLCJ0b2tlbiIsInN0YXR1cyIsImpzb24iLCJwYXlsb2FkIiwibmV3VXNlciIsIm1haWwiLCJzZXR0aW5ncyIsImxhbmd1YWdlIiwiZGlzcGxheU5hbWUiLCJ0b09iamVjdCIsInNhdmUiLCJnZXQiLCJmaW5kIiwic2VsZWN0IiwidXNlckxpc3QiLCJtZXNzYWdlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBLElBQUlBLE9BQU8sR0FBR0MsT0FBTyxDQUFDLFNBQUQsQ0FBckI7O0FBQ0EsSUFBSUMsR0FBRyxHQUFHRCxPQUFPLENBQUMsY0FBRCxDQUFqQjs7QUFDQSxJQUFJRSxNQUFNLEdBQUdILE9BQU8sQ0FBQ0ksTUFBUixFQUFiOztlQUV1QkgsT0FBTyxDQUFDLHNCQUFELEM7SUFBeEJJLFksWUFBQUEsWTs7QUFDTixJQUFJQyxJQUFJLEdBQUdMLE9BQU8sQ0FBQyxnQkFBRCxDQUFsQjs7QUFFQUUsTUFBTSxDQUNKSSxLQURGLENBQ1EsUUFEUjtBQUVDOzs7Ozs7Ozs7OztBQUZELENBYUVDLElBYkY7QUFBQSwyRkFhTyxpQkFBT0MsR0FBUCxFQUFZQyxHQUFaLEVBQWlCQyxJQUFqQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQSxnQkFJRkYsR0FBRyxDQUFDRyxJQUFKLENBQVNDLGNBQVQs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QUFBO0FBUUg3QixZQUFBQSxHQUFHLENBQUNnQixNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUI7QUFBRUMsY0FBQUEsT0FBTyxFQUFFO0FBQUVZLGdCQUFBQSxPQUFPLEVBQUUsYUFBTUE7QUFBakI7QUFBWCxhQUFyQjs7QUFSRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQVZOOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBc0JBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJ2QyxNQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvdHlwZS1idWlsdGlucyAqL1xyXG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG52YXIgand0ID0gcmVxdWlyZSgnanNvbndlYnRva2VuJylcclxudmFyIHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKClcclxuXHJcbnZhciB7IEVycm9ySGFuZGxlciB9ID0gcmVxdWlyZSgnLi4vbGliL2hlbHBlcnMvZXJyb3InKVxyXG52YXIgdXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJylcclxuXHJcbnJvdXRlclxyXG5cdC5yb3V0ZSgnL2xvZ2luJylcclxuXHQvKipcclxuXHQgKiBAYXBpIHtwb3N0fSAvdXNlci9sb2dpbiBVc2VyIGxvZ2luXHJcblx0ICogQGFwaU5hbWUgdXNlckxvZ2luXHJcblx0ICogQGFwaUdyb3VwIFVzZXJcclxuXHQgKiBAYXBpRGVzY3JpcHRpb24gTG9ncyB1c2VyIGluIGFuZCByZXR1cm5zIHRoZSB1c2VyIGFuZCBBUEkgdG9rZW5cclxuXHQgKiBAYXBpUGFyYW0ge1N0cmluZ30gdXNlcm5hbWVcclxuXHQgKiBAYXBpUGFyYW0ge1N0cmluZ30gcGFzc3dvcmRcclxuXHQgKiBAYXBpU3VjY2VzcyB7T2JqZWN0fSB1c2VyIFVzZXIgcHJvZmlsZVxyXG5cdCAqIEBhcGlTdWNjZXNzIHtTdHJpbmd9IHRva2VuIEFQSSB0b2tlblxyXG5cdCAqIEBhcGlFcnJvciAoNDAxKSB7U3RyaW5nfSBMb2dpbkZhaWxlZFxyXG5cdCAqL1xyXG5cdC5wb3N0KGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdCEoXHJcblx0XHRcdFx0XHRyZXEuYm9keS5oYXNPd25Qcm9wZXJ0eSgndXNlcm5hbWUnKSAmJlxyXG5cdFx0XHRcdFx0cmVxLmJvZHkuaGFzT3duUHJvcGVydHkoJ3Bhc3N3b3JkJylcclxuXHRcdFx0XHQpXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvckhhbmRsZXIoNDAwLCAnUGxlYXNlIHByb3ZpZGUgdmFsaWQgaW5mb3JtYXRpb24nKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHZhciByZXN1bHQgPSBhd2FpdCB1c2VyLmdldEF1dGhlbnRpY2F0ZWQoXHJcblx0XHRcdFx0XHRyZXEuYm9keS51c2VybmFtZSxcclxuXHRcdFx0XHRcdHJlcS5ib2R5LnBhc3N3b3JkXHJcblx0XHRcdFx0KVxyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvckhhbmRsZXIoNDAxLCAnTG9naW4gZGF0YSBpcyBpbmNvcnJlY3QnKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCB0b2tlbiA9IGF3YWl0IGp3dC5zaWduKHJlc3VsdC50b0pTT04oKSwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCwge1xyXG5cdFx0XHRcdGV4cGlyZXNJbjogcHJvY2Vzcy5lbnYuSldUX0VYUElSRVMsXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRyZXMuc3RhdHVzKDIwMCkuanNvbih7IHBheWxvYWQ6IHsgdXNlcjogcmVzdWx0LCB0b2tlbjogdG9rZW4gfSB9KVxyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0bmV4dChlcnJvcilcclxuXHRcdH1cclxuXHR9KVxyXG5cclxucm91dGVyXHJcblx0LnJvdXRlKCcvc2lnbnVwJylcclxuXHQvKipcclxuXHQgKiBAYXBpIHtwb3N0fSAvdXNlci9zaWdudXAgVXNlciBzaWdudXBcclxuXHQgKiBAYXBpTmFtZSB1c2VyU2lnbnVwXHJcblx0ICogQGFwaUdyb3VwIFVzZXJcclxuXHQgKiBAYXBpRGVzY3JpcHRpb24gU2lnbnMgdXNlciB1cCBhbmQgbG9ncyBpbiBhdXRvbWF0aWNhbGx5XHJcblx0ICogQGFwaVBhcmFtIHtTdHJpbmd9IHVzZXJuYW1lIFVzZXJuYW1lXHJcblx0ICogQGFwaVBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIFBhc3N3b3JkIGFjY29yZGluZyB0byBwb2xpY3lcclxuXHQgKiBAYXBpUGFyYW0ge1N0cmluZ30gbWFpbCBWYWxpZCBlbWFpbFxyXG5cdCAqIEBhcGlQYXJhbSB7U3RyaW5nfSBkaXNwbGF5TmFtZSBGdWxsIG5hbWVcclxuXHQgKiBAYXBpU3VjY2VzcyB7T2JqZWN0fSB1c2VyIFVzZXIgcHJvZmlsZVxyXG5cdCAqIEBhcGlTdWNjZXNzIHtTdHJpbmd9IHRva2VuIEFQSSB0b2tlblxyXG5cdCAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nIGR1cmluZyBzaWdudXAuIE1vc3QgbGlrZWx5IHRvIGJlIGR1cmluZyB2YWxpZGF0aW9uLlxyXG5cdCAqIEBhcGlEZXByZWNhdGVkIFVzZXJzIHNob3VsZCBub3QgYmUgYWxsb3dlZCB0byBzaWduIHVwIGJ5IHRoZW1zZWxmZXMgYnV0IHJhdGhlciBiZSBpbnZpdGVkIHRvIHVzZSBkb2NTeXNcclxuXHQgKi9cclxuXHQucG9zdChhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHQhKFxyXG5cdFx0XHRcdFx0cmVxLmJvZHkuaGFzT3duUHJvcGVydHkoJ3VzZXJuYW1lJykgJiZcclxuXHRcdFx0XHRcdHJlcS5ib2R5Lmhhc093blByb3BlcnR5KCdwYXNzd29yZCcpICYmXHJcblx0XHRcdFx0XHRyZXEuYm9keS5oYXNPd25Qcm9wZXJ0eSgnbWFpbCcpICYmXHJcblx0XHRcdFx0XHRyZXEuYm9keS5oYXNPd25Qcm9wZXJ0eSgnZGlzcGxheU5hbWUnKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9ySGFuZGxlcig0MDAsICdQbGVhc2UgcHJvdmlkZSB2YWxpZCBpbmZvcm1hdGlvbicpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBuZXdVc2VyID0gbmV3IHVzZXIoe1xyXG5cdFx0XHRcdHVzZXJuYW1lOiByZXEuYm9keS51c2VybmFtZSxcclxuXHRcdFx0XHRwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXHJcblx0XHRcdFx0bWFpbDogcmVxLmJvZHkubWFpbCxcclxuXHRcdFx0XHRzZXR0aW5nczoge1xyXG5cdFx0XHRcdFx0bGFuZ3VhZ2U6ICdlbicsXHJcblx0XHRcdFx0XHRkaXNwbGF5TmFtZTogcmVxLmJvZHkuZGlzcGxheU5hbWUsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdGNvbnN0IHRva2VuID0gand0LnNpZ24obmV3VXNlci50b09iamVjdCgpLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVULCB7XHJcblx0XHRcdFx0ZXhwaXJlc0luOiBwcm9jZXNzLmVudi5KV1RfRVhQSVJFUyxcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0YXdhaXQgbmV3VXNlci5zYXZlKClcclxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3JIYW5kbGVyKFxyXG5cdFx0XHRcdFx0NDAwLFxyXG5cdFx0XHRcdFx0J1BsZWFzZSBwcm92aWRlIHZhbGlkIHN5bnRheCBmb3IgeW91ciByZXF1ZXN0J1xyXG5cdFx0XHRcdClcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmVzLnN0YXR1cygyMDApLmpzb24oeyBwYXlsb2FkOiB7IHVzZXI6IG5ld1VzZXIsIHRva2VuOiB0b2tlbiB9IH0pXHJcblx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRuZXh0KGVycm9yKVxyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5yb3V0ZXJcclxuXHQucm91dGUoJy9zaWdudXAvOmludml0ZWlkJylcclxuXHQvKipcclxuXHQgKiBAYXBpIHtwb3N0fSAvdXNlci9zaWdudXAvOmludml0ZWlkIFVzZXIgc2lnbnVwIHdpdGggaW52aXRlXHJcblx0ICogQGFwaU5hbWUgdXNlckludml0ZVxyXG5cdCAqIEBhcGlHcm91cCBVc2VyXHJcblx0ICogQGFwaURlc2NyaXB0aW9uIE5ldyBhbHRlcm5hdGl2ZSBmb3IgdXNlclNpZ251cC4gUG90ZW50aWFsIHVzZXIgc2hvdWxkIHJlY2lldmUgYSB0b2tlbiBwZXIgbWFpbCB3aXRoIHRoYXQgaGUgY2FuIGpvaW4gdGhlIG9yZ2FuaXN0YWlvbi5cclxuXHQgKiBAYXBpUGFyYW0ge1N0cmluZ30gaW52aXRlaWQgVGhlIGludml0YXRhdGlvbiBJRCBhcyBwYXJ0IG9mIHRoZSBQT1NUIFVSTFxyXG5cdCAqIEBhcGlTdWNjZXNzIHtPYmplY3R9IHVzZXIgVXNlciBwcm9maWxlXHJcblx0ICogQGFwaVN1Y2Nlc3Mge1N0cmluZ30gdG9rZW4gQVBJIHRva2VuXHJcblx0ICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmcgZHVyaW5nIHNpZ251cC4gTW9zdCBsaWtlbHkgdG8gYmUgZHVyaW5nIHZhbGlkYXRpb24uXHJcblx0ICogQGFwaUVycm9yICg0MDEpIHtTdHJpbmd9IEludmFsaWRJbnZpdGUgVXNlciBkaWRuJ3QgcHJvdmlkZSBhIHZhbGlkIElEXHJcblx0ICovXHJcblx0LnBvc3QoYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcblx0XHRyZXMuc3RhdHVzKDIwMCkuanNvbigpXHJcblx0fSlcclxuXHJcbnJvdXRlclxyXG5cdC5yb3V0ZSgnL2F1dG9jb21wbGV0ZScpXHJcblx0LyoqXHJcblx0ICogQGFwaSB7Z2V0fSAvdXNlci9hdXRvY29tcGxldGUgVXNlcm5hbWUgQXV0b2NvbXBsZXRlIEpTT05cclxuXHQgKiBAYXBpTmFtZSBVc2VyTmFtZUF1dG9Db21wbGV0ZVxyXG5cdCAqIEBhcGlHcm91cCBVc2VyXHJcblx0ICogQGFwaURlc2NyaXB0aW9uIEdpdmVzIGJhY2sgdGhlIGZ1bGwgdXNlciBsaXN0IChuYW1lcyBhbmQgdXNlcm5hbWVzKSBmb3IgdXNlIGluIGF1dG9jb21wbGV0ZVxyXG5cdCAqIEBhcGlTdWNjZXNzIHtBcnJheX0gdXNlckxpc3QgTGlzdCBvZiB1c2VyIHByb2ZpbGVzXHJcblx0ICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmcuXHJcblx0ICovXHJcblx0LmdldChhc3luYyAocmVxLCByZXMpID0+IHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGxldCB1c2VyTGlzdCA9IGF3YWl0IHVzZXJcclxuXHRcdFx0XHQuZmluZCgpXHJcblx0XHRcdFx0LnNlbGVjdCgndXNlcm5hbWUgc2V0dGluZ3MuZGlzcGxheU5hbWUgYXZhdGFyJylcclxuXHJcblx0XHRcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgcGF5bG9hZDogdXNlckxpc3QgfSlcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgcGF5bG9hZDogeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0gfSlcclxuXHRcdH1cclxuXHR9KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXJcclxuIl19