"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getStorage;

var _aws = _interopRequireDefault(require("./aws"));

var _gridfs = _interopRequireDefault(require("./gridfs"));

var _local = _interopRequireDefault(require("./local"));

var _azure = _interopRequireDefault(require("./azure"));

var _google = _interopRequireDefault(require("./google"));

function getStorage() {
  switch (process.env.STORAGE_ENGINE) {
    case 'aws':
      return new _aws["default"]();

    case 'gridfs':
      return new _gridfs["default"]();

    case 'local':
      return new _local["default"]();

    case 'azure':
      return new _azure["default"]();

    case 'google':
      return new _google["default"]();

    default:
      throw new Error("Invalid Storage Type: ".concat(process.env.STORAGE_ENGINE));
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS9hZGFwdGVycy9pbmRleC50cyJdLCJuYW1lcyI6WyJnZXRTdG9yYWdlIiwicHJvY2VzcyIsImVudiIsIlNUT1JBR0VfRU5HSU5FIiwiQVdTIiwiR3JpZEZTIiwiTG9jYWwiLCJBenVyZVN0b3JhZ2UiLCJHb29nbGVTdG9yYWdlIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdlLFNBQVNBLFVBQVQsR0FBc0M7QUFDakQsVUFBUUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGNBQXBCO0FBQ0ksU0FBSyxLQUFMO0FBQ0ksYUFBTyxJQUFJQyxlQUFKLEVBQVA7O0FBQ0osU0FBSyxRQUFMO0FBQ0ksYUFBTyxJQUFJQyxrQkFBSixFQUFQOztBQUNKLFNBQUssT0FBTDtBQUNJLGFBQU8sSUFBSUMsaUJBQUosRUFBUDs7QUFDSixTQUFLLE9BQUw7QUFDSSxhQUFPLElBQUlDLGlCQUFKLEVBQVA7O0FBQ0osU0FBSyxRQUFMO0FBQ0ksYUFBTyxJQUFJQyxrQkFBSixFQUFQOztBQUVKO0FBQ0ksWUFBTSxJQUFJQyxLQUFKLGlDQUFtQ1IsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGNBQS9DLEVBQU47QUFiUjtBQWVIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFXUyBmcm9tICcuL2F3cydcclxuaW1wb3J0IEdyaWRGUyBmcm9tICcuL2dyaWRmcyc7XHJcbmltcG9ydCBMb2NhbCBmcm9tICcuL2xvY2FsJztcclxuaW1wb3J0IEF6dXJlU3RvcmFnZSBmcm9tICcuL2F6dXJlJztcclxuaW1wb3J0IEdvb2dsZVN0b3JhZ2UgZnJvbSAnLi9nb29nbGUnO1xyXG5pbXBvcnQgU3RvcmFnZUFkYXB0ZXIgZnJvbSAnLi9pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0U3RvcmFnZSgpOiBTdG9yYWdlQWRhcHRlciB7XHJcbiAgICBzd2l0Y2ggKHByb2Nlc3MuZW52LlNUT1JBR0VfRU5HSU5FKSB7XHJcbiAgICAgICAgY2FzZSAnYXdzJzpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBBV1MoKVxyXG4gICAgICAgIGNhc2UgJ2dyaWRmcyc6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgR3JpZEZTKClcclxuICAgICAgICBjYXNlICdsb2NhbCc6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTG9jYWwoKVxyXG4gICAgICAgIGNhc2UgJ2F6dXJlJzpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBBenVyZVN0b3JhZ2UoKVxyXG4gICAgICAgIGNhc2UgJ2dvb2dsZSc6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgR29vZ2xlU3RvcmFnZSgpXHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBTdG9yYWdlIFR5cGU6ICR7cHJvY2Vzcy5lbnYuU1RPUkFHRV9FTkdJTkV9YClcclxuICAgIH1cclxufSJdfQ==