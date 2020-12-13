const WebSocket = require('ws');
const TactodeLinkClient = require('./client');


class TactodeLinkServer {  

  constructor() {
    this._client = new TactodeLinkClient()

    this._client.setHandleMessage(function() {
      console.log("Buenas")
    })

    this._client.open()

    /// ------------

    this._wss = new WebSocket.Server({ port: 8080 })
    
    this._wss.on('connection', function connection(ws) {
      
      ws.on('message', function incoming(message) {
        console.log(message)
      });
    
      ws.send(JSON.stringify('something'));
    })

    
  }

}

let tet = new TactodeLinkServer()
