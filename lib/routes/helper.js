"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require('express');

var router = express.Router();

var user = require('../models/user');

router.get('/autocomplete', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = res.status(200);
            _context.next = 3;
            return user.find().select('username settings.displayName');

          case 3:
            _context.t1 = _context.sent;

            _context.t0.json.call(_context.t0, _context.t1);

          case 5:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvaGVscGVyLmpzIl0sIm5hbWVzIjpbImV4cHJlc3MiLCJyZXF1aXJlIiwicm91dGVyIiwiUm91dGVyIiwidXNlciIsImdldCIsInJlcSIsInJlcyIsInN0YXR1cyIsImZpbmQiLCJzZWxlY3QiLCJqc29uIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxTQUFELENBQXJCOztBQUNBLElBQUlDLE1BQU0sR0FBR0YsT0FBTyxDQUFDRyxNQUFSLEVBQWI7O0FBRUEsSUFBTUMsSUFBSSxHQUFHSCxPQUFPLENBQUMsZ0JBQUQsQ0FBcEI7O0FBRUFDLE1BQU0sQ0FBQ0csR0FBUCxDQUFXLGVBQVg7QUFBQSwyRkFBNEIsaUJBQU9DLEdBQVAsRUFBWUMsR0FBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsMEJBQzNCQSxHQUFHLENBQ0RDLE1BREYsQ0FDUyxHQURULENBRDJCO0FBQUE7QUFBQSxtQkFHZEosSUFBSSxDQUFDSyxJQUFMLEdBQVlDLE1BQVosQ0FBbUIsK0JBQW5CLENBSGM7O0FBQUE7QUFBQTs7QUFBQSx3QkFHekJDLElBSHlCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQTVCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlgsTUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG52YXIgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKVxyXG5cclxuY29uc3QgdXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJylcclxuXHJcbnJvdXRlci5nZXQoJy9hdXRvY29tcGxldGUnLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuXHRyZXNcclxuXHRcdC5zdGF0dXMoMjAwKVxyXG5cdFx0Lmpzb24oYXdhaXQgdXNlci5maW5kKCkuc2VsZWN0KCd1c2VybmFtZSBzZXR0aW5ncy5kaXNwbGF5TmFtZScpKVxyXG59KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXJcclxuIl19