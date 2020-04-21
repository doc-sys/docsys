"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/* eslint-disable no-useless-escape */
var mongoose = require('mongoose');

var bcrypt = require('bcryptjs');

var sharp = require('sharp');

var SALT_FACTOR = 10;
var MAX_LOGIN_ATTEMPTS = 10;
var LOCK_TIME = 2 * 60 * 60 * 1000;
var user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  settings: {
    language: {
      type: String,
      "enum": ['en', 'de'],
      "default": 'en'
    },
    displayName: {
      type: String
    }
  },
  avatar: {
    type: String,
    "default": '/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABAAEADASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAMEBgUBB//EACoQAAICAQMDAwIHAAAAAAAAAAABAgMEERIhBTFREzJBYXEzQlKRocHh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APrYAAAtYOHLKk+dta7yOxVgY1a0Vak/MuQM6DQ29PxrF+GoPzHg42ZizxbNJcxftl5ArgAAAANNiVKnGrgvhc/cmI6JqymE12lFMkAFbqNStxLF8pbl90WSDNmq8W2T/S0BmgAAALODiSyrNO1a90v6AtdIyZxl6LjKUHymlrt/w7JHTVCmChXFRiSADh9WyZ2WentlCEfhrTX6ncIr6a74bLY6r+UBmAT5uNLFt2vmL9svJAB7FOUlGK1beiNLi0rHojXH47vyzi9Jr35sW+0U5GgAAAAAAK+bQsjHlD83eL+pm3w9H3NYZzqVarzbEuze79wP/9k'
  },
  password: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: [validateMail, 'Please provide a valid eMail address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid eMail address']
  },
  loginAttempts: {
    type: Number,
    required: true,
    "default": 0
  },
  lockUntil: {
    type: Number
  }
});
var reasons = user.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};
user.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});
user.pre('save', function (next) {
  var thisUser = this;
  if (!thisUser.isModified('password')) return next();
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(thisUser.password, salt, function (err, hash) {
      if (err) return next(err);
      thisUser.password = hash;
      next();
    });
  });
});
/**
 * Saves the avatar after resizing it
 * @param {Buffer} avatar The image buffer
 */

