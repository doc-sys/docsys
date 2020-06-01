"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inviteStore = exports.socketStore = void 0;

var _keyv = _interopRequireDefault(require("keyv"));

var socketStore = new _keyv["default"](process.env.REDIS_URL, {
  namespace: 'socket'
});
exports.socketStore = socketStore;
var inviteStore = new _keyv["default"](process.env.REDIS_URL, {
  namespace: 'invite'
});
exports.inviteStore = inviteStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVycy9rZXlzdG9yZS50cyJdLCJuYW1lcyI6WyJzb2NrZXRTdG9yZSIsIktldnkiLCJwcm9jZXNzIiwiZW52IiwiUkVESVNfVVJMIiwibmFtZXNwYWNlIiwiaW52aXRlU3RvcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUVPLElBQU1BLFdBQVcsR0FBRyxJQUFJQyxnQkFBSixDQUFTQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsU0FBckIsRUFBZ0M7QUFBRUMsRUFBQUEsU0FBUyxFQUFFO0FBQWIsQ0FBaEMsQ0FBcEI7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHLElBQUlMLGdCQUFKLENBQVNDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxTQUFyQixFQUFnQztBQUFFQyxFQUFBQSxTQUFTLEVBQUU7QUFBYixDQUFoQyxDQUFwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBLZXZ5IGZyb20gJ2tleXYnXHJcblxyXG5leHBvcnQgY29uc3Qgc29ja2V0U3RvcmUgPSBuZXcgS2V2eShwcm9jZXNzLmVudi5SRURJU19VUkwsIHsgbmFtZXNwYWNlOiAnc29ja2V0JyB9KVxyXG5leHBvcnQgY29uc3QgaW52aXRlU3RvcmUgPSBuZXcgS2V2eShwcm9jZXNzLmVudi5SRURJU19VUkwsIHsgbmFtZXNwYWNlOiAnaW52aXRlJyB9KSAiXX0=