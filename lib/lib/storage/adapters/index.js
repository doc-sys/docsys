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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS9hZGFwdGVycy9pbmRleC50cyJdLCJuYW1lcyI6WyJnZXRTdG9yYWdlIiwicHJvY2VzcyIsImVudiIsIlNUT1JBR0VfRU5HSU5FIiwiQVdTIiwiR3JpZEZTIiwiTG9jYWwiLCJBenVyZVN0b3JhZ2UiLCJHb29nbGVTdG9yYWdlIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdlLFNBQVNBLFVBQVQsR0FBc0M7QUFDakQsVUFBUUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGNBQXBCO0FBQ0ksU0FBSyxLQUFMO0FBQ0ksYUFBTyxJQUFJQyxlQUFKLEVBQVA7O0FBQ0osU0FBSyxRQUFMO0FBQ0ksYUFBTyxJQUFJQyxrQkFBSixFQUFQOztBQUNKLFNBQUssT0FBTDtBQUNJLGFBQU8sSUFBSUMsaUJBQUosRUFBUDs7QUFDSixTQUFLLE9BQUw7QUFDSSxhQUFPLElBQUlDLGlCQUFKLEVBQVA7O0FBQ0osU0FBSyxRQUFMO0FBQ0ksYUFBTyxJQUFJQyxrQkFBSixFQUFQOztBQUVKO0FBQ0ksWUFBTSxJQUFJQyxLQUFKLGlDQUFtQ1IsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGNBQS9DLEVBQU47QUFiUjtBQWVIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFXUyBmcm9tICcuL2F3cydcbmltcG9ydCBHcmlkRlMgZnJvbSAnLi9ncmlkZnMnO1xuaW1wb3J0IExvY2FsIGZyb20gJy4vbG9jYWwnO1xuaW1wb3J0IEF6dXJlU3RvcmFnZSBmcm9tICcuL2F6dXJlJztcbmltcG9ydCBHb29nbGVTdG9yYWdlIGZyb20gJy4vZ29vZ2xlJztcbmltcG9ydCBTdG9yYWdlQWRhcHRlciBmcm9tICcuL2ludGVyZmFjZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFN0b3JhZ2UoKTogU3RvcmFnZUFkYXB0ZXIge1xuICAgIHN3aXRjaCAocHJvY2Vzcy5lbnYuU1RPUkFHRV9FTkdJTkUpIHtcbiAgICAgICAgY2FzZSAnYXdzJzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgQVdTKClcbiAgICAgICAgY2FzZSAnZ3JpZGZzJzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgR3JpZEZTKClcbiAgICAgICAgY2FzZSAnbG9jYWwnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBMb2NhbCgpXG4gICAgICAgIGNhc2UgJ2F6dXJlJzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgQXp1cmVTdG9yYWdlKClcbiAgICAgICAgY2FzZSAnZ29vZ2xlJzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgR29vZ2xlU3RvcmFnZSgpXG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBTdG9yYWdlIFR5cGU6ICR7cHJvY2Vzcy5lbnYuU1RPUkFHRV9FTkdJTkV9YClcbiAgICB9XG59Il19