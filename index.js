var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('web'));

server.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Forest Online listening at http://%s:%s', host, port);
});

io.on('connection', function(socket) {
	socket.emit('test', { text: 'initial' });
	socket.on('foo', function (data) {
		socket.emit('bar', data);
	});
});
