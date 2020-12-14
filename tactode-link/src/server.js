const WebSocket = require('ws');

let connections = new Map()
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws, request) => {
  connections.set(ws, request.url.substring(7))
  console.log(`TACTODE-LINK-WEBSOCKET :: Connection established with ${connections.get(ws)}`)

  ws.on('message', (message) => {  
    console.log(`TACTODE-LINK-WEBSOCKET :: Received the following message from ${connections.get(ws)}: ${message}`)
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {        
        client.send(message)
        console.log(`TACTODE-LINK-WEBSOCKET :: Sending the following message to ${connections.get(client)}: ${message}`)
      }
    })
  })

  ws.on('close', () => {  
    console.log(`TACTODE-LINK-WEBSOCKET :: Connection terminated with ${connections.get(ws)}`)
  })

  ws.on('error', (error) => {  
    console.log(`TACTODE-LINK-WEBSOCKET :: ${error}`)
  })

});