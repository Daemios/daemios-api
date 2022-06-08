const ws = require("ws");
const wss = new ws.WebSocketServer({ port: 3001 });

console.log('starting socket server')

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
});

wss.send = function broadcast(type, body) {
  const message = JSON.stringify({type, body})
  console.log(message)
  wss.clients.forEach(function each(client) {
    client.send(message);
  });
};

module.exports = wss;
