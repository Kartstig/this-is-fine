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

var usernames = {};
var numUsers = 0;

io.on('connection', function(socket) {

  socket.on('user:join', function(username) {
    socket.username = username;
    usernames[username] = username;
    ++numUsers;
    io.emit('user:join', {
      username: socket.username,
      numUsers: numUsers
    });
    io.emit('post', '<p><span class="server-post">' + socket.username + ' has joined</span></p>');
  });

  socket.on('disconnect', function() {
    --numUsers;
    io.emit('user:disconnect', {
      username: socket.username,
      numUsers: numUsers
    });
    io.emit('post', '<p><span class="server-post">' + socket.username + ' has left</span></p>');
  });

  socket.on('post', function(content) {
    io.emit('post', content);
  });
});

http.listen(config.port, function () {
  console.log('listening on *:' + config.port);
});