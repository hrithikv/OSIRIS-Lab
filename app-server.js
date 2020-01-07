var http = require('http')
  , ecstatic = require('ecstatic')
  , roomba = require('roomba-server')
  , socketIO = require('socket.io')
  , _ = require('lodash')
  , AppRoom = require('./game/AppRoom')
  , AppLobby = require('./game/AppLobby')
  , AppWizard = require('./game/AppWizard')
  , app = http.createServer(ecstatic({root: __dirname + "/public"}))
  , server = socketIO.listen(app).set('log level', 1)
  , lobby = new AppLobby("lobby")
  , roomManager = new roomba.RoomManager(server, lobby)
  , additionRoom = new AppRoom("addition", "+", 12, 3)
  , subtractionRoom = new AppRoom("subtraction", "-", 100, 2)
  , multiplicationRoom = new AppRoom("multiplication", "*", 12, 2);


roomManager
  .addRoom(additionRoom)
  .addRoom(subtractionRoom)
  .addRoom(multiplicationRoom)

lobby.start();
additionRoom.start();
subtractionRoom.start();
multiplicationRoom.start();

var selectBegin = _.curry(function (socket, roomManager, data) {
  var id = data.id
    , user = new AppWizard(socket, data.name || "AppWizard");

  roomManager.socketToUserMap[socket.id] = user;  
  roomManager.getLobby().addUser(user);
  socket.emit("begin-confirm", user.serializeState());
});

var selectDisconnect = _.curry(function (socket, roomManager, data) {
  var user = roomManager.socketToUserMap[socket.id];

  if (user) {
    user.room.removeUser(user);
    delete roomManager.socketToUserMap[socket.id];
  }
});

var selectSubmission = _.curry(function (socket, roomManager, answer) {
  var user = roomManager.socketToUserMap[socket.id]; 

  user.room.storeSubmission({
    answer: Number(answer),
    user: user
  });
});

var selectJoin = _.curry(function (socket, roomManager, roomName) {
  var user = roomManager.socketToUserMap[socket.id]
    , targetRoom = roomManager.getRoomByName(roomName)
    , lobby = roomManager.getLobby();

  if (user.room) user.room.removeUser(user);
  if (targetRoom) {
    console.log(targetRoom.name);
    targetRoom.addUser(user); 
    socket.emit("join-room", user.room.name);
  } else {
    lobby.addUser(user);
    socket.emit("join-lobby", lobby.name);
  }
});

var selectNameChange = _.curry(function (socket, roomManager, name) {
  var user = roomManager.socketToUserMap[socket.id];

  user.name = name;
  socket.emit("name-change-confirm", user.serializeState());
});

server.sockets.on("connection", function (socket) {
  socket 
    .on("begin", selectBegin(socket, roomManager))
    .on("disconnect", selectDisconnect(socket, roomManager))
    .on("submission", selectSubmission(socket, roomManager))
    .on("name-change", selectNameChange(socket, roomManager))
    .on("join", selectJoin(socket, roomManager))
});

app.listen(8080, console.log.bind(console, "server on 8080"));
