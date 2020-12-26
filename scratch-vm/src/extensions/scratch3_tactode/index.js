const ArgumentType = require('../../extension-support/argument-type')
const BlockType = require('../../extension-support/block-type')

const Cast = require('../../util/cast')
const SimulatedRobot = require('./simulatedRobot')

class Scratch3Tactode {

    static get EXTENSION_ID () {
        return 'tactode'
    }

    constructor (runtime) {
        this.runtime = runtime
        this._peripheral = new SimulatedRobot(this.runtime, Scratch3Tactode.EXTENSION_ID)
        this._peripheral.connect()

    }


    /**
     * @return {object} This extension's metadata.
     */
    getInfo () {
        return {
            id: Scratch3Tactode.EXTENSION_ID,

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
                    text: 'turn [DIRECTION]',
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'menuDirection',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'rotate',
                    blockType: BlockType.COMMAND,
                    text: 'rotate [ANGLE]',
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 15
                        }
                    }
                },
                {
                    opcode: 'stop',
                    blockType: BlockType.COMMAND,
                    text: 'stop'
                }
            ],
            menus: {
                menuDirection: {
                    items: [
                        {
                            text: 'left',
                            value: 0
                        },
                        {
                            text: 'right',
                            value: 1
                        }
                    ]
                }
            }
        }
    }

    sensor () {
        this._peripheral.send({
            message: 'Sensor message'
        })

        // ! The value returned isn't the more recent replied 
        return this._peripheral.sensor
    }

    goForward () {
        console.log("Send go forward message ")
        
        this._peripheral.send({
            message: 'Go forward'
        })
    }

    turn (args) {
        const direction = Cast.toNumber(args.DIRECTION)
        console.log("Send turn message with value " + direction)

        this._peripheral.send({
            message: 'Turn',
            direction: direction
        })

    }

    rotate (args) {
        const angle = Cast.toNumber(args.ANGLE)
        console.log("Send rotate message with value " + angle)

        this._peripheral.send({
            message: 'Rotate',
            angle: angle
        })
    }

    stop () {
        console.log("Send stop message")
        this._peripheral.stopAll()
    }
}

module.exports = Scratch3Tactode