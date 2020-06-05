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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGVscGVycy9rZXlzdG9yZS50cyJdLCJuYW1lcyI6WyJzb2NrZXRTdG9yZSIsIktldnkiLCJwcm9jZXNzIiwiZW52IiwiUkVESVNfVVJMIiwibmFtZXNwYWNlIiwiaW52aXRlU3RvcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUVPLElBQU1BLFdBQVcsR0FBRyxJQUFJQyxnQkFBSixDQUFTQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsU0FBckIsRUFBZ0M7QUFBRUMsRUFBQUEsU0FBUyxFQUFFO0FBQWIsQ0FBaEMsQ0FBcEI7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHLElBQUlMLGdCQUFKLENBQVNDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxTQUFyQixFQUFnQztBQUFFQyxFQUFBQSxTQUFTLEVBQUU7QUFBYixDQUFoQyxDQUFwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBLZXZ5IGZyb20gJ2tleXYnXG5cbmV4cG9ydCBjb25zdCBzb2NrZXRTdG9yZSA9IG5ldyBLZXZ5KHByb2Nlc3MuZW52LlJFRElTX1VSTCwgeyBuYW1lc3BhY2U6ICdzb2NrZXQnIH0pXG5leHBvcnQgY29uc3QgaW52aXRlU3RvcmUgPSBuZXcgS2V2eShwcm9jZXNzLmVudi5SRURJU19VUkwsIHsgbmFtZXNwYWNlOiAnaW52aXRlJyB9KSAiXX0=