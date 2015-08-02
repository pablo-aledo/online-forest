var express = require('express');
var app = express();

app.use(express.static('web'));

var server = app.listen(8080, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Forest Online listening at http://%s:%s', host, port);
});
