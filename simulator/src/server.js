const WebSocket = require('ws');

class TactodeLinkServer {  

  constructor() {
    this._wss = new WebSocket.Server({ port: 8081 })

    this._wss.on('connection', function connection(ws) {
      
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });
    
      ws.send(JSON.stringify('something'));
    })

  }

}

let tet = new TactodeLinkServer()
