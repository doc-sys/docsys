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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci5qcyJdLCJuYW1lcyI6WyJtb25nb29zZSIsInJlcXVpcmUiLCJiY3J5cHQiLCJzaGFycCIsIlNBTFRfRkFDVE9SIiwiTUFYX0xPR0lOX0FUVEVNUFRTIiwiTE9DS19USU1FIiwidXNlciIsIlNjaGVtYSIsInVzZXJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwiaW5kZXgiLCJ1bmlxdWUiLCJzZXR0aW5ncyIsImxhbmd1YWdlIiwiZGlzcGxheU5hbWUiLCJhdmF0YXIiLCJwYXNzd29yZCIsIm1haWwiLCJ0cmltIiwibG93ZXJjYXNlIiwidmFsaWRhdGUiLCJ2YWxpZGF0ZU1haWwiLCJtYXRjaCIsImxvZ2luQXR0ZW1wdHMiLCJOdW1iZXIiLCJsb2NrVW50aWwiLCJ2aXJ0dWFsIiwiZ2V0IiwiRGF0ZSIsIm5vdyIsInByZSIsIm5leHQiLCJ0aGlzVXNlciIsImlzTW9kaWZpZWQiLCJnZW5TYWx0IiwiZXJyIiwic2FsdCIsImhhc2giLCJtZXRob2RzIiwic2F2ZUF2YXRhciIsInJlc2l6ZSIsInRvQnVmZmVyIiwibmV3QXZhdGFyIiwiQnVmZmVyIiwiZnJvbSIsInRvU3RyaW5nIiwiY29uc29sZSIsImxvZyIsImNvbXBhcmVQYXNzd29yZCIsInB3ZCIsInVzZXJwd2QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNvbXBhcmUiLCJpc01hdGNoIiwiaW5jTG9naW5BdHRlbXB0cyIsInVwZGF0ZSIsIiRzZXQiLCIkdW5zZXQiLCJ1cGRhdGVzIiwiJGluYyIsImlzTG9ja2VkIiwiZXJyb3IiLCJFcnJvciIsIm1lc3NhZ2UiLCJzdGF0aWNzIiwiZ2V0QXV0aGVudGljYXRlZCIsImZpbmRPbmUiLCJjb21wYXJlUmVzdWx0IiwicmUiLCJ0ZXN0IiwiaGFuZGxlRTExMDAwIiwicmVzIiwibmFtZSIsImNvZGUiLCJwb3N0IiwibW9kdWxlIiwiZXhwb3J0cyIsIm1vZGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7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QTRCO0FBQzNCLE1BQUlxRCxFQUFFLEdBQUcsK0NBQVQ7QUFDQSxTQUFPQSxFQUFFLENBQUNDLElBQUgsQ0FBUXRELElBQVIsQ0FBUDtBQUNBOztBQUVELElBQUl1RCxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFVVCxLQUFWLEVBQWlCVSxHQUFqQixFQUFzQjFDLElBQXRCLEVBQTRCO0FBQzlDLE1BQUlnQyxLQUFLLENBQUNXLElBQU4sS0FBZSxZQUFmLElBQStCWCxLQUFLLENBQUNZLElBQU4sS0FBZSxLQUFsRCxFQUF5RDtBQUN4RDVDLElBQUFBLElBQUksQ0FBQyxJQUFJaUMsS0FBSixDQUFVLHFCQUFWLENBQUQsQ0FBSjtBQUNBLEdBRkQsTUFFTztBQUNOakMsSUFBQUEsSUFBSTtBQUNKO0FBQ0QsQ0FORDs7QUFRQTNCLElBQUksQ0FBQ3dFLElBQUwsQ0FBVSxNQUFWLEVBQWtCSixZQUFsQjtBQUNBcEUsSUFBSSxDQUFDd0UsSUFBTCxDQUFVLFFBQVYsRUFBb0JKLFlBQXBCO0FBQ0FwRSxJQUFJLENBQUN3RSxJQUFMLENBQVUsa0JBQVYsRUFBOEJKLFlBQTlCO0FBQ0FwRSxJQUFJLENBQUN3RSxJQUFMLENBQVUsWUFBVixFQUF3QkosWUFBeEI7QUFFQUssTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQUUxRSxFQUFBQSxJQUFJLEVBQUVQLFFBQVEsQ0FBQ2tGLEtBQVQsQ0FBZSxNQUFmLEVBQXVCM0UsSUFBdkI7QUFBUixDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZWxlc3MtZXNjYXBlICovXHJcbmxldCBtb25nb29zZSA9IHJlcXVpcmUoJ21vbmdvb3NlJylcclxubGV0IGJjcnlwdCA9IHJlcXVpcmUoJ2JjcnlwdGpzJylcclxubGV0IHNoYXJwID0gcmVxdWlyZSgnc2hhcnAnKVxyXG5cclxuY29uc3QgU0FMVF9GQUNUT1IgPSAxMFxyXG5jb25zdCBNQVhfTE9HSU5fQVRURU1QVFMgPSA1XHJcbmNvbnN0IExPQ0tfVElNRSA9IDIgKiA2MCAqIDYwICogMTAwMFxyXG5cclxubGV0IHVzZXIgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuXHR1c2VybmFtZToge1xyXG5cdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0cmVxdWlyZWQ6IHRydWUsXHJcblx0XHRpbmRleDoge1xyXG5cdFx0XHR1bmlxdWU6IHRydWUsXHJcblx0XHR9LFxyXG5cdH0sXHJcblx0c2V0dGluZ3M6IHtcclxuXHRcdGxhbmd1YWdlOiB7XHJcblx0XHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdFx0ZW51bTogWydlbicsICdkZSddLFxyXG5cdFx0XHRkZWZhdWx0OiAnZW4nLFxyXG5cdFx0fSxcclxuXHRcdGRpc3BsYXlOYW1lOiB7XHJcblx0XHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdH0sXHJcblx0fSxcclxuXHRhdmF0YXI6IHtcclxuXHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdCcvOWovMndCREFBWUVCUVlGQkFZR0JRWUhCd1lJQ2hBS0Nna0pDaFFPRHd3UUZ4UVlHQmNVRmhZYUhTVWZHaHNqSEJZV0lDd2dJeVluS1NvcEdSOHRNQzBvTUNVb0tTai8yd0JEQVFjSEJ3b0lDaE1LQ2hNb0doWWFLQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0Nnb0tDZ29LQ2dvS0NqL3dBQVJDQUJBQUVBREFTSUFBaEVCQXhFQi84UUFHZ0FCQUFNQkFRRUFBQUFBQUFBQUFBQUFBQU1FQmdVQkIvL0VBQ29RQUFJQ0FRTURBd0lIQUFBQUFBQUFBQUFCQWdNRUVSSWhCVEZSRXpKQllYRXpRbEtSb2NIaC84UUFGQUVCQUFBQUFBQUFBQUFBQUFBQUFBQUFBUC9FQUJRUkFRQUFBQUFBQUFBQUFBQUFBQUFBQUFELzJnQU1Bd0VBQWhFREVRQS9BUHJZQUFBdFlPSExLaytkdGE3eU94VmdZMWEwVmFrL011UU02RFEyOVB4ckYrR29QekhnNDJaaXp4Yk5KY3hmdGw1QXJnQUFBQU5OaVZLbkdyZ3ZoYy9jbUk2SnF5bUUxMmxGTWtBRmJxTlN0eExGOHBibDkwV1NETm1xOFcyVC9TMEJtZ0FBQUxPRGlTeXJOTzFhOTB2NkF0ZEl5WnhsNkxqS1VIeW1scnQvdzdKSFRWQ21DaFhGUmlTQURoOVd5WjJXZW50bENFZmhyVFg2bmNJcjZhNzRiTFk2citVQm1BVDV1TkxGdDJ2bUw5c3ZKQUI3Rk9VbEdLMWJlaU5MaTBySG9qWEg0N3Z5emk5SnIzNXNXKzBVNUdnQUFBQUFBSytiUXNqSGxEODNlTCtwbTN3OUgzTllaenFWYXJ6YkV1emU3OXdQLzlrJyxcclxuXHR9LFxyXG5cdHBhc3N3b3JkOiB7XHJcblx0XHR0eXBlOiBTdHJpbmcsXHJcblx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHR9LFxyXG5cdG1haWw6IHtcclxuXHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdHJlcXVpcmVkOiB0cnVlLFxyXG5cdFx0dHJpbTogdHJ1ZSxcclxuXHRcdGxvd2VyY2FzZTogdHJ1ZSxcclxuXHRcdHZhbGlkYXRlOiBbdmFsaWRhdGVNYWlsLCAnUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBlTWFpbCBhZGRyZXNzJ10sXHJcblx0XHRtYXRjaDogW1xyXG5cdFx0XHQvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvLFxyXG5cdFx0XHQnUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBlTWFpbCBhZGRyZXNzJyxcclxuXHRcdF0sXHJcblx0fSxcclxuXHRsb2dpbkF0dGVtcHRzOiB7XHJcblx0XHR0eXBlOiBOdW1iZXIsXHJcblx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHRcdGRlZmF1bHQ6IDAsXHJcblx0fSxcclxuXHRsb2NrVW50aWw6IHtcclxuXHRcdHR5cGU6IE51bWJlcixcclxuXHRcdGRlZmF1bHQ6IG51bGwsXHJcblx0fSxcclxufSlcclxuXHJcbnVzZXIudmlydHVhbCgnaXNMb2NrZWQnKS5nZXQoZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiAhISh0aGlzLmxvY2tVbnRpbCAmJiB0aGlzLmxvY2tVbnRpbCA+IERhdGUubm93KCkpXHJcbn0pXHJcblxyXG51c2VyLnByZSgnc2F2ZScsIGZ1bmN0aW9uIChuZXh0KSB7XHJcblx0dmFyIHRoaXNVc2VyID0gdGhpc1xyXG5cclxuXHRpZiAoIXRoaXNVc2VyLmlzTW9kaWZpZWQoJ3Bhc3N3b3JkJykpIHJldHVybiBuZXh0KClcclxuXHRiY3J5cHQuZ2VuU2FsdChTQUxUX0ZBQ1RPUiwgZnVuY3Rpb24gKGVyciwgc2FsdCkge1xyXG5cdFx0aWYgKGVycikgcmV0dXJuIG5leHQoZXJyKVxyXG5cdFx0YmNyeXB0Lmhhc2godGhpc1VzZXIucGFzc3dvcmQsIHNhbHQsIGZ1bmN0aW9uIChlcnIsIGhhc2gpIHtcclxuXHRcdFx0aWYgKGVycikgcmV0dXJuIG5leHQoZXJyKVxyXG5cdFx0XHR0aGlzVXNlci5wYXNzd29yZCA9IGhhc2hcclxuXHRcdFx0bmV4dCgpXHJcblx0XHR9KVxyXG5cdH0pXHJcbn0pXHJcblxyXG4vKipcclxuICogU2F2ZXMgdGhlIGF2YXRhciBhZnRlciByZXNpemluZyBpdFxyXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYXZhdGFyIFRoZSBpbWFnZSBidWZmZXJcclxuICovXHJcbnVzZXIubWV0aG9kcy5zYXZlQXZhdGFyID0gYXN5bmMgZnVuY3Rpb24gKGF2YXRhcikge1xyXG5cdGxldCBuZXdBdmF0YXIgPSBhd2FpdCBzaGFycChhdmF0YXIpLnJlc2l6ZSg2NCwgNjQpLnRvQnVmZmVyKClcclxuXHJcblx0dGhpcy5hdmF0YXIgPSBhd2FpdCBCdWZmZXIuZnJvbShuZXdBdmF0YXIpLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRjb25zb2xlLmxvZyh0aGlzKVxyXG5cdC8vYXdhaXQgdGhpcy5zYXZlKClcclxuXHQvL2NvbnNvbGUubG9nKCdzYXZlZCcpXHJcbn1cclxuXHJcbnVzZXIubWV0aG9kcy5jb21wYXJlUGFzc3dvcmQgPSBmdW5jdGlvbiAocHdkKSB7XHJcblx0bGV0IHVzZXJwd2QgPSB0aGlzLnBhc3N3b3JkXHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdGlmICh0eXBlb2YgcHdkID09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJlamVjdCgnUGxlYXNlIHByb3ZpZGUgcGFzc3dvcmQnKVxyXG5cdFx0fVxyXG5cdFx0YmNyeXB0LmNvbXBhcmUocHdkLCB1c2VycHdkLCBmdW5jdGlvbiAoZXJyLCBpc01hdGNoKSB7XHJcblx0XHRcdGlmIChlcnIpIHtcclxuXHRcdFx0XHRyZWplY3QoZXJyKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc29sdmUoaXNNYXRjaClcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9KVxyXG59XHJcblxyXG51c2VyLm1ldGhvZHMuaW5jTG9naW5BdHRlbXB0cyA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aWYgKHRoaXMubG9ja1VudGlsICYmIHRoaXMubG9ja1VudGlsIDwgRGF0ZS5ub3coKSkge1xyXG5cdFx0XHRcdHJldHVybiByZXNvbHZlKFxyXG5cdFx0XHRcdFx0dGhpcy51cGRhdGUoe1xyXG5cdFx0XHRcdFx0XHQkc2V0OiB7IGxvZ2luQXR0ZW1wdHM6IDEgfSxcclxuXHRcdFx0XHRcdFx0JHVuc2V0OiB7IGxvY2tVbnRpbDogMSB9LFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHQpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciB1cGRhdGVzID0geyAkaW5jOiB7IGxvZ2luQXR0ZW1wdHM6IDEgfSB9XHJcblx0XHRcdGlmICh0aGlzLmxvZ2luQXR0ZW1wdHMgKyAxID49IE1BWF9MT0dJTl9BVFRFTVBUUyAmJiAhdGhpcy5pc0xvY2tlZCkge1xyXG5cdFx0XHRcdHVwZGF0ZXMuJHNldCA9IHsgbG9ja1VudGlsOiBEYXRlLm5vdygpICsgTE9DS19USU1FIH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHJlc29sdmUodGhpcy51cGRhdGUodXBkYXRlcykpXHJcblx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRyZWplY3QobmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpKVxyXG5cdFx0fVxyXG5cdH0pXHJcbn1cclxuXHJcbnVzZXIuc3RhdGljcy5nZXRBdXRoZW50aWNhdGVkID0gYXN5bmMgZnVuY3Rpb24gKHVzZXJuYW1lLCBwYXNzd29yZCkge1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHR0aGlzLmZpbmRPbmUoeyB1c2VybmFtZTogdXNlcm5hbWUgfSwgYXN5bmMgZnVuY3Rpb24gKGVyciwgdGhpc1VzZXIpIHtcclxuXHRcdFx0aWYgKGVycikgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoZXJyKSlcclxuXHJcblx0XHRcdGlmICghdGhpc1VzZXIpIHtcclxuXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignVXNlciBjb3VsZCBub3QgYmUgZm91bmQnKSlcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXNVc2VyLmlzTG9ja2VkKSB7XHJcblx0XHRcdFx0YXdhaXQgdGhpc1VzZXIuaW5jTG9naW5BdHRlbXB0c1xyXG5cdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKCdVc2VyIGlzIGxvY2tlZCcpKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXBhc3N3b3JkKSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ1Bhc3N3b3JkIG1pc3NpbmcnKSlcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGNvbXBhcmVSZXN1bHQgPSBhd2FpdCB0aGlzVXNlci5jb21wYXJlUGFzc3dvcmQocGFzc3dvcmQpXHJcblx0XHRcdGlmIChjb21wYXJlUmVzdWx0KSB7XHJcblx0XHRcdFx0aWYgKHRoaXNVc2VyLmlzTG9ja2VkICYmIHRoaXNVc2VyLmxvY2tVbnRpbCA+IERhdGUubm93KCkpIHtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXNVc2VyLnVwZGF0ZSh7ICRzZXQ6IHsgbG9naW5BdHRlbXB0czogMCB9IH0pXHJcblx0XHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignVXNlciBpcyBsb2NrZWQnKSlcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciB1cGRhdGVzID0ge1xyXG5cdFx0XHRcdFx0JHNldDogeyBsb2dpbkF0dGVtcHRzOiAwIH0sXHJcblx0XHRcdFx0XHQkdW5zZXQ6IHsgbG9ja1VudGlsOiAxIH0sXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gdGhpc1VzZXIudXBkYXRlKHVwZGF0ZXMsIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxyXG5cdFx0XHRcdFx0cmV0dXJuIHJlc29sdmUodGhpc1VzZXIpXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXdhaXQgdGhpc1VzZXIuaW5jTG9naW5BdHRlbXB0cygpXHJcblx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKCdQYXNzd29yZCBpbmNvcnJlY3QnKSlcclxuXHRcdH0pXHJcblx0fSlcclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVNYWlsKG1haWwpIHtcclxuXHR2YXIgcmUgPSAvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvXHJcblx0cmV0dXJuIHJlLnRlc3QobWFpbClcclxufVxyXG5cclxudmFyIGhhbmRsZUUxMTAwMCA9IGZ1bmN0aW9uIChlcnJvciwgcmVzLCBuZXh0KSB7XHJcblx0aWYgKGVycm9yLm5hbWUgPT09ICdNb25nb0Vycm9yJyAmJiBlcnJvci5jb2RlID09PSAxMTAwMCkge1xyXG5cdFx0bmV4dChuZXcgRXJyb3IoJ1VzZXIgYWxyZWFkeSBleGlzdHMnKSlcclxuXHR9IGVsc2Uge1xyXG5cdFx0bmV4dCgpXHJcblx0fVxyXG59XHJcblxyXG51c2VyLnBvc3QoJ3NhdmUnLCBoYW5kbGVFMTEwMDApXHJcbnVzZXIucG9zdCgndXBkYXRlJywgaGFuZGxlRTExMDAwKVxyXG51c2VyLnBvc3QoJ2ZpbmRPbmVBbmRVcGRhdGUnLCBoYW5kbGVFMTEwMDApXHJcbnVzZXIucG9zdCgnaW5zZXJ0TWFueScsIGhhbmRsZUUxMTAwMClcclxuXHJcbm1vZHVsZS5leHBvcnRzID0geyB1c2VyOiBtb25nb29zZS5tb2RlbCgnVXNlcicsIHVzZXIpIH1cclxuIl19