var io = require('socket.io-client')
  , partial = require('lodash').partial
  , Router = require('./Router')
  , RouterComponent = require('./components/Router.jsx')
  , path = window.location
  , socket = io.connect(path);

var selectConnect = function (game) {
  socket.emit("begin", {name: "Player"});
};

var selectBeginConfirm = function (game, user) {
  game.gameState.user = user;
  router.processHash();
};

var selectJoinRoom = function (game, roomName) {
  window.location.hash = "#room/" + roomName
  game.gui.setState({
    activeState: "room",
    roomName: roomName
  });
};

var selectJoinLobby = function (game, lobbyName) {
  window.location.hash = "#lobby";
  game.gui.setState({
    activeState: "lobby",
    roomName: lobbyName
  }); 
};

var selectNameChangeConfirm = function (game, user) {
  game.gameState.user = user;
};

var updateLobby = function (game, lobby) {
  game.gameState.lobby = lobby
};

var updateRoom = function (game, room) {
  game.gameState.room = room;
};

//Atom to store our game state
var gameState = {
  lobby: {
    rooms: [] 
  },
  user: {
    name: "" 
  },
  room: {
    users: [],
    question: "",
    answer: ""
  }
};

var gui = React.renderComponent(RouterComponent({
  socket: socket,
  lobby: gameState.lobby,
  room: gameState.room,
  user: gameState.user
}), document.body);

var game = {
  socket: socket,
  gameState: gameState,
  gui: gui
};

var router = new Router(game).start();

var make = function (game) {
  game.gui.setProps({
    socket: game.socket,
    user: game.gameState.user,
    room: game.gameState.room,
    lobby: game.gameState.lobby,
  });
  window.requestAnimationFrame(partial(make, game));
};

socket
  .on("connect", partial(handleConnect, game))
  .on("begin-confirm", partial(handleBeginConfirm, game))
  .on("join-room", partial(handleJoinRoom, game))
  .on("join-lobby", partial(handleJoinLobby, game))
  .on("name-change-confirm", partial(handleNameChangeConfirm, game))
  .on("tick-lobby", partial(updateLobby, game))
  .on("tick-room", partial(updateRoom, game));

window.requestAnimationFrame(partial(make, game));
