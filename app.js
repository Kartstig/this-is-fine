var config = require('./config');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connection = require('express-myconnection');
var mysql = require('mysql');

app.use(
  connection(mysql, {
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      port: config.db.port,
      database: config.db.database
  }, 'request')
);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/templates/index.html');
});

io.on('connection', function(socket){
  socket.emit('chat message', function () {
    io.emit('chat message', 'A user has joined')
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(config.port, function () {
  console.log('listening on *:' + config.port);
});