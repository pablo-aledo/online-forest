import fs from 'fs';
import {Server} from 'http';
import {exec} from 'child_process';

import express from 'express';
import Socket from 'socket.io';
import less from 'less-middleware';
import browserify from 'browserify-middleware';

const FOREST_FILE = '/tmp/test.c';
const FOREST_CMD = '/vagrant/forest/bin/forestwrapper';
const FOREST_KILL_CMD = 'killall forestwrapper';
const EXAMPLES_DIR = __dirname + '/examples/';

var app = express();
var server = Server(app);
var io = Socket(server);

app.use(less(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.get('/forest.js', browserify(__dirname + '/client/app.js'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));

server.listen(3000, () => {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Forest Online listening at http://%s:%s', host, port);
});

io.on('connection', socket => {



	var walk    = require('walk');
	var files   = [];

	// Walker options
	var walker  = walk.walk('examples', { followLinks: false });

	walker.on('file', function(root, stat, next) {
		files.push( {name : stat.name, category : root.split("/")[1] } );
		next();
	});

	walker.on('end', function() {
		socket.emit('example-list', files);
	});


	socket.on('run', ({code}) => {
		fs.writeFile(FOREST_FILE, code , function(err) {});

		exec(FOREST_CMD, function(error, stdout, stderr) {
			if (error) {
				socket.emit('forest-error', { message : 'Error running forest'});
			} else {
				console.log({ status : stdout.trim() });
				var warnings = [{line:10, column:1, message: "Hello"}];
				socket.emit('forest-success', { status : stdout.trim(), warnings });
			}
		});

		socket.emit('forest-running');
	});

	socket.on('abort', () => {

		exec(FOREST_KILL_CMD, function(error, stdout, stderr) {
			if (error) {
				socket.emit('forest-error', { message : 'Error aborting forest'});
			} else {
				socket.emit('forest-success', { status : null });
			}
		});

	});

	socket.on('get-code', ({name}) => {


		var walk    = require('walk');
		var files   = [];

		// Walker options
		var walker  = walk.walk('examples', { followLinks: false });

		walker.on('file', function(root, stat, next) {
			if(stat.name == name){
				fs.readFile(root + "/" + stat.name, 'utf8', function (err, code) {
					if (err) {
						socket.emit('forest-error', { message : 'Example ' + name + ' does not exist!'});
					} else {
						socket.emit('example-code', { name, code } );
					}
				});
			} else {
				next();
			}
		});


	});

});

