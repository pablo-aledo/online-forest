import fs from 'fs';
import {Server} from 'http';
import {exec} from 'child_process';

import express from 'express';
import Socket from 'socket.io';
import less from 'less-middleware';
import browserify from 'browserify-middleware';

const FOREST_FILE = '/tmp/test.c';
const FOREST_CMD = __dirname + '/forest/bin/forestwrapper';
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
	socket.emit('example-list', [
		{ name : 'array_false-unreach-call1'    , category : 'loops'},
		{ name : 'array_false-unreach-call2'    , category : 'loops'},
		{ name : 'const_false-unreach-call1'    , category : 'loops'},
		{ name : 'diamond_false-unreach-call1'  , category : 'loops'},
		{ name : 'diamond_false-unreach-call2'  , category : 'loops'},
		{ name : 'lu'                           , category : 'loops'},
		{ name : 'ludcmp_false-unreach-call'    , category : 'loops'},
		{ name : 'multivar_false-unreach-call1' , category : 'loops'},
		{ name : 'nec11_false-unreach-call'     , category : 'loops'},
		{ name : 'nec20_false-unreach-call'     , category : 'loops'},
		{ name : 'phases_false-unreach-call2'   , category : 'loops'},
		{ name : 'EvenOdd01'                    , category : 'recursive'},
		{ name : 'Addition01'                   , category : 'recursive'},
		{ name : 'Ackermann03'                  , category : 'recursive'},
		{ name : 'Fibonacci01'                  , category : 'recursive'},
		{ name : 'Ackermann01'                  , category : 'recursive'},
		{ name : 'McCarthy91_b'                 , category : 'recursive'},
		{ name : 'recHanoi03'                   , category : 'recursive'},
		{ name : 'recHanoi01'                   , category : 'recursive'},
		{ name : 'gcd01'                        , category : 'recursive'},
		{ name : 'Fibonacci02'                  , category : 'recursive'}
	]);

	socket.on('run', ({code}) => {
		fs.writeFile(FOREST_FILE, code , function(err) {});

		exec(FOREST_CMD, function(error, stdout, stderr) {
			if (error) {
				socket.emit('forest-error', { message : 'Error running forest'});
			} else {
				console.log({ status : stdout.trim() });
				var warnings = [{line:10, column:1, message: "Hello"}];
				socket.emit('forest-success', { status : stdout.trim() === 'TRUE', warnings });
			}
		});

		socket.emit('forest-running');
	});

	socket.on('get-code', ({name}) => {
		fs.readFile(EXAMPLES_DIR + name, 'utf8', function (err, code) {
			if (err) {
				socket.emit('forest-error', { message : 'Example ' + name + ' does not exist!'});
			} else {
				socket.emit('example-code', { name, code } );
			}
		});
	});

});

