const WebSocket = require('ws')

class TactodeLinkClient {  
    
    constructor(type = 'Web') {       
        this._type = type
    }

    open() {
        switch (this._type) {
            case 'Web':
                this._ws = new WebSocket('ws://localhost:8081') // Simulator: Define Url
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
        this.sendMessage("asdasd")
        console.log('TACTODE-LINK-CLIENT :: Connection established with Tactode WebSocket Server')
    }

    _onClose() {
        console.log('TACTODE-LINK-CLIENT :: Connection terminated with Tactode WebSocket Server')
    }

    _onError(error) {
        console.log(`TACTODE-LINK-CLIENT :: ${error}`)
    }

    _onMessage(e) {        
        const json = JSON.parse(e.data)
        this._handleMessage(json)
    }

}

module.exports = TactodeLinkClient