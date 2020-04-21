"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleError = exports.ErrorHandler = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ErrorHandler = /*#__PURE__*/function (_Error) {
  (0, _inherits2["default"])(ErrorHandler, _Error);

  var _super = _createSuper(ErrorHandler);

  function ErrorHandler(statusCode, message) {
    var _this;

    (0, _classCallCheck2["default"])(this, ErrorHandler);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "statusCode", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "message", void 0);
    _this.statusCode = statusCode;
    _this.message = message;
    return _this;
  }

  return ErrorHandler;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));

exports.ErrorHandler = ErrorHandler;

var handleError = function handleError(err, res) {
  res.status(400).json({
    payload: {
      message: err.message
    }
  });
};

exports.handleError = handleError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVycy9lcnJvci50cyJdLCJuYW1lcyI6WyJFcnJvckhhbmRsZXIiLCJzdGF0dXNDb2RlIiwibWVzc2FnZSIsIkVycm9yIiwiaGFuZGxlRXJyb3IiLCJlcnIiLCJyZXMiLCJzdGF0dXMiLCJqc29uIiwicGF5bG9hZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFk7Ozs7O0FBSVQsd0JBQVlDLFVBQVosRUFBZ0NDLE9BQWhDLEVBQWlEO0FBQUE7O0FBQUE7QUFDN0M7QUFENkM7QUFBQTtBQUU3QyxVQUFLRCxVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFVBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUg2QztBQUloRDs7O2tEQVI2QkMsSzs7OztBQVczQixJQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDQyxHQUFELEVBQW9CQyxHQUFwQixFQUFzQztBQUM3REEsRUFBQUEsR0FBRyxDQUFDQyxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUI7QUFDakJDLElBQUFBLE9BQU8sRUFBRTtBQUFFUCxNQUFBQSxPQUFPLEVBQUVHLEdBQUcsQ0FBQ0g7QUFBZjtBQURRLEdBQXJCO0FBR0gsQ0FKTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcclxuXHJcbmV4cG9ydCBjbGFzcyBFcnJvckhhbmRsZXIgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBwdWJsaWMgc3RhdHVzQ29kZTogbnVtYmVyXHJcbiAgICBwdWJsaWMgbWVzc2FnZTogc3RyaW5nXHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RhdHVzQ29kZTogbnVtYmVyLCBtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy5zdGF0dXNDb2RlID0gc3RhdHVzQ29kZVxyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGhhbmRsZUVycm9yID0gKGVycjogRXJyb3JIYW5kbGVyLCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7XHJcbiAgICAgICAgcGF5bG9hZDogeyBtZXNzYWdlOiBlcnIubWVzc2FnZSB9XHJcbiAgICB9KVxyXG59Il19