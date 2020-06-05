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
    console.error(_this.stack);
    return _this;
  }

  return ErrorHandler;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));

exports.ErrorHandler = ErrorHandler;

var handleError = function handleError(err, res) {
  res.status(err.statusCode || 500).json({
    message: err.message
  });
};

exports.handleError = handleError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVycy9lcnJvci50cyJdLCJuYW1lcyI6WyJFcnJvckhhbmRsZXIiLCJzdGF0dXNDb2RlIiwibWVzc2FnZSIsImNvbnNvbGUiLCJlcnJvciIsInN0YWNrIiwiRXJyb3IiLCJoYW5kbGVFcnJvciIsImVyciIsInJlcyIsInN0YXR1cyIsImpzb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxZOzs7OztBQUlULHdCQUFZQyxVQUFaLEVBQWdDQyxPQUFoQyxFQUFpRDtBQUFBOztBQUFBO0FBQzdDO0FBRDZDO0FBQUE7QUFFN0MsVUFBS0QsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxVQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFFQUMsSUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsTUFBS0MsS0FBbkI7QUFMNkM7QUFNaEQ7OztrREFWNkJDLEs7Ozs7QUFhM0IsSUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ0MsR0FBRCxFQUFvQkMsR0FBcEIsRUFBc0M7QUFDN0RBLEVBQUFBLEdBQUcsQ0FBQ0MsTUFBSixDQUFXRixHQUFHLENBQUNQLFVBQUosSUFBa0IsR0FBN0IsRUFBa0NVLElBQWxDLENBQXVDO0FBQ25DVCxJQUFBQSxPQUFPLEVBQUVNLEdBQUcsQ0FBQ047QUFEc0IsR0FBdkM7QUFHSCxDQUpNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5leHBvcnQgY2xhc3MgRXJyb3JIYW5kbGVyIGV4dGVuZHMgRXJyb3Ige1xuICAgIHB1YmxpYyBzdGF0dXNDb2RlOiBudW1iZXJcbiAgICBwdWJsaWMgbWVzc2FnZTogc3RyaW5nXG5cbiAgICBjb25zdHJ1Y3RvcihzdGF0dXNDb2RlOiBudW1iZXIsIG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMuc3RhdHVzQ29kZSA9IHN0YXR1c0NvZGVcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5zdGFjaylcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVFcnJvciA9IChlcnI6IEVycm9ySGFuZGxlciwgcmVzOiBSZXNwb25zZSkgPT4ge1xuICAgIHJlcy5zdGF0dXMoZXJyLnN0YXR1c0NvZGUgfHwgNTAwKS5qc29uKHtcbiAgICAgICAgbWVzc2FnZTogZXJyLm1lc3NhZ2VcbiAgICB9KVxufSJdfQ==