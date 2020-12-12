const Base64Util = require("../../util/base64-util");
const RateLimiter = require("../../util/rateLimiter");
const uid = require("../../util/uid");
const TactodeLinkWebSocket = require("./tactode-link-websocket");

class RobotMotor {
    constructor (parent, index) {
        this._parent = parent;
        this._index = index;

        /**
         * This motor's current direction: 1 for "clockwise" or -1 for "counterclockwise"
         * @type {number}
         * @private
         */
        this._direction = 1;

        /**
         * This motor's current position, in the range [0,360].
         * @type {number}
         * @private
         */
        this._position = 0;
        this._commandID = null;
        this._coastDelay = 1000;
    }

    get direction () {
        return this._direction;
    }

    set direction (value) {
        if (value < 0) {
            this._direction = -1;
        } else {
            this._direction = 1;
        }
    }

    get position () {
        return this._position;
    }

    set position (array) {
        // TODO
        let value = array[0] + (array[1] * 256) + (array[2] * 256 * 256) + (array[3] * 256 * 256 * 256);
        if (value > 0x7fffffff) {
            value = value - 0x100000000;
        }
        this._position = value;
    }

    turnOnFor (milliseconds) {
        // TODO

        this._parent.send(null);

        this.coastAfter(milliseconds);
    }

    coastAfter (time) {
        // Set the motor command id to check before starting coast
        const commandId = uid();
        this._commandID = commandId;

        // Send coast message
        setTimeout(() => {
            // Do not send coast if another motor command changed the command id.
            if (this._commandID === commandId) {
                this.coast();
                this._commandID = null;
            }
        }, time + this._coastDelay); // add a delay so the brake takes effect
    }

    coast () {
        if (this._power === 0) return;

        const cmd = this._parent.generateCommand(
            //Ev3Command.DIRECT_COMMAND_NO_REPLY,
            [
            //  Ev3Opcode.OPOUTPUT_STOP,
            //  Ev3Args.LAYER,
                this._index, 
            //  Ev3Args.COAST
            ]
        );

        this._parent.send(cmd, false); // don't use rate limiter to ensure motor stops
    }
}

class Robot {
    constructor (runtime, extensionID) {
        /**
         * @type {Runtime}
         */
        this._runtime = runtime;
        this._runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));
        this._motorPorts = [];
        this._motors =  [null, null];
        this._sensor = 0;

        // Needed ?
        this._pollingInterval = 150;
        this._pollingIntervalID = null;
        this._pollingCounter = 0;

        this._socket = null;
        this._runtime.configureScratchLinkSocketFactory(new TactodeLinkWebSocket);
        this._runtime.registerPeripheralExtension(extensionID, this);

        // ! Create global varaible for limit
        this._rateLimiter = new RateLimiter(40);
        
        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
        
        // Needed ?
        // this._pollValues = this._pollValues.bind(this);
    }

    get sensor () {
        return this._sensor;
    }

    motor (index) {
        return this._motors[index];
    }

    stopAll () {
        // TODO
        return
    }

    /**
     * Called by the runtime when user wants to scan for an EV3 peripheral.
     */
    scan () {
        if (this._socket) {
            this._socket.disconnect();
        }
        // TODO: Create Socket
        // this._socket = new BT(this._runtime, this._extensionId, {
        //     majorDeviceClass: 8,
        //     minorDeviceClass: 1
        // }, this._onConnect, this.reset, this._onMessage);
    }

    connect (id) {
        if (this._socket) {
            //// this._bt.connectPeripheral(id, Ev3PairingPin);
            // TODO
        }
    }

    disconnect () {
        if (this._socket) {
            this._socket.disconnect();
        }

        this.reset();
    }

    reset () {
        this._motorPorts = [];
        this._motors =  [null, null];
        this._sensor = 0;

        if (this._pollingIntervalID) {
            window.clearInterval(this._pollingIntervalID);
            this._pollingIntervalID = null;
        }
    }

    isConnected () {
        let connected = false;
        if (this._bt) {
            connected = this._socket.isConnected();
        }
        return connected;
    }

    send (message, useLimiter = true) {
        if (!this.isConnected()) return Promise.resolve();

        if (useLimiter && !this._rateLimiter.okayToSend()) return Promise.resolve();

        return this._socket.sendMessage({
            message: Base64Util.uint8ArrayToBase64(message),
            encoding: 'base64'
        });
    }

    _onConnect () {
        this._pollingIntervalID = window.setInterval(this._pollValues, this._pollingInterval);
    }

    _onMessage () {
        // TODO: Parse reply messages
    }

}

module.exports = Robot