"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require('express');

var multer = require('multer');

var sharp = require('sharp');

var router = express.Router();

var user = require('../models/user');

var upload = multer({
  storage: multer.memoryStorage()
});
router.route('/avatar').post(upload.single('file'), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var thisUser, avatar;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return user.findOne({
              _id: req.user._id
            });

          case 2:
            thisUser = _context.sent;

            if (!(typeof req.file != 'undefined')) {
              _context.next = 8;
              break;
            }

            _context.next = 6;
            return sharp(req.file.buffer).resize(64, 64).toBuffer();

          case 6:
            avatar = _context.sent;
            thisUser.avatar = avatar.toString('base64');

          case 8:
            thisUser.settings.language = req.body.language;
            thisUser.settings.displayName = req.body.displayName || thisUser.settings.displayName;
            _context.next = 12;
            return thisUser.save();

          case 12:
            res.status(200).json({
              payload: {
                user: thisUser
              }
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvc2V0dGluZ3MuanMiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJtdWx0ZXIiLCJzaGFycCIsInJvdXRlciIsIlJvdXRlciIsInVzZXIiLCJ1cGxvYWQiLCJzdG9yYWdlIiwibWVtb3J5U3RvcmFnZSIsInJvdXRlIiwicG9zdCIsInNpbmdsZSIsInJlcSIsInJlcyIsImZpbmRPbmUiLCJfaWQiLCJ0aGlzVXNlciIsImZpbGUiLCJidWZmZXIiLCJyZXNpemUiLCJ0b0J1ZmZlciIsImF2YXRhciIsInRvU3RyaW5nIiwic2V0dGluZ3MiLCJsYW5ndWFnZSIsImJvZHkiLCJkaXNwbGF5TmFtZSIsInNhdmUiLCJzdGF0dXMiLCJqc29uIiwicGF5bG9hZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsT0FBTyxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUFyQjs7QUFDQSxJQUFJQyxNQUFNLEdBQUdELE9BQU8sQ0FBQyxRQUFELENBQXBCOztBQUNBLElBQUlFLEtBQUssR0FBR0YsT0FBTyxDQUFDLE9BQUQsQ0FBbkI7O0FBQ0EsSUFBSUcsTUFBTSxHQUFHSixPQUFPLENBQUNLLE1BQVIsRUFBYjs7QUFFQSxJQUFJQyxJQUFJLEdBQUdMLE9BQU8sQ0FBQyxnQkFBRCxDQUFsQjs7QUFFQSxJQUFJTSxNQUFNLEdBQUdMLE1BQU0sQ0FBQztBQUNuQk0sRUFBQUEsT0FBTyxFQUFFTixNQUFNLENBQUNPLGFBQVA7QUFEVSxDQUFELENBQW5CO0FBSUFMLE1BQU0sQ0FBQ00sS0FBUCxDQUFhLFNBQWIsRUFBd0JDLElBQXhCLENBQTZCSixNQUFNLENBQUNLLE1BQVAsQ0FBYyxNQUFkLENBQTdCO0FBQUEsMkZBQW9ELGlCQUFPQyxHQUFQLEVBQVlDLEdBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFDOUJSLElBQUksQ0FBQ1MsT0FBTCxDQUFhO0FBQUVDLGNBQUFBLEdBQUcsRUFBRUgsR0FBRyxDQUFDUCxJQUFKLENBQVNVO0FBQWhCLGFBQWIsQ0FEOEI7O0FBQUE7QUFDL0NDLFlBQUFBLFFBRCtDOztBQUFBLGtCQUcvQyxPQUFPSixHQUFHLENBQUNLLElBQVgsSUFBbUIsV0FINEI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxtQkFJL0JmLEtBQUssQ0FBQ1UsR0FBRyxDQUFDSyxJQUFKLENBQVNDLE1BQVYsQ0FBTCxDQUNqQkMsTUFEaUIsQ0FDVixFQURVLEVBQ04sRUFETSxFQUVqQkMsUUFGaUIsRUFKK0I7O0FBQUE7QUFJOUNDLFlBQUFBLE1BSjhDO0FBT2xETCxZQUFBQSxRQUFRLENBQUNLLE1BQVQsR0FBa0JBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQixRQUFoQixDQUFsQjs7QUFQa0Q7QUFVbkROLFlBQUFBLFFBQVEsQ0FBQ08sUUFBVCxDQUFrQkMsUUFBbEIsR0FBNkJaLEdBQUcsQ0FBQ2EsSUFBSixDQUFTRCxRQUF0QztBQUNBUixZQUFBQSxRQUFRLENBQUNPLFFBQVQsQ0FBa0JHLFdBQWxCLEdBQ0NkLEdBQUcsQ0FBQ2EsSUFBSixDQUFTQyxXQUFULElBQXdCVixRQUFRLENBQUNPLFFBQVQsQ0FBa0JHLFdBRDNDO0FBWG1EO0FBQUEsbUJBYTdDVixRQUFRLENBQUNXLElBQVQsRUFiNkM7O0FBQUE7QUFlbkRkLFlBQUFBLEdBQUcsQ0FBQ2UsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLENBQXFCO0FBQUVDLGNBQUFBLE9BQU8sRUFBRTtBQUFFekIsZ0JBQUFBLElBQUksRUFBRVc7QUFBUjtBQUFYLGFBQXJCOztBQWZtRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFwRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWtCQWUsTUFBTSxDQUFDQyxPQUFQLEdBQWlCN0IsTUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG52YXIgbXVsdGVyID0gcmVxdWlyZSgnbXVsdGVyJylcclxubGV0IHNoYXJwID0gcmVxdWlyZSgnc2hhcnAnKVxyXG52YXIgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKVxyXG5cclxudmFyIHVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvdXNlcicpXHJcblxyXG52YXIgdXBsb2FkID0gbXVsdGVyKHtcclxuXHRzdG9yYWdlOiBtdWx0ZXIubWVtb3J5U3RvcmFnZSgpLFxyXG59KVxyXG5cclxucm91dGVyLnJvdXRlKCcvYXZhdGFyJykucG9zdCh1cGxvYWQuc2luZ2xlKCdmaWxlJyksIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG5cdGxldCB0aGlzVXNlciA9IGF3YWl0IHVzZXIuZmluZE9uZSh7IF9pZDogcmVxLnVzZXIuX2lkIH0pXHJcblxyXG5cdGlmICh0eXBlb2YgcmVxLmZpbGUgIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdGxldCBhdmF0YXIgPSBhd2FpdCBzaGFycChyZXEuZmlsZS5idWZmZXIpXHJcblx0XHRcdC5yZXNpemUoNjQsIDY0KVxyXG5cdFx0XHQudG9CdWZmZXIoKVxyXG5cdFx0dGhpc1VzZXIuYXZhdGFyID0gYXZhdGFyLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cdH1cclxuXHJcblx0dGhpc1VzZXIuc2V0dGluZ3MubGFuZ3VhZ2UgPSByZXEuYm9keS5sYW5ndWFnZVxyXG5cdHRoaXNVc2VyLnNldHRpbmdzLmRpc3BsYXlOYW1lID1cclxuXHRcdHJlcS5ib2R5LmRpc3BsYXlOYW1lIHx8IHRoaXNVc2VyLnNldHRpbmdzLmRpc3BsYXlOYW1lXHJcblx0YXdhaXQgdGhpc1VzZXIuc2F2ZSgpXHJcblxyXG5cdHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgcGF5bG9hZDogeyB1c2VyOiB0aGlzVXNlciB9IH0pXHJcbn0pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlclxyXG4iXX0=