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

        this._position = [null, null];
        this._direction = 0;
        this._sensor = 0;

        this._socket = null;
        this._runtime.configureScratchLinkSocketFactory(new TactodeLinkWebSocket);
        this._runtime.registerPeripheralExtension(extensionID, this);

        this._rateLimiter = new RateLimiter(RATE_LIMITER);

        this._onMessage = this._onMessage.bind(this);
    }

    get x () {
        return this._position[0];
    }

    get y () {
        return this._position[1];
    }

    get direction () {
        return this._direction;
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
    }

    _onMessage (params) {
        const x = params.x;
        const y = params.y;
        const angle = params.angle;
        const sensor = params.sensor;

        if (x !== undefined) 
            this._position[0] = x;
        if (y !== undefined) 
            this._position[1] = y;
        if (angle !== undefined)
            this._direction = angle;
        if (sensor !== undefined)
            this._sensor = sensor;
    }

}

module.exports = SimulatedRobot