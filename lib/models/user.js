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
            _context.next = 5;
            return Buffer.from(newAvatar).toString('base64');

          case 5:
            this.avatar = _context.sent;
            console.log(this); //await this.save()
            //console.log('saved')

          case 7:
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

var handleE11000 = function handleE11000(error, res, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('User already exists'));
  } else {
    next();
  }
};

user.post('save', handleE11000);
user.post('update', handleE11000);
user.post('findOneAndUpdate', handleE11000);
user.post('insertMany', handleE11000);
module.exports = {
  user: mongoose.model('User', user)
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci5qcyJdLCJuYW1lcyI6WyJtb25nb29zZSIsInJlcXVpcmUiLCJiY3J5cHQiLCJzaGFycCIsIlNBTFRfRkFDVE9SIiwiTUFYX0xPR0lOX0FUVEVNUFRTIiwiTE9DS19USU1FIiwidXNlciIsIlNjaGVtYSIsInVzZXJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwiaW5kZXgiLCJ1bmlxdWUiLCJzZXR0aW5ncyIsImxhbmd1YWdlIiwiZGlzcGxheU5hbWUiLCJhdmF0YXIiLCJwYXNzd29yZCIsIm1haWwiLCJ0cmltIiwibG93ZXJjYXNlIiwidmFsaWRhdGUiLCJ2YWxpZGF0ZU1haWwiLCJtYXRjaCIsImxvZ2luQXR0ZW1wdHMiLCJOdW1iZXIiLCJsb2NrVW50aWwiLCJ2aXJ0dWFsIiwiZ2V0IiwiRGF0ZSIsIm5vdyIsInByZSIsIm5leHQiLCJ0aGlzVXNlciIsImlzTW9kaWZpZWQiLCJnZW5TYWx0IiwiZXJyIiwic2FsdCIsImhhc2giLCJtZXRob2RzIiwic2F2ZUF2YXRhciIsInJlc2l6ZSIsInRvQnVmZmVyIiwibmV3QXZhdGFyIiwiQnVmZmVyIiwiZnJvbSIsInRvU3RyaW5nIiwiY29uc29sZSIsImxvZyIsImNvbXBhcmVQYXNzd29yZCIsInB3ZCIsInVzZXJwd2QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNvbXBhcmUiLCJpc01hdGNoIiwiaW5jTG9naW5BdHRlbXB0cyIsInVwZGF0ZSIsIiRzZXQiLCIkdW5zZXQiLCJ1cGRhdGVzIiwiJGluYyIsImlzTG9ja2VkIiwiZXJyb3IiLCJFcnJvciIsIm1lc3NhZ2UiLCJzdGF0aWNzIiwiZ2V0QXV0aGVudGljYXRlZCIsImZpbmRPbmUiLCJjb21wYXJlUmVzdWx0IiwicmUiLCJ0ZXN0IiwiaGFuZGxlRTExMDAwIiwicmVzIiwibmFtZSIsImNvZGUiLCJwb3N0IiwibW9kdWxlIiwiZXhwb3J0cyIsIm1vZGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7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QTRCO0FBQzNCLE1BQUlxRCxFQUFFLEdBQUcsK0NBQVQ7QUFDQSxTQUFPQSxFQUFFLENBQUNDLElBQUgsQ0FBUXRELElBQVIsQ0FBUDtBQUNBOztBQUVELElBQUl1RCxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFVVCxLQUFWLEVBQWlCVSxHQUFqQixFQUFzQjFDLElBQXRCLEVBQTRCO0FBQzlDLE1BQUlnQyxLQUFLLENBQUNXLElBQU4sS0FBZSxZQUFmLElBQStCWCxLQUFLLENBQUNZLElBQU4sS0FBZSxLQUFsRCxFQUF5RDtBQUN4RDVDLElBQUFBLElBQUksQ0FBQyxJQUFJaUMsS0FBSixDQUFVLHFCQUFWLENBQUQsQ0FBSjtBQUNBLEdBRkQsTUFFTztBQUNOakMsSUFBQUEsSUFBSTtBQUNKO0FBQ0QsQ0FORDs7QUFRQTNCLElBQUksQ0FBQ3dFLElBQUwsQ0FBVSxNQUFWLEVBQWtCSixZQUFsQjtBQUNBcEUsSUFBSSxDQUFDd0UsSUFBTCxDQUFVLFFBQVYsRUFBb0JKLFlBQXBCO0FBQ0FwRSxJQUFJLENBQUN3RSxJQUFMLENBQVUsa0JBQVYsRUFBOEJKLFlBQTlCO0FBQ0FwRSxJQUFJLENBQUN3RSxJQUFMLENBQVUsWUFBVixFQUF3QkosWUFBeEI7QUFFQUssTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQUUxRSxFQUFBQSxJQUFJLEVBQUVQLFFBQVEsQ0FBQ2tGLEtBQVQsQ0FBZSxNQUFmLEVBQXVCM0UsSUFBdkI7QUFBUixDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZWxlc3MtZXNjYXBlICovXG5sZXQgbW9uZ29vc2UgPSByZXF1aXJlKCdtb25nb29zZScpXG5sZXQgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0anMnKVxubGV0IHNoYXJwID0gcmVxdWlyZSgnc2hhcnAnKVxuXG5jb25zdCBTQUxUX0ZBQ1RPUiA9IDEwXG5jb25zdCBNQVhfTE9HSU5fQVRURU1QVFMgPSA1XG5jb25zdCBMT0NLX1RJTUUgPSAyICogNjAgKiA2MCAqIDEwMDBcblxubGV0IHVzZXIgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcblx0dXNlcm5hbWU6IHtcblx0XHR0eXBlOiBTdHJpbmcsXG5cdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0aW5kZXg6IHtcblx0XHRcdHVuaXF1ZTogdHJ1ZSxcblx0XHR9LFxuXHR9LFxuXHRzZXR0aW5nczoge1xuXHRcdGxhbmd1YWdlOiB7XG5cdFx0XHR0eXBlOiBTdHJpbmcsXG5cdFx0XHRlbnVtOiBbJ2VuJywgJ2RlJ10sXG5cdFx0XHRkZWZhdWx0OiAnZW4nLFxuXHRcdH0sXG5cdFx0ZGlzcGxheU5hbWU6IHtcblx0XHRcdHR5cGU6IFN0cmluZyxcblx0XHR9LFxuXHR9LFxuXHRhdmF0YXI6IHtcblx0XHR0eXBlOiBTdHJpbmcsXG5cdFx0ZGVmYXVsdDpcblx0XHRcdCcvOWovMndCREFBWUVCUVlGQkFZR0JRWUhCd1lJQ2hBS0Nna0pDaFFPRHd3UUZ4UVlHQmNVRmhZYUhTVWZHaHNqSEJZV0lDd2dJeVluS1NvcEdSOHRNQzBvTUNVb0tTai8yd0JEQVFjSEJ3b0lDaE1LQ2hNb0doWWFLQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0NqL3dBQVJDQUJBQUVBREFTSUFBaEVCQXhFQi84UUFHZ0FCQUFNQkFRRUFBQUFBQUFBQUFBQUFBQU1FQmdVQkIvL0VBQ29RQUFJQ0FRTURBd0lIQUFBQUFBQUFBQUFCQWdNRUVSSWhCVEZSRXpKQllYRXpRbEtSb2NIaC84UUFGQUVCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUC9FQUJRUkFRQUFBQUFBQUFBQUFBQUFBQUFBQUFELzJnQU1Bd0VBQWhFREVRQS9BUHJZQUFBdFlPSExLaytkdGE3eU94VmdZMWEwVmFrL011UU02RFEyOVB4ckYrR29QekhnNDJaaXp4Yk5KY3hmdGw1QXJnQUFBQU5OaVZLbkdyZ3ZoYy9jbUk2SnF5bUUxMmxGTWtBRmJxTlN0eExGOHBibDkwV1NETm1xOFcyVC9TMEJtZ0FBQUxPRGlTeXJOTzFhOTB2NkF0ZEl5WnhsNkxqS1VIeW1scnQvdzdKSFRWQ21DaFhGUmlTQURoOVd5WjJXZW50bENFZmhyVFg2bmNJcjZhNzRiTFk2citVQm1BVDV1TkxGdDJ2bUw5c3ZKQUI3Rk9VbEdLMWJlaU5MaTBySG9qWEg0N3Z5emk5SnIzNXNXKzBVNUdnQUFBQUFBSytiUXNqSGxEODNlTCtwbTN3OUgzTllaenFWYXJ6YkV1emU3OXdQLzlrJyxcblx0fSxcblx0cGFzc3dvcmQ6IHtcblx0XHR0eXBlOiBTdHJpbmcsXG5cdFx0cmVxdWlyZWQ6IHRydWUsXG5cdH0sXG5cdG1haWw6IHtcblx0XHR0eXBlOiBTdHJpbmcsXG5cdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0dHJpbTogdHJ1ZSxcblx0XHRsb3dlcmNhc2U6IHRydWUsXG5cdFx0dmFsaWRhdGU6IFt2YWxpZGF0ZU1haWwsICdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIGVNYWlsIGFkZHJlc3MnXSxcblx0XHRtYXRjaDogW1xuXHRcdFx0L15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLyxcblx0XHRcdCdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIGVNYWlsIGFkZHJlc3MnLFxuXHRcdF0sXG5cdH0sXG5cdGxvZ2luQXR0ZW1wdHM6IHtcblx0XHR0eXBlOiBOdW1iZXIsXG5cdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0ZGVmYXVsdDogMCxcblx0fSxcblx0bG9ja1VudGlsOiB7XG5cdFx0dHlwZTogTnVtYmVyLFxuXHRcdGRlZmF1bHQ6IG51bGwsXG5cdH0sXG59KVxuXG51c2VyLnZpcnR1YWwoJ2lzTG9ja2VkJykuZ2V0KGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuICEhKHRoaXMubG9ja1VudGlsICYmIHRoaXMubG9ja1VudGlsID4gRGF0ZS5ub3coKSlcbn0pXG5cbnVzZXIucHJlKCdzYXZlJywgZnVuY3Rpb24gKG5leHQpIHtcblx0dmFyIHRoaXNVc2VyID0gdGhpc1xuXG5cdGlmICghdGhpc1VzZXIuaXNNb2RpZmllZCgncGFzc3dvcmQnKSkgcmV0dXJuIG5leHQoKVxuXHRiY3J5cHQuZ2VuU2FsdChTQUxUX0ZBQ1RPUiwgZnVuY3Rpb24gKGVyciwgc2FsdCkge1xuXHRcdGlmIChlcnIpIHJldHVybiBuZXh0KGVycilcblx0XHRiY3J5cHQuaGFzaCh0aGlzVXNlci5wYXNzd29yZCwgc2FsdCwgZnVuY3Rpb24gKGVyciwgaGFzaCkge1xuXHRcdFx0aWYgKGVycikgcmV0dXJuIG5leHQoZXJyKVxuXHRcdFx0dGhpc1VzZXIucGFzc3dvcmQgPSBoYXNoXG5cdFx0XHRuZXh0KClcblx0XHR9KVxuXHR9KVxufSlcblxuLyoqXG4gKiBTYXZlcyB0aGUgYXZhdGFyIGFmdGVyIHJlc2l6aW5nIGl0XG4gKiBAcGFyYW0ge0J1ZmZlcn0gYXZhdGFyIFRoZSBpbWFnZSBidWZmZXJcbiAqL1xudXNlci5tZXRob2RzLnNhdmVBdmF0YXIgPSBhc3luYyBmdW5jdGlvbiAoYXZhdGFyKSB7XG5cdGxldCBuZXdBdmF0YXIgPSBhd2FpdCBzaGFycChhdmF0YXIpLnJlc2l6ZSg2NCwgNjQpLnRvQnVmZmVyKClcblxuXHR0aGlzLmF2YXRhciA9IGF3YWl0IEJ1ZmZlci5mcm9tKG5ld0F2YXRhcikudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0Y29uc29sZS5sb2codGhpcylcblx0Ly9hd2FpdCB0aGlzLnNhdmUoKVxuXHQvL2NvbnNvbGUubG9nKCdzYXZlZCcpXG59XG5cbnVzZXIubWV0aG9kcy5jb21wYXJlUGFzc3dvcmQgPSBmdW5jdGlvbiAocHdkKSB7XG5cdGxldCB1c2VycHdkID0gdGhpcy5wYXNzd29yZFxuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdGlmICh0eXBlb2YgcHdkID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRyZWplY3QoJ1BsZWFzZSBwcm92aWRlIHBhc3N3b3JkJylcblx0XHR9XG5cdFx0YmNyeXB0LmNvbXBhcmUocHdkLCB1c2VycHdkLCBmdW5jdGlvbiAoZXJyLCBpc01hdGNoKSB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdHJlamVjdChlcnIpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXNvbHZlKGlzTWF0Y2gpXG5cdFx0XHR9XG5cdFx0fSlcblx0fSlcbn1cblxudXNlci5tZXRob2RzLmluY0xvZ2luQXR0ZW1wdHMgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICh0aGlzLmxvY2tVbnRpbCAmJiB0aGlzLmxvY2tVbnRpbCA8IERhdGUubm93KCkpIHtcblx0XHRcdFx0cmV0dXJuIHJlc29sdmUoXG5cdFx0XHRcdFx0dGhpcy51cGRhdGUoe1xuXHRcdFx0XHRcdFx0JHNldDogeyBsb2dpbkF0dGVtcHRzOiAxIH0sXG5cdFx0XHRcdFx0XHQkdW5zZXQ6IHsgbG9ja1VudGlsOiAxIH0sXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0KVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgdXBkYXRlcyA9IHsgJGluYzogeyBsb2dpbkF0dGVtcHRzOiAxIH0gfVxuXHRcdFx0aWYgKHRoaXMubG9naW5BdHRlbXB0cyArIDEgPj0gTUFYX0xPR0lOX0FUVEVNUFRTICYmICF0aGlzLmlzTG9ja2VkKSB7XG5cdFx0XHRcdHVwZGF0ZXMuJHNldCA9IHsgbG9ja1VudGlsOiBEYXRlLm5vdygpICsgTE9DS19USU1FIH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc29sdmUodGhpcy51cGRhdGUodXBkYXRlcykpXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHJlamVjdChuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSkpXG5cdFx0fVxuXHR9KVxufVxuXG51c2VyLnN0YXRpY3MuZ2V0QXV0aGVudGljYXRlZCA9IGFzeW5jIGZ1bmN0aW9uICh1c2VybmFtZSwgcGFzc3dvcmQpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHR0aGlzLmZpbmRPbmUoeyB1c2VybmFtZTogdXNlcm5hbWUgfSwgYXN5bmMgZnVuY3Rpb24gKGVyciwgdGhpc1VzZXIpIHtcblx0XHRcdGlmIChlcnIpIHJldHVybiByZWplY3QobmV3IEVycm9yKGVycikpXG5cblx0XHRcdGlmICghdGhpc1VzZXIpIHtcblx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ1VzZXIgY291bGQgbm90IGJlIGZvdW5kJykpXG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzVXNlci5pc0xvY2tlZCkge1xuXHRcdFx0XHRhd2FpdCB0aGlzVXNlci5pbmNMb2dpbkF0dGVtcHRzXG5cdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKCdVc2VyIGlzIGxvY2tlZCcpKVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXBhc3N3b3JkKSB7XG5cdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKCdQYXNzd29yZCBtaXNzaW5nJykpXG5cdFx0XHR9XG5cblx0XHRcdGxldCBjb21wYXJlUmVzdWx0ID0gYXdhaXQgdGhpc1VzZXIuY29tcGFyZVBhc3N3b3JkKHBhc3N3b3JkKVxuXHRcdFx0aWYgKGNvbXBhcmVSZXN1bHQpIHtcblx0XHRcdFx0aWYgKHRoaXNVc2VyLmlzTG9ja2VkICYmIHRoaXNVc2VyLmxvY2tVbnRpbCA+IERhdGUubm93KCkpIHtcblx0XHRcdFx0XHRhd2FpdCB0aGlzVXNlci51cGRhdGUoeyAkc2V0OiB7IGxvZ2luQXR0ZW1wdHM6IDAgfSB9KVxuXHRcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKCdVc2VyIGlzIGxvY2tlZCcpKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHVwZGF0ZXMgPSB7XG5cdFx0XHRcdFx0JHNldDogeyBsb2dpbkF0dGVtcHRzOiAwIH0sXG5cdFx0XHRcdFx0JHVuc2V0OiB7IGxvY2tVbnRpbDogMSB9LFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRoaXNVc2VyLnVwZGF0ZSh1cGRhdGVzLCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0aWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG5cdFx0XHRcdFx0cmV0dXJuIHJlc29sdmUodGhpc1VzZXIpXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IHRoaXNVc2VyLmluY0xvZ2luQXR0ZW1wdHMoKVxuXHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ1Bhc3N3b3JkIGluY29ycmVjdCcpKVxuXHRcdH0pXG5cdH0pXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTWFpbChtYWlsKSB7XG5cdHZhciByZSA9IC9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7MiwzfSkrJC9cblx0cmV0dXJuIHJlLnRlc3QobWFpbClcbn1cblxudmFyIGhhbmRsZUUxMTAwMCA9IGZ1bmN0aW9uIChlcnJvciwgcmVzLCBuZXh0KSB7XG5cdGlmIChlcnJvci5uYW1lID09PSAnTW9uZ29FcnJvcicgJiYgZXJyb3IuY29kZSA9PT0gMTEwMDApIHtcblx0XHRuZXh0KG5ldyBFcnJvcignVXNlciBhbHJlYWR5IGV4aXN0cycpKVxuXHR9IGVsc2Uge1xuXHRcdG5leHQoKVxuXHR9XG59XG5cbnVzZXIucG9zdCgnc2F2ZScsIGhhbmRsZUUxMTAwMClcbnVzZXIucG9zdCgndXBkYXRlJywgaGFuZGxlRTExMDAwKVxudXNlci5wb3N0KCdmaW5kT25lQW5kVXBkYXRlJywgaGFuZGxlRTExMDAwKVxudXNlci5wb3N0KCdpbnNlcnRNYW55JywgaGFuZGxlRTExMDAwKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgdXNlcjogbW9uZ29vc2UubW9kZWwoJ1VzZXInLCB1c2VyKSB9XG4iXX0=