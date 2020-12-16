const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');
const Robot = require('./robot');
const TactodeLinkWebSocket = require('./tactode-link-websocket');

class Tactode {

    static get EXTENSION_ID () {
        return 'tactode';
    }

    constructor (runtime) {
        this.runtime = runtime;

        this._socket = new TactodeLinkWebSocket('Web');
        this._socket.setHandleMessage(() => {
            console.log("Handle Message Tactode extension")
        })
        this._socket.open();

        this._peripheral = new Robot(this.runtime, Tactode.EXTENSION_ID)
    }

    
    // getTargets () {
    //     this.targets = [ {
    //         text: 'mouse pointer',
    //         value: '0'
    //     }];
    //     let counter = 1;
    //     const actualTarget = this.runtime.getEditingTarget();


    //     if (actualTarget === undefined || actualTarget === null)
    //         return this.targets;

    //     // substitute value 10
    //     for (let i = 0; i < 10; i++) {
    //         const value = this.runtime.getTargetByDrawableId(i)
    //         if (value !== undefined && !value.isStage && 
    //             value.sprite.name !== actualTarget.sprite.name) {
    //             const obj = {};
    //             obj.text = value.sprite.name;
    //             obj.value = counter.toString();
    //             this.targets.push(obj);
    //             counter++;
    //         }
    //     }
    //     return this.targets;
    // }

    /**
     * @return {object} This extension's metadata.
     */
    getInfo () {
        return {
            id: Tactode.EXTENSION_ID,

            // opcional
            color1: '#444f82',
            color2: '#363f6b',
            
            name: 'Tactode',

            blocks: [
                {
                    opcode: 'sensor',
                    blockType: BlockType.REPORTER,
                    text: 'line distance'
                },
                {
                    opcode: 'goForward',
                    blockType: BlockType.COMMAND,
                    text: 'go forward'
                },
                {
                    opcode: 'turn',
                    blockType: BlockType.COMMAND,
                    text: 'turn [ANGLE]',
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'stop',
                    blockType: BlockType.COMMAND,
                    text: 'stop'
                }
            ]
        };
    }

    sensor () {
        this._socket.sendMessage({
            message: 'Sensor message'
        })
        return 2;
    }

    goForward () {
        console.log("Send go forward message ");
        
        this._socket.sendMessage({
            message: 'Go forward message'
        })
    }

    turn (args) {
        const angle = Cast.toNumber(args.ANGLE);
        console.log("Send angle message with " + angle);
        
        this._socket.sendMessage({
            message: 'Turn angle',
            angle: angle
        })
    }

    stop () {
        console.log("Send stop message");
        this._socket.sendMessage({
            message: 'Stop message'
        })
    }
}

module.exports = Tactode