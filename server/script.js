const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let greetings = "whatever!";

io.on('connection', (socket) => {
    socket.emit("greetings", greetings);
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(4113, () => {
    console.log('Listening on port *: 4113');
});
