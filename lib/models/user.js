"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/* eslint-disable no-useless-escape */
var mongoose = require('mongoose');

var bcrypt = require('bcryptjs');

var sharp = require('sharp');

var SALT_FACTOR = 10;
var MAX_LOGIN_ATTEMPTS = 5;
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
    type: Number,
    "default": null
  }
});
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
  var _this = this;

  return new Promise(function (resolve, reject) {
    try {
      if (_this.lockUntil && _this.lockUntil < Date.now()) {
        return resolve(_this.update({
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

      if (_this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !_this.isLocked) {
        updates.$set = {
          lockUntil: Date.now() + LOCK_TIME
        };
      }

      return resolve(_this.update(updates));
    } catch (error) {
      reject(new Error(error.message));
    }
  });
};

user.statics.getAuthenticated = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(username, password) {
    var _this2 = this;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              _this2.findOne({
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

                          return _context2.abrupt("return", reject(new Error(err)));

                        case 2:
                          if (thisUser) {
                            _context2.next = 4;
                            break;
                          }

                          return _context2.abrupt("return", reject(new Error('User could not be found')));

                        case 4:
                          if (!thisUser.isLocked) {
                            _context2.next = 8;
                            break;
                          }

                          _context2.next = 7;
                          return thisUser.incLoginAttempts;

                        case 7:
                          return _context2.abrupt("return", reject(new Error('User is locked')));

                        case 8:
                          if (password) {
                            _context2.next = 10;
                            break;
                          }

                          return _context2.abrupt("return", reject(new Error('Password missing')));

                        case 10:
                          _context2.next = 12;
                          return thisUser.comparePassword(password);

                        case 12:
                          compareResult = _context2.sent;

                          if (!compareResult) {
                            _context2.next = 20;
                            break;
                          }

                          if (!(thisUser.isLocked && thisUser.lockUntil > Date.now())) {
                            _context2.next = 18;
                            break;
                          }

                          _context2.next = 17;
                          return thisUser.update({
                            $set: {
                              loginAttempts: 0
                            }
                          });

                        case 17:
                          return _context2.abrupt("return", reject(new Error('User is locked')));

                        case 18:
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

                        case 20:
                          _context2.next = 22;
                          return thisUser.incLoginAttempts();

                        case 22:
                          return _context2.abrupt("return", reject(new Error('Password incorrect')));

                        case 23:
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

function validateMail(mail) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(mail);
}

module.exports = {
  user: mongoose.model('User', user)
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci5qcyJdLCJuYW1lcyI6WyJtb25nb29zZSIsInJlcXVpcmUiLCJiY3J5cHQiLCJzaGFycCIsIlNBTFRfRkFDVE9SIiwiTUFYX0xPR0lOX0FUVEVNUFRTIiwiTE9DS19USU1FIiwidXNlciIsIlNjaGVtYSIsInVzZXJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwiaW5kZXgiLCJ1bmlxdWUiLCJzZXR0aW5ncyIsImxhbmd1YWdlIiwiZGlzcGxheU5hbWUiLCJhdmF0YXIiLCJwYXNzd29yZCIsIm1haWwiLCJ0cmltIiwibG93ZXJjYXNlIiwidmFsaWRhdGUiLCJ2YWxpZGF0ZU1haWwiLCJtYXRjaCIsImxvZ2luQXR0ZW1wdHMiLCJOdW1iZXIiLCJsb2NrVW50aWwiLCJ2aXJ0dWFsIiwiZ2V0IiwiRGF0ZSIsIm5vdyIsInByZSIsIm5leHQiLCJ0aGlzVXNlciIsImlzTW9kaWZpZWQiLCJnZW5TYWx0IiwiZXJyIiwic2FsdCIsImhhc2giLCJtZXRob2RzIiwic2F2ZUF2YXRhciIsInJlc2l6ZSIsInRvQnVmZmVyIiwibmV3QXZhdGFyIiwiY29tcGFyZVBhc3N3b3JkIiwicHdkIiwidXNlcnB3ZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29tcGFyZSIsImlzTWF0Y2giLCJpbmNMb2dpbkF0dGVtcHRzIiwidXBkYXRlIiwiJHNldCIsIiR1bnNldCIsInVwZGF0ZXMiLCIkaW5jIiwiaXNMb2NrZWQiLCJlcnJvciIsIkVycm9yIiwibWVzc2FnZSIsInN0YXRpY3MiLCJnZXRBdXRoZW50aWNhdGVkIiwiZmluZE9uZSIsImNvbXBhcmVSZXN1bHQiLCJyZSIsInRlc3QiLCJtb2R1bGUiLCJleHBvcnRzIiwibW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxVQUFELENBQXRCOztBQUNBLElBQUlDLE1BQU0sR0FBR0QsT0FBTyxDQUFDLFVB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bGUgbm8tdXNlbGVzcy1lc2NhcGUgKi9cclxubGV0IG1vbmdvb3NlID0gcmVxdWlyZSgnbW9uZ29vc2UnKVxyXG5sZXQgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0anMnKVxyXG5sZXQgc2hhcnAgPSByZXF1aXJlKCdzaGFycCcpXHJcblxyXG5jb25zdCBTQUxUX0ZBQ1RPUiA9IDEwXHJcbmNvbnN0IE1BWF9MT0dJTl9BVFRFTVBUUyA9IDVcclxuY29uc3QgTE9DS19USU1FID0gMiAqIDYwICogNjAgKiAxMDAwXHJcblxyXG5sZXQgdXNlciA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG5cdHVzZXJuYW1lOiB7XHJcblx0XHR0eXBlOiBTdHJpbmcsXHJcblx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHRcdGluZGV4OiB7XHJcblx0XHRcdHVuaXF1ZTogdHJ1ZSxcclxuXHRcdH0sXHJcblx0fSxcclxuXHRzZXR0aW5nczoge1xyXG5cdFx0bGFuZ3VhZ2U6IHtcclxuXHRcdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0XHRlbnVtOiBbJ2VuJywgJ2RlJ10sXHJcblx0XHRcdGRlZmF1bHQ6ICdlbicsXHJcblx0XHR9LFxyXG5cdFx0ZGlzcGxheU5hbWU6IHtcclxuXHRcdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0fSxcclxuXHR9LFxyXG5cdGF2YXRhcjoge1xyXG5cdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0Jy85ai8yd0JEQUFZRUJRWUZCQVlHQlFZSEJ3WUlDaEFLQ2drSkNoUU9Ed3dRRnhRWUdCY1VGaFlhSFNVZkdoc2pIQllXSUN3Z0l5WW5LU29wR1I4dE1DMG9NQ1VvS1NqLzJ3QkRBUWNIQndvSUNoTUtDaE1vR2hZYUtDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2ovd0FBUkNBQkFBRUFEQVNJQUFoRUJBeEVCLzhRQUdnQUJBQU1CQVFFQUFBQUFBQUFBQUFBQUFBTUVCZ1VCQi8vRUFDb1FBQUlDQVFNREF3SUhBQUFBQUFBQUFBQUJBZ01FRVJJaEJURlJFekpCWVhFelFsS1JvY0hoLzhRQUZBRUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFQL0VBQlFSQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUQvMmdBTUF3RUFBaEVERVFBL0FQcllBQUF0WU9ITEtrK2R0YTd5T3hWZ1kxYTBWYWsvTXVRTTZEUTI5UHhyRitHb1B6SGc0MlppenhiTkpjeGZ0bDVBcmdBQUFBTk5pVktuR3JndmhjL2NtSTZKcXltRTEybEZNa0FGYnFOU3R4TEY4cGJsOTBXU0RObXE4VzJUL1MwQm1nQUFBTE9EaVN5ck5PMWE5MHY2QXRkSXlaeGw2TGpLVUh5bWxydC93N0pIVFZDbUNoWEZSaVNBRGg5V3laMldlbnRsQ0VmaHJUWDZuY0lyNmE3NGJMWTZyK1VCbUFUNXVOTEZ0MnZtTDlzdkpBQjdGT1VsR0sxYmVpTkxpMHJIb2pYSDQ3dnl6aTlKcjM1c1crMFU1R2dBQUFBQUFLK2JRc2pIbEQ4M2VMK3BtM3c5SDNOWVp6cVZhcnpiRXV6ZTc5d1AvOWsnLFxyXG5cdH0sXHJcblx0cGFzc3dvcmQ6IHtcclxuXHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdHJlcXVpcmVkOiB0cnVlLFxyXG5cdH0sXHJcblx0bWFpbDoge1xyXG5cdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0cmVxdWlyZWQ6IHRydWUsXHJcblx0XHR0cmltOiB0cnVlLFxyXG5cdFx0bG93ZXJjYXNlOiB0cnVlLFxyXG5cdFx0dmFsaWRhdGU6IFt2YWxpZGF0ZU1haWwsICdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIGVNYWlsIGFkZHJlc3MnXSxcclxuXHRcdG1hdGNoOiBbXHJcblx0XHRcdC9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7MiwzfSkrJC8sXHJcblx0XHRcdCdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIGVNYWlsIGFkZHJlc3MnLFxyXG5cdFx0XSxcclxuXHR9LFxyXG5cdGxvZ2luQXR0ZW1wdHM6IHtcclxuXHRcdHR5cGU6IE51bWJlcixcclxuXHRcdHJlcXVpcmVkOiB0cnVlLFxyXG5cdFx0ZGVmYXVsdDogMCxcclxuXHR9LFxyXG5cdGxvY2tVbnRpbDoge1xyXG5cdFx0dHlwZTogTnVtYmVyLFxyXG5cdFx0ZGVmYXVsdDogbnVsbCxcclxuXHR9LFxyXG59KVxyXG5cclxudXNlci52aXJ0dWFsKCdpc0xvY2tlZCcpLmdldChmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuICEhKHRoaXMubG9ja1VudGlsICYmIHRoaXMubG9ja1VudGlsID4gRGF0ZS5ub3coKSlcclxufSlcclxuXHJcbnVzZXIucHJlKCdzYXZlJywgZnVuY3Rpb24gKG5leHQpIHtcclxuXHR2YXIgdGhpc1VzZXIgPSB0aGlzXHJcblxyXG5cdGlmICghdGhpc1VzZXIuaXNNb2RpZmllZCgncGFzc3dvcmQnKSkgcmV0dXJuIG5leHQoKVxyXG5cdGJjcnlwdC5nZW5TYWx0KFNBTFRfRkFDVE9SLCBmdW5jdGlvbiAoZXJyLCBzYWx0KSB7XHJcblx0XHRpZiAoZXJyKSByZXR1cm4gbmV4dChlcnIpXHJcblx0XHRiY3J5cHQuaGFzaCh0aGlzVXNlci5wYXNzd29yZCwgc2FsdCwgZnVuY3Rpb24gKGVyciwgaGFzaCkge1xyXG5cdFx0XHRpZiAoZXJyKSByZXR1cm4gbmV4dChlcnIpXHJcblx0XHRcdHRoaXNVc2VyLnBhc3N3b3JkID0gaGFzaFxyXG5cdFx0XHRuZXh0KClcclxuXHRcdH0pXHJcblx0fSlcclxufSlcclxuXHJcbi8qKlxyXG4gKiBTYXZlcyB0aGUgYXZhdGFyIGFmdGVyIHJlc2l6aW5nIGl0XHJcbiAqIEBwYXJhbSB7QnVmZmVyfSBhdmF0YXIgVGhlIGltYWdlIGJ1ZmZlclxyXG4gKi9cclxudXNlci5tZXRob2RzLnNhdmVBdmF0YXIgPSBhc3luYyBmdW5jdGlvbiAoYXZhdGFyKSB7XHJcblx0bGV0IG5ld0F2YXRhciA9IGF3YWl0IHNoYXJwKGF2YXRhcikucmVzaXplKDY0LCA2NCkudG9CdWZmZXIoKVxyXG5cclxuXHR0aGlzLmF2YXRhciA9IG5ld0F2YXRhclxyXG59XHJcblxyXG51c2VyLm1ldGhvZHMuY29tcGFyZVBhc3N3b3JkID0gZnVuY3Rpb24gKHB3ZCkge1xyXG5cdGxldCB1c2VycHdkID0gdGhpcy5wYXNzd29yZFxyXG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRpZiAodHlwZW9mIHB3ZCA9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRyZWplY3QoJ1BsZWFzZSBwcm92aWRlIHBhc3N3b3JkJylcclxuXHRcdH1cclxuXHRcdGJjcnlwdC5jb21wYXJlKHB3ZCwgdXNlcnB3ZCwgZnVuY3Rpb24gKGVyciwgaXNNYXRjaCkge1xyXG5cdFx0XHRpZiAoZXJyKSB7XHJcblx0XHRcdFx0cmVqZWN0KGVycilcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXNvbHZlKGlzTWF0Y2gpXHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fSlcclxufVxyXG5cclxudXNlci5tZXRob2RzLmluY0xvZ2luQXR0ZW1wdHMgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmICh0aGlzLmxvY2tVbnRpbCAmJiB0aGlzLmxvY2tVbnRpbCA8IERhdGUubm93KCkpIHtcclxuXHRcdFx0XHRyZXR1cm4gcmVzb2x2ZShcclxuXHRcdFx0XHRcdHRoaXMudXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0JHNldDogeyBsb2dpbkF0dGVtcHRzOiAxIH0sXHJcblx0XHRcdFx0XHRcdCR1bnNldDogeyBsb2NrVW50aWw6IDEgfSxcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0KVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgdXBkYXRlcyA9IHsgJGluYzogeyBsb2dpbkF0dGVtcHRzOiAxIH0gfVxyXG5cdFx0XHRpZiAodGhpcy5sb2dpbkF0dGVtcHRzICsgMSA+PSBNQVhfTE9HSU5fQVRURU1QVFMgJiYgIXRoaXMuaXNMb2NrZWQpIHtcclxuXHRcdFx0XHR1cGRhdGVzLiRzZXQgPSB7IGxvY2tVbnRpbDogRGF0ZS5ub3coKSArIExPQ0tfVElNRSB9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiByZXNvbHZlKHRoaXMudXBkYXRlKHVwZGF0ZXMpKVxyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0cmVqZWN0KG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKSlcclxuXHRcdH1cclxuXHR9KVxyXG59XHJcblxyXG51c2VyLnN0YXRpY3MuZ2V0QXV0aGVudGljYXRlZCA9IGFzeW5jIGZ1bmN0aW9uICh1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0dGhpcy5maW5kT25lKHsgdXNlcm5hbWU6IHVzZXJuYW1lIH0sIGFzeW5jIGZ1bmN0aW9uIChlcnIsIHRoaXNVc2VyKSB7XHJcblx0XHRcdGlmIChlcnIpIHJldHVybiByZWplY3QobmV3IEVycm9yKGVycikpXHJcblxyXG5cdFx0XHRpZiAoIXRoaXNVc2VyKSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ1VzZXIgY291bGQgbm90IGJlIGZvdW5kJykpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzVXNlci5pc0xvY2tlZCkge1xyXG5cdFx0XHRcdGF3YWl0IHRoaXNVc2VyLmluY0xvZ2luQXR0ZW1wdHNcclxuXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignVXNlciBpcyBsb2NrZWQnKSlcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCFwYXNzd29yZCkge1xyXG5cdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKCdQYXNzd29yZCBtaXNzaW5nJykpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBjb21wYXJlUmVzdWx0ID0gYXdhaXQgdGhpc1VzZXIuY29tcGFyZVBhc3N3b3JkKHBhc3N3b3JkKVxyXG5cdFx0XHRpZiAoY29tcGFyZVJlc3VsdCkge1xyXG5cdFx0XHRcdGlmICh0aGlzVXNlci5pc0xvY2tlZCAmJiB0aGlzVXNlci5sb2NrVW50aWwgPiBEYXRlLm5vdygpKSB7XHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzVXNlci51cGRhdGUoeyAkc2V0OiB7IGxvZ2luQXR0ZW1wdHM6IDAgfSB9KVxyXG5cdFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ1VzZXIgaXMgbG9ja2VkJykpXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgdXBkYXRlcyA9IHtcclxuXHRcdFx0XHRcdCRzZXQ6IHsgbG9naW5BdHRlbXB0czogMCB9LFxyXG5cdFx0XHRcdFx0JHVuc2V0OiB7IGxvY2tVbnRpbDogMSB9LFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXNVc2VyLnVwZGF0ZSh1cGRhdGVzLCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcclxuXHRcdFx0XHRcdHJldHVybiByZXNvbHZlKHRoaXNVc2VyKVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGF3YWl0IHRoaXNVc2VyLmluY0xvZ2luQXR0ZW1wdHMoKVxyXG5cdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignUGFzc3dvcmQgaW5jb3JyZWN0JykpXHJcblx0XHR9KVxyXG5cdH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlTWFpbChtYWlsKSB7XHJcblx0dmFyIHJlID0gL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskL1xyXG5cdHJldHVybiByZS50ZXN0KG1haWwpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0geyB1c2VyOiBtb25nb29zZS5tb2RlbCgnVXNlcicsIHVzZXIpIH1cclxuIl19