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

io.on('connection', function(socket) {
  console.log('New Connection');

  socket.on('post', function(content, content_type) {
    io.emit('post', content, content_type);
    console.log('A new ' + content_type + ' was posted!');
  });
});

http.listen(config.port, function () {
  console.log('listening on *:' + config.port);
});