var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var less = require('less-middleware');

app.use(less(__dirname + '/web'));
app.use(express.static(__dirname + '/web'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));

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

		//var cmd = "forest -svcomp -force_run -file /tmp/test.c | awk '{print $5}' | sed -e 's/^R://g' -e 's/^.....//g' -e 's/....$//g'"
		//var cmd = "set"
		var cmd = "/media/DATA/delme/forestweb/online-forest/forest/bin/forestwrapper"

		//var env = process.env,
			//someVar,
			//envDup = {},
			//child_process = require('child_process');

		//for (someVar in env) {
			//envDup[someVar] = env[someVar];
		//}
		//envDup['LLVM_HOME'      ] = '/llvm-2.9';
		//envDup['FOREST_HOME'    ] = '/media/DATA/delme/forestweb/online-forest/forest/';
		//envDup['LD_LIBRARY_PATH'] = '/usr/local/lib/';
		//envDup['PATH'           ] += ':/llvm-2.9/klee/Release+Asserts/bin/';
		//envDup['PATH'           ] += ':/llvm-2.9/llvm-gcc-4.2-2.9.source/install/bin/';
		//envDup['PATH'           ] += ':/llvm-2.9/stp/install/bin/';
		//envDup['PATH'           ] += ':/llvm-2.9/stp/install/bin/';
		//envDup['PATH'           ] += ':/llvm-2.9/Release+Asserts/bin/';
		//envDup['PATH'           ] += ':/media/DATA/delme/forestweb/online-forest/forest/bin/';
		//exec(cmd,{env: envDup},function(error, stdout, stderr) {

		exec(cmd,function(error, stdout, stderr) {
			if(error){
				socket.emit('forest-error', { message : 'Error running forest'});
			} else {
				console.log({ status : stdout.trim() });
				var warnings = [{line:10, column:1, message: "Hello"}];
				socket.emit('forest-success', { status : stdout.trim() === 'TRUE', warnings });
			}
		});
	});

	socket.on('update-examples', function (data) {
		socket.emit('update-examples', [
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
		}
	);


	socket.on('get-code', function (data) {
		var fs = require('fs')
		fs.readFile( 'examples/' + data.name, 'utf8', function (err,data) {
			socket.emit('get-code', { name : data.name, code : data } );
		});
	});




});
