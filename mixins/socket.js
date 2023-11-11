const ws = require('ws');

const wss = new ws.WebSocketServer({ port: 3001 });

// eslint-disable-next-line no-console
console.log('starting socket server');

wss.on('connection', (socket) => {
  socket.on('message', (data) => {
    // eslint-disable-next-line no-console
    console.log('received: %s', data);
  });
});

wss.send = function broadcast(type, body) {
  const message = JSON.stringify({ type, body });
  wss.clients.forEach((client) => {
    client.send(message);
  });
};

module.exports = wss;
