const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { PythonShell } = require('python-shell')

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));
app.use(express.json())

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('CODE_CHANGED', async (code) => {
    socket.broadcast.emit('CODE_UPDATE', code)
  });
});

app.post('/execute', async (req, res) => {
  const { code, language } = req.body

  let result = '';
  if (language === 'python') {
    const options = {
      mode: 'text',
      pythonPath: 'python',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
    }
    const pyshell = new PythonShell('script.py', options)

    pyshell.send(code)

    pyshell.on('message', (msg) => {
      result += msg
    })

    pyshell.end((err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('finished')
        res.json({ result })
      }
    })
  }
})

server.listen(3000, () => {
  console.log('listening on port:3000');
});