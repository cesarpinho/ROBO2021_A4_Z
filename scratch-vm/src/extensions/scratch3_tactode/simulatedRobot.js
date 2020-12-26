const Base64Util = require("../../util/base64-util");
const RateLimiter = require("../../util/rateLimiter");
const TactodeLinkWebSocket = require("./tactode-link-websocket");

const RATE_LIMITER = 40

class SimulatedRobot {
    constructor (runtime, extensionID) {
        /**
         * @type {Runtime}
         */
        this._runtime = runtime;
        this._runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));
        this._sensor = 0;

        this._socket = null;
        this._runtime.configureScratchLinkSocketFactory(new TactodeLinkWebSocket);
        this._runtime.registerPeripheralExtension(extensionID, this);

        this._rateLimiter = new RateLimiter(RATE_LIMITER);

        this._onMessage = this._onMessage.bind(this);
    }

    get sensor () {
        return this._sensor;
    }

    stopAll () {
        if (this.isConnected)
            this.send({message: 'Stop'});
    }

    connect () {
        this._socket = new TactodeLinkWebSocket('Web');
        this._socket.setHandleMessage(this._onMessage);
        this._socket.open();
    }

    disconnect () {
        if (this._socket) {
            this._socket.close();
        }

        this.reset();
    }

    reset () {
        this._sensor = 0;
    }

    isConnected () {
        let connected = false;
        if (this._socket) {
            connected = this._socket.isOpen();
        }
        return connected;
    }

    send (message, useLimiter = true) {
        if (!this.isConnected()) return Promise.resolve();

        if (useLimiter && !this._rateLimiter.okayToSend()) return Promise.resolve();

        return this._socket.sendMessage(message);

        // ? Nedeed encode message? 
        // return this._socket.sendMessage({
        //     message: Base64Util.uint8ArrayToBase64(message),
        //     encoding: 'base64'
        // });
    }

    _onMessage () {
        // TODO: Parse reply messages
        console.log("message parsed")
    }

}

module.exports = SimulatedRobot