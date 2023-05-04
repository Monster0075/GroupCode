const express = require('express');
const app = express();
const Server = require('http').createServer(app);
const io = require('socket.io')(Server);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');
 
    socket.on('ChangedCode', (code) => {
        socket.broadcast.emit('NewCode', code);
    });

});

Server.listen(3000, () => {
    console.log('Server is running on port:3000');
});