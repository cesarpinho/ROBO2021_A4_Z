const WebSocket = require('ws')

/**
 * This class provides a TactodeLinkSocket implementation using WebSockets,
 * attempting to connect with the locally installed Tactode-Link.
 *
 * To connect with TactodeLink without WebSockets, you must implement all of the
 * public methods in this class.
 * - open()
 * - close()
 * - setOn[Open|Close|Error]
 * - setHandleMessage
 * - sendMessage(msgObj)
 * - isOpen()
 */
class TactodeLinkWebSocket {

    constructor(type = 'Web') {       
        this._type = type
    }

    open() {
        switch (this._type) {
            case 'Web':
                this._ws = new WebSocket('ws://localhost:8080') // TactodeLink: Define Url
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
        this._ws.send(JSON.stringify(message))
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
        this.sendMessage("Teste")
        console.log('TACTODE-LINK-WEBSOCKET :: Connection established with Tactode WebSocket Server')
    }

    _onClose() {
        console.log('TACTODE-LINK-WEBSOCKET :: Connection terminated with Tactode WebSocket Server')
    }

    _onError(error) {
        console.log(`TACTODE-LINK-WEBSOCKET :: ${error}`)
    }

    _onMessage(e) {        
        const json = JSON.parse(e.data)
        this._handleMessage(json)
    }

}

let sample = new TactodeLinkWebSocket()

sample.setHandleMessage(function() {
    console.log("Enviou")
})

sample.open() 

// module.exports = TactodeLinkWebSocket
