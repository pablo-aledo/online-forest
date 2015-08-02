var socket = io.connect(location.origin);

socket.on('bar', data => console.log(data));
socket.on('test', data => console.log(data));
socket.emit('foo', { text : 'foo' });
socket.emit('foo', { text : 'bar' });
