var socket = io.connect(location.origin);

socket.on('output', data => console.log(data));
socket.emit('run', { code : 'int main(){return 0;}' });
