const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');
const Robot = require('./robot');

class Tactode {

    static get EXTENSION_ID () {
        return 'tactode';
    }

    constructor (runtime) {
        // 1. Instantiate TactodeLinkWebSocket class.
        // 2. Define handle message method
        // 3. Open connection with tactode link
        this.runtime = runtime;

        this._peripheral = new Robot(this.runtime, Tactode.EXTENSION_ID)
    }

    getTargets () {
        this.targets = [ {
            text: 'mouse pointer',
            value: '0'
        }];
        let counter = 1;
        const actualTarget = this.runtime.getEditingTarget();


        if (actualTarget === undefined || actualTarget === null)
            return this.targets;

        // substitute value 10
        for (let i = 0; i < 10; i++) {
            const value = this.runtime.getTargetByDrawableId(i)
            if (value !== undefined && !value.isStage && 
                value.sprite.name !== actualTarget.sprite.name) {
                const obj = {};
                obj.text = value.sprite.name;
                obj.value = counter.toString();
                this.targets.push(obj);
                counter++;
            }
        }
        return this.targets;
    }

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
                    opcode: 'turnMotorSeconds',
                    blockType: BlockType.COMMAND,
                    text: 'turn [MOTOR] motor for [SEC] seconds',
                    arguments: {
                        MOTOR: {
                            type: ArgumentType.STRING,
                            menu: 'menuMotor'
                        },
                        SEC: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'turnMotorRotation',
                    blockType: BlockType.COMMAND,
                    text: 'turn [MOTOR] motor for [ROTS] rotations',
                    arguments: {
                        MOTOR: {
                            type: ArgumentType.STRING,
                            menu: 'menuMotor'
                        },
                        ROTS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'moveToTarget',
                    blockType: BlockType.COMMAND,
                    text: 'move to [TARGET]',
                    arguments: {
                        TARGET: {
                            type: ArgumentType.STRING,
                            menu: 'menuTarget'
                        }
                    }
                },
                {
                    opcode: 'example',
                    blockType: BlockType.COMMAND,
                    text: 'move [STEPS] and rotate [ANGLE]',
                    arguments: {
                        STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 80
                        },
                        ANGLE: {
                            type: ArgumentType.ANGLE,
                        }
                    }
                }
            ],

            menus: {
                menuTarget: {
                    acceptReporters: true,
                    items: this.getTargets()
                },
                menuMotor: {
                    acceptReporters: false,
                    items: [
                        {
                            text: 'left',
                            value: 'l'
                        },
                        {
                            text: 'right',
                            value: 'r'
                        }
                    ]
                }
            }
        };
    }

    example (args, util) {
        const steps = Cast.toNumber(args.STEPS);
        const angle = Cast.toNumber(args.ANGLE);
        const radians = MathUtil.degToRad((90 - util.target.direction));
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        util.target.setXY(util.target.x + dx, util.target.y + dy);
        util.target.setDirection(util.target.direction + angle);
    }

    moveToTarget (args, util) {
        const target = Cast.toNumber(args.TARGET);
        if (target === 0) {
            util.target.setXY(util.ioQuery('mouse', 'getScratchX'),util.ioQuery('mouse', 'getScratchY'));
            return;
        }
        const targetName = this.targets[target].text;
        const goToTarget = this.runtime.getSpriteTargetByName(targetName);
        if (!goToTarget) return;
        util.target.setXY(goToTarget.x, goToTarget.y);
    }

    sensor () {
        console.log("Sensor position: 2");
        return 2;
    }

    turnMotorSeconds (args, util) {
        const motorIndex = Cast.toString(args.MOTOR) === 'l' ? 0 : 1;
        const time = Cast.toNumber(args.SEC);
        console.log("Motor index " + motorIndex);
        console.log("Time " + time);
        
        util.target.setXY(util.target.x + time, util.target.y);
    }

    turnMotorRotation (args, util) {
        const motorIndex = Cast.toString(args.MOTOR) === 'l' ? 0 : 1;
        const rots = Cast.toNumber(args.ROTS);
        console.log("Motor index " + motorIndex);
        console.log("Rotations " + rots);
        
        util.target.setXY(util.target.x + rots*2, util.target.y);
    }
}

module.exports = Tactode