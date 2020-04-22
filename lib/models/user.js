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
                            return resolve(new Error(thisUser));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci5qcyJdLCJuYW1lcyI6WyJtb25nb29zZSIsInJlcXVpcmUiLCJiY3J5cHQiLCJzaGFycCIsIlNBTFRfRkFDVE9SIiwiTUFYX0xPR0lOX0FUVEVNUFRTIiwiTE9DS19USU1FIiwidXNlciIsIlNjaGVtYSIsInVzZXJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwiaW5kZXgiLCJ1bmlxdWUiLCJzZXR0aW5ncyIsImxhbmd1YWdlIiwiZGlzcGxheU5hbWUiLCJhdmF0YXIiLCJwYXNzd29yZCIsIm1haWwiLCJ0cmltIiwibG93ZXJjYXNlIiwidmFsaWRhdGUiLCJ2YWxpZGF0ZU1haWwiLCJtYXRjaCIsImxvZ2luQXR0ZW1wdHMiLCJOdW1iZXIiLCJsb2NrVW50aWwiLCJ2aXJ0dWFsIiwiZ2V0IiwiRGF0ZSIsIm5vdyIsInByZSIsIm5leHQiLCJ0aGlzVXNlciIsImlzTW9kaWZpZWQiLCJnZW5TYWx0IiwiZXJyIiwic2FsdCIsImhhc2giLCJtZXRob2RzIiwic2F2ZUF2YXRhciIsInJlc2l6ZSIsInRvQnVmZmVyIiwibmV3QXZhdGFyIiwiY29tcGFyZVBhc3N3b3JkIiwicHdkIiwidXNlcnB3ZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29tcGFyZSIsImlzTWF0Y2giLCJpbmNMb2dpbkF0dGVtcHRzIiwidXBkYXRlIiwiJHNldCIsIiR1bnNldCIsInVwZGF0ZXMiLCIkaW5jIiwiaXNMb2NrZWQiLCJlcnJvciIsIkVycm9yIiwibWVzc2FnZSIsInN0YXRpY3MiLCJnZXRBdXRoZW50aWNhdGVkIiwiZmluZE9uZSIsImNvbXBhcmVSZXN1bHQiLCJyZSIsInRlc3QiLCJtb2R1bGUiLCJleHBvcnRzIiwibW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxVQUFELENBQXRCOztBQUNBLElBQUlDLE1BQU0sR0FBR0QsT0FBTyxDQUFDLFVB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ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZWxlc3MtZXNjYXBlICovXHJcbmxldCBtb25nb29zZSA9IHJlcXVpcmUoJ21vbmdvb3NlJylcclxubGV0IGJjcnlwdCA9IHJlcXVpcmUoJ2JjcnlwdGpzJylcclxubGV0IHNoYXJwID0gcmVxdWlyZSgnc2hhcnAnKVxyXG5cclxuY29uc3QgU0FMVF9GQUNUT1IgPSAxMFxyXG5jb25zdCBNQVhfTE9HSU5fQVRURU1QVFMgPSA1XHJcbmNvbnN0IExPQ0tfVElNRSA9IDIgKiA2MCAqIDYwICogMTAwMFxyXG5cclxubGV0IHVzZXIgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHR1c2VybmFtZToge1xyXG5cdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0cmVxdWlyZWQ6IHRydWUsXHJcblx0XHRpbmRleDoge1xyXG5cdFx0XHR1bmlxdWU6IHRydWUsXHJcblx0XHR9LFxyXG5cdH0sXHJcblx0c2V0dGluZ3M6IHtcclxuXHRcdGxhbmd1YWdlOiB7XHJcblx0XHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdFx0ZW51bTogWydlbicsICdkZSddLFxyXG5cdFx0XHRkZWZhdWx0OiAnZW4nLFxyXG5cdFx0fSxcclxuXHRcdGRpc3BsYXlOYW1lOiB7XHJcblx0XHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdH0sXHJcblx0fSxcclxuXHRhdmF0YXI6IHtcclxuXHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdCcvOWovMndCREFBWUVCUVlGQkFZR0JRWUhCd1lJQ2hBS0Nna0pDaFFPRHd3UUZ4UVlHQmNVRmhZYUhTVWZHaHNqSEJZV0lDd2dJeVluS1NvcEdSOHRNQzBvTUNVb0tTai8yd0JEQVFjSEJ3b0lDaE1LQ2hNb0doWWFLQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0NqL3dBQVJDQUJBQUVBREFTSUFBaEVCQXhFQi84UUFHZ0FCQUFNQkFRRUFBQUFBQUFBQUFBQUFBQU1FQmdVQkIvL0VBQ29RQUFJQ0FRTURBd0lIQUFBQUFBQUFBQUFCQWdNRUVSSWhCVEZSRXpKQllYRXpRbEtSb2NIaC84UUFGQUVCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUC9FQUJRUkFRQUFBQUFBQUFBQUFBQUFBQUFBQUFELzJnQU1Bd0VBQWhFREVRQS9BUHJZQUFBdFlPSExLaytkdGE3eU94VmdZMWEwVmFrL011UU02RFEyOVB4ckYrR29QekhnNDJaaXp4Yk5KY3hmdGw1QXJnQUFBQU5OaVZLbkdyZ3ZoYy9jbUk2SnF5bUUxMmxGTWtBRmJxTlN0eExGOHBibDkwV1NETm1xOFcyVC9TMEJtZ0FBQUxPRGlTeXJOTzFhOTB2NkF0ZEl5WnhsNkxqS1VIeW1scnQvdzdKSFRWQ21DaFhGUmlTQURoOVd5WjJXZW50bENFZmhyVFg2bmNJcjZhNzRiTFk2citVQm1BVDV1TkxGdDJ2bUw5c3ZKQUI3Rk9VbEdLMWJlaU5MaTBySG9qWEg0N3Z5emk5SnIzNXNXKzBVNUdnQUFBQUFBSytiUXNqSGxEODNlTCtwbTN3OUgzTllaenFWYXJ6YkV1emU3OXdQLzlrJyxcclxuXHR9LFxyXG5cdHBhc3N3b3JkOiB7XHJcblx0XHR0eXBlOiBTdHJpbmcsXHJcblx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHR9LFxyXG5cdG1haWw6IHtcclxuXHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdHJlcXVpcmVkOiB0cnVlLFxyXG5cdFx0dHJpbTogdHJ1ZSxcclxuXHRcdGxvd2VyY2FzZTogdHJ1ZSxcclxuXHRcdHZhbGlkYXRlOiBbdmFsaWRhdGVNYWlsLCAnUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBlTWFpbCBhZGRyZXNzJ10sXHJcblx0XHRtYXRjaDogW1xyXG5cdFx0XHQvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvLFxyXG5cdFx0XHQnUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBlTWFpbCBhZGRyZXNzJyxcclxuXHRcdF0sXHJcblx0fSxcclxuXHRsb2dpbkF0dGVtcHRzOiB7XHJcblx0XHR0eXBlOiBOdW1iZXIsXHJcblx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHRcdGRlZmF1bHQ6IDAsXHJcblx0fSxcclxuXHRsb2NrVW50aWw6IHtcclxuXHRcdHR5cGU6IE51bWJlcixcclxuXHRcdGRlZmF1bHQ6IG51bGwsXHJcblx0fSxcclxufSlcclxuXHJcbnVzZXIudmlydHVhbCgnaXNMb2NrZWQnKS5nZXQoZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiAhISh0aGlzLmxvY2tVbnRpbCAmJiB0aGlzLmxvY2tVbnRpbCA+IERhdGUubm93KCkpXHJcbn0pXHJcblxyXG51c2VyLnByZSgnc2F2ZScsIGZ1bmN0aW9uIChuZXh0KSB7XHJcblx0dmFyIHRoaXNVc2VyID0gdGhpc1xyXG5cclxuXHRpZiAoIXRoaXNVc2VyLmlzTW9kaWZpZWQoJ3Bhc3N3b3JkJykpIHJldHVybiBuZXh0KClcclxuXHRiY3J5cHQuZ2VuU2FsdChTQUxUX0ZBQ1RPUiwgZnVuY3Rpb24gKGVyciwgc2FsdCkge1xyXG5cdFx0aWYgKGVycikgcmV0dXJuIG5leHQoZXJyKVxyXG5cdFx0YmNyeXB0Lmhhc2godGhpc1VzZXIucGFzc3dvcmQsIHNhbHQsIGZ1bmN0aW9uIChlcnIsIGhhc2gpIHtcclxuXHRcdFx0aWYgKGVycikgcmV0dXJuIG5leHQoZXJyKVxyXG5cdFx0XHR0aGlzVXNlci5wYXNzd29yZCA9IGhhc2hcclxuXHRcdFx0bmV4dCgpXHJcblx0XHR9KVxyXG5cdH0pXHJcbn0pXHJcblxyXG4vKipcclxuICogU2F2ZXMgdGhlIGF2YXRhciBhZnRlciByZXNpemluZyBpdFxyXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYXZhdGFyIFRoZSBpbWFnZSBidWZmZXJcclxuICovXHJcbnVzZXIubWV0aG9kcy5zYXZlQXZhdGFyID0gYXN5bmMgZnVuY3Rpb24gKGF2YXRhcikge1xyXG5cdGxldCBuZXdBdmF0YXIgPSBhd2FpdCBzaGFycChhdmF0YXIpLnJlc2l6ZSg2NCwgNjQpLnRvQnVmZmVyKClcclxuXHJcblx0dGhpcy5hdmF0YXIgPSBuZXdBdmF0YXJcclxufVxyXG5cclxudXNlci5tZXRob2RzLmNvbXBhcmVQYXNzd29yZCA9IGZ1bmN0aW9uIChwd2QpIHtcclxuXHRsZXQgdXNlcnB3ZCA9IHRoaXMucGFzc3dvcmRcclxuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0aWYgKHR5cGVvZiBwd2QgPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmVqZWN0KCdQbGVhc2UgcHJvdmlkZSBwYXNzd29yZCcpXHJcblx0XHR9XHJcblx0XHRiY3J5cHQuY29tcGFyZShwd2QsIHVzZXJwd2QsIGZ1bmN0aW9uIChlcnIsIGlzTWF0Y2gpIHtcclxuXHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdHJlamVjdChlcnIpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzb2x2ZShpc01hdGNoKVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH0pXHJcbn1cclxuXHJcbnVzZXIubWV0aG9kcy5pbmNMb2dpbkF0dGVtcHRzID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpZiAodGhpcy5sb2NrVW50aWwgJiYgdGhpcy5sb2NrVW50aWwgPCBEYXRlLm5vdygpKSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlc29sdmUoXHJcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHsgbG9naW5BdHRlbXB0czogMSB9LFxyXG5cdFx0XHRcdFx0XHQkdW5zZXQ6IHsgbG9ja1VudGlsOiAxIH0sXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdClcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHVwZGF0ZXMgPSB7ICRpbmM6IHsgbG9naW5BdHRlbXB0czogMSB9IH1cclxuXHRcdFx0aWYgKHRoaXMubG9naW5BdHRlbXB0cyArIDEgPj0gTUFYX0xPR0lOX0FUVEVNUFRTICYmICF0aGlzLmlzTG9ja2VkKSB7XHJcblx0XHRcdFx0dXBkYXRlcy4kc2V0ID0geyBsb2NrVW50aWw6IERhdGUubm93KCkgKyBMT0NLX1RJTUUgfVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gcmVzb2x2ZSh0aGlzLnVwZGF0ZSh1cGRhdGVzKSlcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdHJlamVjdChuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSkpXHJcblx0XHR9XHJcblx0fSlcclxufVxyXG5cclxudXNlci5zdGF0aWNzLmdldEF1dGhlbnRpY2F0ZWQgPSBhc3luYyBmdW5jdGlvbiAodXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdHRoaXMuZmluZE9uZSh7IHVzZXJuYW1lOiB1c2VybmFtZSB9LCBhc3luYyBmdW5jdGlvbiAoZXJyLCB0aGlzVXNlcikge1xyXG5cdFx0XHRpZiAoZXJyKSByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihlcnIpKVxyXG5cclxuXHRcdFx0aWYgKCF0aGlzVXNlcikge1xyXG5cdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKCdVc2VyIGNvdWxkIG5vdCBiZSBmb3VuZCcpKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpc1VzZXIuaXNMb2NrZWQpIHtcclxuXHRcdFx0XHRhd2FpdCB0aGlzVXNlci5pbmNMb2dpbkF0dGVtcHRzXHJcblx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ1VzZXIgaXMgbG9ja2VkJykpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghcGFzc3dvcmQpIHtcclxuXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignUGFzc3dvcmQgbWlzc2luZycpKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgY29tcGFyZVJlc3VsdCA9IGF3YWl0IHRoaXNVc2VyLmNvbXBhcmVQYXNzd29yZChwYXNzd29yZClcclxuXHRcdFx0aWYgKGNvbXBhcmVSZXN1bHQpIHtcclxuXHRcdFx0XHRpZiAodGhpc1VzZXIuaXNMb2NrZWQgJiYgdGhpc1VzZXIubG9ja1VudGlsID4gRGF0ZS5ub3coKSkge1xyXG5cdFx0XHRcdFx0YXdhaXQgdGhpc1VzZXIudXBkYXRlKHsgJHNldDogeyBsb2dpbkF0dGVtcHRzOiAwIH0gfSlcclxuXHRcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKCdVc2VyIGlzIGxvY2tlZCcpKVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIHVwZGF0ZXMgPSB7XHJcblx0XHRcdFx0XHQkc2V0OiB7IGxvZ2luQXR0ZW1wdHM6IDAgfSxcclxuXHRcdFx0XHRcdCR1bnNldDogeyBsb2NrVW50aWw6IDEgfSxcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzVXNlci51cGRhdGUodXBkYXRlcywgZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0aWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzb2x2ZShuZXcgRXJyb3IodGhpc1VzZXIpKVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGF3YWl0IHRoaXNVc2VyLmluY0xvZ2luQXR0ZW1wdHMoKVxyXG5cdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignUGFzc3dvcmQgaW5jb3JyZWN0JykpXHJcblx0XHR9KVxyXG5cdH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlTWFpbChtYWlsKSB7XHJcblx0dmFyIHJlID0gL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskL1xyXG5cdHJldHVybiByZS50ZXN0KG1haWwpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0geyB1c2VyOiBtb25nb29zZS5tb2RlbCgnVXNlcicsIHVzZXIpIH1cclxuIl19