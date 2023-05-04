const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Listen for changes to the code
  socket.on('code-change', (code) => {
    // Broadcast the updated code to all connected clients
    socket.broadcast.emit('code-update', code);
  });
});

http.listen(3000, () => {
  console.log('listening on port:3000');
});