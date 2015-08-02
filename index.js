var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var less = require('less-middleware');

app.use(less(__dirname + '/web'));
app.use(express.static(__dirname + '/web'));

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

	socket.on('run', function (data) {
		console.log(data);

		var fs = require('fs');
		fs.writeFile("/tmp/test.c", data.code , function(err) {});

		socket.emit('forest-running');

		var exec = require('child_process').exec;
		var cmd = "forest -svcomp -force_run -file /tmp/test.c | awk '{print $5}' | sed -e 's/^R://g' -e 's/^.....//g' -e 's/....$//g'"
		exec(cmd, function(error, stdout, stderr) {
			if(error){
				socket.emit('forest-error', { message : 'Error running forest'});
			} else {
				socket.emit('forest-success', { status : stdout.trim() === 'TRUE' });
			}
		});
	});

});
