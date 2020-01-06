var _ = require('lodash');

var GUI = function (room, lobby, user) {
  this.props = {
    room: room,
    lobby: lobby,
    user: user
  };

  this.states = {
    states: ["lobby", "room"],
    activeState: "lobby",
    roomName: "lobby"
  };
};

var clearHUD = function () {
  console.log('\u001B[2J\u001B[0;0f');
};

var createUser = function (user) {
  console.log("Welcome: " + user.name);
};

createLobby = function (lobby) {
  var rooms = lobby.rooms.forEach(function (room) {
    console.log(room.name + "   " + room.users.length);
  });
};

var createRoom = function (room) {
  console.log("Question: " + room.question);
  console.log("Answer: " + room.answer);
  var users = room.users.forEach(function (user) {
    console.log(user.name + "   " + user.score);
  });
};


GUI.prototype.tick = function () {
  clearHUD();
  createUser(this.props.user);
  createLobby(this.props.lobby);
  if (this.states.activeState === "room") {
    createRoom(this.props.room);
  }
};

GUI.prototype.setState = function (states) {
  _.extend(this.states, states);
};

GUI.prototype.setProps = function (props) {
  _.extend(this.props, props); 
};

module.exports = GUI;