user.methods.saveAvatar = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(avatar) {
    var newAvatar;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return sharp(avatar).resize(64, 64).toBuffer();

          case 2:
            newAvatar = _context.sent;
            this.avatar = newAvatar;

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

user.methods.comparePassword = function (pwd) {
  var userpwd = this.password;
  return new Promise(function (resolve, reject) {
    if (typeof pwd == 'undefined') {
      reject('Please provide password');
    }

    bcrypt.compare(pwd, userpwd, function (err, isMatch) {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

user.methods.incLoginAttempts = function () {
  return new Promise(function (resolve) {
    if (this.lockUntil && this.lockUntil < Date.now()) {
      return resolve(this.update({
        $set: {
          loginAttempts: 1
        },
        $unset: {
          lockUntil: 1
        }
      }));
    }

    var updates = {
      $inc: {
        loginAttempts: 1
      }
    };

    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
      updates.$set = {
        lockUntil: Date.now() + LOCK_TIME
      };
    }

    return resolve(this.update(updates));
  });
};

user.statics.getAuthenticated = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(username, password) {
    var _this = this;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              _this.findOne({
                username: username
              }, /*#__PURE__*/function () {
                var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err, thisUser) {
                  var compareResult, updates;
                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          if (!err) {
                            _context2.next = 2;
                            break;
                          }

                          return _context2.abrupt("return", handleError(reject, err));

                        case 2:
                          if (thisUser) {
                            _context2.next = 4;
                            break;
                          }

                          return _context2.abrupt("return", handleError(reject, reasons.NOT_FOUND));

                        case 4:
                          if (!thisUser.isLocked) {
                            _context2.next = 8;
                            break;
                          }

                          _context2.next = 7;
                          return thisUser.incLoginAttempts;

                        case 7:
                          return _context2.abrupt("return", handleError(reject, reasons.MAX_ATTEMPTS));

                        case 8:
                          if (password) {
                            _context2.next = 10;
                            break;
                          }

                          return _context2.abrupt("return", handleError(reject, 'Invalid password'));

                        case 10:
                          _context2.next = 12;
                          return thisUser.comparePassword(password);

                        case 12:
                          compareResult = _context2.sent;

                          if (!compareResult) {
                            _context2.next = 18;
                            break;
                          }

                          if (!(!thisUser.loginAttempts && !user.lockUntil)) {
                            _context2.next = 16;
                            break;
                          }

                          return _context2.abrupt("return", resolve(thisUser));

                        case 16:
                          updates = {
                            $set: {
                              loginAttempts: 0
                            },
                            $unset: {
                              lockUntil: 1
                            }
                          };
                          return _context2.abrupt("return", thisUser.update(updates, function (err) {
                            if (err) return reject(err);
                            return resolve(thisUser);
                          }));

                        case 18:
                          _context2.next = 20;
                          return thisUser.incLoginAttempts;

                        case 20:
                          return _context2.abrupt("return", handleError(reject, reasons.PASSWORD_INCORRECT));

                        case 21:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x4, _x5) {
                  return _ref3.apply(this, arguments);
                };
              }());
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

function handleError(reject, error) {
  if (error == 0) {
    reject('User not found');
  } else {
    reject(error);
  }
}

function validateMail(mail) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(mail);
}

module.exports = {
  user: mongoose.model('User', user)
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci5qcyJdLCJuYW1lcyI6WyJtb25nb29zZSIsInJlcXVpcmUiLCJiY3J5cHQiLCJzaGFycCIsIlNBTFRfRkFDVE9SIiwiTUFYX0xPR0lOX0FUVEVNUFRTIiwiTE9DS19USU1FIiwidXNlciIsIlNjaGVtYSIsInVzZXJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwiaW5kZXgiLCJ1bmlxdWUiLCJzZXR0aW5ncyIsImxhbmd1YWdlIiwiZGlzcGxheU5hbWUiLCJhdmF0YXIiLCJwYXNzd29yZCIsIm1haWwiLCJ0cmltIiwibG93ZXJjYXNlIiwidmFsaWRhdGUiLCJ2YWxpZGF0ZU1haWwiLCJtYXRjaCIsImxvZ2luQXR0ZW1wdHMiLCJOdW1iZXIiLCJsb2NrVW50aWwiLCJyZWFzb25zIiwic3RhdGljcyIsImZhaWxlZExvZ2luIiwiTk9UX0ZPVU5EIiwiUEFTU1dPUkRfSU5DT1JSRUNUIiwiTUFYX0FUVEVNUFRTIiwidmlydHVhbCIsImdldCIsIkRhdGUiLCJub3ciLCJwcmUiLCJuZXh0IiwidGhpc1VzZXIiLCJpc01vZGlmaWVkIiwiZ2VuU2FsdCIsImVyciIsInNhbHQiLCJoYXNoIiwibWV0aG9kcyIsInNhdmVBdmF0YXIiLCJyZXNpemUiLCJ0b0J1ZmZlciIsIm5ld0F2YXRhciIsImNvbXBhcmVQYXNzd29yZCIsInB3ZCIsInVzZXJwd2QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNvbXBhcmUiLCJpc01hdGNoIiwiaW5jTG9naW5BdHRlbXB0cyIsInVwZGF0ZSIsIiRzZXQiLCIkdW5zZXQiLCJ1cGRhdGVzIiwiJGluYyIsImlzTG9ja2VkIiwiZ2V0QXV0aGVudGljYXRlZCIsImZpbmRPbmUiLCJoYW5kbGVFcnJvciIsImNvbXBhcmVSZXN1bHQiLCJlcnJvciIsInJlIiwidGVzdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtb2RlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBLElBQUlB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Iiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tdXNlbGVzcy1lc2NhcGUgKi9cclxubGV0IG1vbmdvb3NlID0gcmVxdWlyZSgnbW9uZ29vc2UnKVxyXG5sZXQgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0anMnKVxyXG5sZXQgc2hhcnAgPSByZXF1aXJlKCdzaGFycCcpXHJcblxyXG5jb25zdCBTQUxUX0ZBQ1RPUiA9IDEwXHJcbmNvbnN0IE1BWF9MT0dJTl9BVFRFTVBUUyA9IDEwXHJcbmNvbnN0IExPQ0tfVElNRSA9IDIgKiA2MCAqIDYwICogMTAwMFxyXG5cclxubGV0IHVzZXIgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHR1c2VybmFtZToge1xyXG5cdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0cmVxdWlyZWQ6IHRydWUsXHJcblx0XHRpbmRleDoge1xyXG5cdFx0XHR1bmlxdWU6IHRydWUsXHJcblx0XHR9LFxyXG5cdH0sXHJcblx0c2V0dGluZ3M6IHtcclxuXHRcdGxhbmd1YWdlOiB7XHJcblx0XHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdFx0ZW51bTogWydlbicsICdkZSddLFxyXG5cdFx0XHRkZWZhdWx0OiAnZW4nLFxyXG5cdFx0fSxcclxuXHRcdGRpc3BsYXlOYW1lOiB7XHJcblx0XHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdH0sXHJcblx0fSxcclxuXHRhdmF0YXI6IHtcclxuXHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdCcvOWovMndCREFBWUVCUVlGQkFZR0JRWUhCd1lJQ2hBS0Nna0pDaFFPRHd3UUZ4UVlHQmNVRmhZYUhTVWZHaHNqSEJZV0lDd2dJeVluS1NvcEdSOHRNQzBvTUNVb0tTai8yd0JEQVFjSEJ3b0lDaE1LQ2hNb0doWWFLQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0NqL3dBQVJDQUJBQUVBREFTSUFBaEVCQXhFQi84UUFHZ0FCQUFNQkFRRUFBQUFBQUFBQUFBQUFBQU1FQmdVQkIvL0VBQ29RQUFJQ0FRTURBd0lIQUFBQUFBQUFBQUFCQWdNRUVSSWhCVEZSRXpKQllYRXpRbEtSb2NIaC84UUFGQUVCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUC9FQUJRUkFRQUFBQUFBQUFBQUFBQUFBQUFBQUFELzJnQU1Bd0VBQWhFREVRQS9BUHJZQUFBdFlPSExLaytkdGE3eU94VmdZMWEwVmFrL011UU02RFEyOVB4ckYrR29QekhnNDJaaXp4Yk5KY3hmdGw1QXJnQUFBQU5OaVZLbkdyZ3ZoYy9jbUk2SnF5bUUxMmxGTWtBRmJxTlN0eExGOHBibDkwV1NETm1xOFcyVC9TMEJtZ0FBQUxPRGlTeXJOTzFhOTB2NkF0ZEl5WnhsNkxqS1VIeW1scnQvdzdKSFRWQ21DaFhGUmlTQURoOVd5WjJXZW50bENFZmhyVFg2bmNJcjZhNzRiTFk2citVQm1BVDV1TkxGdDJ2bUw5c3ZKQUI3Rk9VbEdLMWJlaU5MaTBySG9qWEg0N3Z5emk5SnIzNXNXKzBVNUdnQUFBQUFBSytiUXNqSGxEODNlTCtwbTN3OUgzTllaenFWYXJ6YkV1emU3OXdQLzlrJyxcclxuXHR9LFxyXG5cdHBhc3N3b3JkOiB7XHJcblx0XHR0eXBlOiBTdHJpbmcsXHJcblx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHR9LFxyXG5cdG1haWw6IHtcclxuXHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdHJlcXVpcmVkOiB0cnVlLFxyXG5cdFx0dHJpbTogdHJ1ZSxcclxuXHRcdGxvd2VyY2FzZTogdHJ1ZSxcclxuXHRcdHZhbGlkYXRlOiBbdmFsaWRhdGVNYWlsLCAnUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBlTWFpbCBhZGRyZXNzJ10sXHJcblx0XHRtYXRjaDogW1xyXG5cdFx0XHQvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvLFxyXG5cdFx0XHQnUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBlTWFpbCBhZGRyZXNzJyxcclxuXHRcdF0sXHJcblx0fSxcclxuXHRsb2dpbkF0dGVtcHRzOiB7XHJcblx0XHR0eXBlOiBOdW1iZXIsXHJcblx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHRcdGRlZmF1bHQ6IDAsXHJcblx0fSxcclxuXHRsb2NrVW50aWw6IHtcclxuXHRcdHR5cGU6IE51bWJlcixcclxuXHR9LFxyXG59KVxyXG5cclxudmFyIHJlYXNvbnMgPSAodXNlci5zdGF0aWNzLmZhaWxlZExvZ2luID0ge1xyXG5cdE5PVF9GT1VORDogMCxcclxuXHRQQVNTV09SRF9JTkNPUlJFQ1Q6IDEsXHJcblx0TUFYX0FUVEVNUFRTOiAyLFxyXG59KVxyXG5cclxudXNlci52aXJ0dWFsKCdpc0xvY2tlZCcpLmdldChmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuICEhKHRoaXMubG9ja1VudGlsICYmIHRoaXMubG9ja1VudGlsID4gRGF0ZS5ub3coKSlcclxufSlcclxuXHJcbnVzZXIucHJlKCdzYXZlJywgZnVuY3Rpb24gKG5leHQpIHtcclxuXHR2YXIgdGhpc1VzZXIgPSB0aGlzXHJcblxyXG5cdGlmICghdGhpc1VzZXIuaXNNb2RpZmllZCgncGFzc3dvcmQnKSkgcmV0dXJuIG5leHQoKVxyXG5cdGJjcnlwdC5nZW5TYWx0KFNBTFRfRkFDVE9SLCBmdW5jdGlvbiAoZXJyLCBzYWx0KSB7XHJcblx0XHRpZiAoZXJyKSByZXR1cm4gbmV4dChlcnIpXHJcblx0XHRiY3J5cHQuaGFzaCh0aGlzVXNlci5wYXNzd29yZCwgc2FsdCwgZnVuY3Rpb24gKGVyciwgaGFzaCkge1xyXG5cdFx0XHRpZiAoZXJyKSByZXR1cm4gbmV4dChlcnIpXHJcblx0XHRcdHRoaXNVc2VyLnBhc3N3b3JkID0gaGFzaFxyXG5cdFx0XHRuZXh0KClcclxuXHRcdH0pXHJcblx0fSlcclxufSlcclxuXHJcbi8qKlxyXG4gKiBTYXZlcyB0aGUgYXZhdGFyIGFmdGVyIHJlc2l6aW5nIGl0XHJcbiAqIEBwYXJhbSB7QnVmZmVyfSBhdmF0YXIgVGhlIGltYWdlIGJ1ZmZlclxyXG4gKi9cclxudXNlci5tZXRob2RzLnNhdmVBdmF0YXIgPSBhc3luYyBmdW5jdGlvbiAoYXZhdGFyKSB7XHJcblx0bGV0IG5ld0F2YXRhciA9IGF3YWl0IHNoYXJwKGF2YXRhcikucmVzaXplKDY0LCA2NCkudG9CdWZmZXIoKVxyXG5cclxuXHR0aGlzLmF2YXRhciA9IG5ld0F2YXRhclxyXG59XHJcblxyXG51c2VyLm1ldGhvZHMuY29tcGFyZVBhc3N3b3JkID0gZnVuY3Rpb24gKHB3ZCkge1xyXG5cdGxldCB1c2VycHdkID0gdGhpcy5wYXNzd29yZFxyXG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRpZiAodHlwZW9mIHB3ZCA9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRyZWplY3QoJ1BsZWFzZSBwcm92aWRlIHBhc3N3b3JkJylcclxuXHRcdH1cclxuXHRcdGJjcnlwdC5jb21wYXJlKHB3ZCwgdXNlcnB3ZCwgZnVuY3Rpb24gKGVyciwgaXNNYXRjaCkge1xyXG5cdFx0XHRpZiAoZXJyKSB7XHJcblx0XHRcdFx0cmVqZWN0KGVycilcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXNvbHZlKGlzTWF0Y2gpXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fSlcclxufVxyXG5cclxudXNlci5tZXRob2RzLmluY0xvZ2luQXR0ZW1wdHMgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcblx0XHRpZiAodGhpcy5sb2NrVW50aWwgJiYgdGhpcy5sb2NrVW50aWwgPCBEYXRlLm5vdygpKSB7XHJcblx0XHRcdHJldHVybiByZXNvbHZlKFxyXG5cdFx0XHRcdHRoaXMudXBkYXRlKHtcclxuXHRcdFx0XHRcdCRzZXQ6IHsgbG9naW5BdHRlbXB0czogMSB9LFxyXG5cdFx0XHRcdFx0JHVuc2V0OiB7IGxvY2tVbnRpbDogMSB9LFxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdClcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdXBkYXRlcyA9IHsgJGluYzogeyBsb2dpbkF0dGVtcHRzOiAxIH0gfVxyXG5cdFx0aWYgKHRoaXMubG9naW5BdHRlbXB0cyArIDEgPj0gTUFYX0xPR0lOX0FUVEVNUFRTICYmICF0aGlzLmlzTG9ja2VkKSB7XHJcblx0XHRcdHVwZGF0ZXMuJHNldCA9IHsgbG9ja1VudGlsOiBEYXRlLm5vdygpICsgTE9DS19USU1FIH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmVzb2x2ZSh0aGlzLnVwZGF0ZSh1cGRhdGVzKSlcclxuXHR9KVxyXG59XHJcblxyXG51c2VyLnN0YXRpY3MuZ2V0QXV0aGVudGljYXRlZCA9IGFzeW5jIGZ1bmN0aW9uICh1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0dGhpcy5maW5kT25lKHsgdXNlcm5hbWU6IHVzZXJuYW1lIH0sIGFzeW5jIGZ1bmN0aW9uIChlcnIsIHRoaXNVc2VyKSB7XHJcblx0XHRcdGlmIChlcnIpIHJldHVybiBoYW5kbGVFcnJvcihyZWplY3QsIGVycilcclxuXHJcblx0XHRcdGlmICghdGhpc1VzZXIpIHJldHVybiBoYW5kbGVFcnJvcihyZWplY3QsIHJlYXNvbnMuTk9UX0ZPVU5EKVxyXG5cclxuXHRcdFx0aWYgKHRoaXNVc2VyLmlzTG9ja2VkKSB7XHJcblx0XHRcdFx0YXdhaXQgdGhpc1VzZXIuaW5jTG9naW5BdHRlbXB0c1xyXG5cdFx0XHRcdHJldHVybiBoYW5kbGVFcnJvcihyZWplY3QsIHJlYXNvbnMuTUFYX0FUVEVNUFRTKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXBhc3N3b3JkKSB7XHJcblx0XHRcdFx0cmV0dXJuIGhhbmRsZUVycm9yKHJlamVjdCwgJ0ludmFsaWQgcGFzc3dvcmQnKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgY29tcGFyZVJlc3VsdCA9IGF3YWl0IHRoaXNVc2VyLmNvbXBhcmVQYXNzd29yZChwYXNzd29yZClcclxuXHRcdFx0aWYgKGNvbXBhcmVSZXN1bHQpIHtcclxuXHRcdFx0XHRpZiAoIXRoaXNVc2VyLmxvZ2luQXR0ZW1wdHMgJiYgIXVzZXIubG9ja1VudGlsKSByZXR1cm4gcmVzb2x2ZSh0aGlzVXNlcilcclxuXHJcblx0XHRcdFx0dmFyIHVwZGF0ZXMgPSB7XHJcblx0XHRcdFx0XHQkc2V0OiB7IGxvZ2luQXR0ZW1wdHM6IDAgfSxcclxuXHRcdFx0XHRcdCR1bnNldDogeyBsb2NrVW50aWw6IDEgfSxcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzVXNlci51cGRhdGUodXBkYXRlcywgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzb2x2ZSh0aGlzVXNlcilcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhd2FpdCB0aGlzVXNlci5pbmNMb2dpbkF0dGVtcHRzXHJcblx0XHRcdHJldHVybiBoYW5kbGVFcnJvcihyZWplY3QsIHJlYXNvbnMuUEFTU1dPUkRfSU5DT1JSRUNUKVxyXG5cdFx0fSlcclxuXHR9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnJvcihyZWplY3QsIGVycm9yKSB7XHJcblx0aWYgKGVycm9yID09IDApIHtcclxuXHRcdHJlamVjdCgnVXNlciBub3QgZm91bmQnKVxyXG5cdH0gZWxzZSB7XHJcblx0XHRyZWplY3QoZXJyb3IpXHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZU1haWwobWFpbCkge1xyXG5cdHZhciByZSA9IC9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7MiwzfSkrJC9cclxuXHRyZXR1cm4gcmUudGVzdChtYWlsKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHsgdXNlcjogbW9uZ29vc2UubW9kZWwoJ1VzZXInLCB1c2VyKSB9XHJcbiJdfQ==