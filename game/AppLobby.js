var inherits = require('util').inherits
  , _ = require('lodash')
  , RoomMixin = require('roomba-server').RoomMixin

var AppLobby = function (name) {
  RoomMixin.call(this, name);

  this.startTime = null;
  this.stopTime = null;

  this._interval = null;
};

inherits(AppLobby, RoomMixin);

AppLobby.prototype.start = function () {
  var now = Date.now();

  this.startTime = now;
  this.stopTime = null;
  this._interval = setInterval(_.bind(this.tick, this), 500);
  return this;
};

AppLobby.prototype.stop = function () {
  var now = Date.now();

  this.startTime = null;
  this.stopTime = now;
  clearInterval(this._interval);
  return this;
};

AppLobby.prototype.serializeState = function () {
  return {
    users: _.invoke(this.getUsers(), "serializeState"),
    rooms: _.invoke(this.roomManager.getRooms(), "serializeState")
  }; 
};

AppLobby.prototype.tick = function () {
  var lobbyState = this.serializeState()
    , lobbyUsers = this.getUsers()
    , roomUsers = _.flatten(_.invoke(this.roomManager.getRooms(), "getUsers"));

  _.invoke(roomUsers, "message", "tick-lobby", lobbyState);
  _.invoke(lobbyUsers, "message", "tick-lobby", lobbyState);
}

module.exports = AppLobby;
