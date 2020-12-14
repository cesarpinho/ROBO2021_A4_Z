// const WebSocket = require('ws')

class TactodeLinkWebSocket {

    constructor(type = 'Web') {       
        this._type = type
    }

    open() {
        switch (this._type) {
            case 'Web':
                this._ws = new WebSocket('ws://localhost:8080?type=EXTENSION')
                break
            default:
                throw new Error(`Unknown TactodeLink Socket Type: ${this._type}`)
        }

        if (!this._handleMessage)
            throw new Error('Must set open, close, message and error handlers before calling open on the socket')

        this._ws.onopen = this._onOpen.bind(this)
        this._ws.onclose = this._onClose.bind(this)
        this._ws.onerror = this._onError.bind(this)
        this._ws.onmessage = this._onMessage.bind(this)        
    }
    
    isOpen() {
        return this._ws && this._ws.readyState === this._ws.OPEN
    }
    

    close() {
        this._ws.close()
        this._ws = null
    }

    sendMessage(message) {      
        const data = JSON.stringify(message)
        this._ws.send(data)
        console.log(`EXTENSION :: Sending the following message to Tactode WebSocket Server: ${data}`)    
    }

    // -------------------------------------------------------------------------------------- //
    // --------------------------------- Overriding Methods --------------------------------- //
    // -------------------------------------------------------------------------------------- //

    setOnOpen(fn) {
        this._onOpen = fn
    }

    setOnClose(fn) {
        this._onClose = fn
    }

    setOnError(fn) {
        this._onError = fn
    }

    setHandleMessage(fn) {
        this._handleMessage = fn
    }

    // ----------------------------------------------------------------------------------- //
    // --------------------------------- Default Methods --------------------------------- //
    // ----------------------------------------------------------------------------------- //

    _onOpen() {        
        console.log('EXTENSION :: Connection established with Tactode WebSocket Server')
    }

    _onClose() {
        console.log('EXTENSION :: Connection terminated with Tactode WebSocket Server')
    }

    _onError(error) {
        console.log(`EXTENSION :: ${error}`)
    }

    _onMessage(e) {        
        const json = JSON.parse(e.data)
        console.log(`EXTENSION :: Receiving the following message from Tactode WebSocket Server: ${e.data}`)
        this._handleMessage(json)
    }

}

module.exports = TactodeLinkWebSocket
