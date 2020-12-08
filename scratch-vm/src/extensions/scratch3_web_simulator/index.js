const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');

class Simulator {
    constructor (runtime) {
        this.runtime = runtime;
    }

    /**
     * @return {object} This extension's metadata.
     */
    getInfo () {
        return {
            id: 'simulator',

            // opcional
            color1: '#444f82',
            color2: '#363f6b',
            
            name: 'Web Simulator',

            blocks: [
                {
                    // Required: the machine-readable name of this operation.
                    // This will appear in project JSON.
                    opcode: 'example',

                    // Required: the kind of block we're defining, from a predefined list.
                    // Fully supported block types:
                    //   BlockType.BOOLEAN - same as REPORTER but returns a Boolean value
                    //   BlockType.COMMAND - a normal command block, like "move {} steps"
                    //   BlockType.HAT - starts a stack if its value changes from falsy to truthy ("edge triggered")
                    //   BlockType.REPORTER - returns a value, like "direction"
                    // Block types in development or for internal use only:
                    //   BlockType.BUTTON - place a button in the block palette
                    //   BlockType.CONDITIONAL - control flow, like "if {}" or "if {} else {}"
                    //     A CONDITIONAL block may return the one-based index of a branch to
                    //     run, or it may return zero/falsy to run no branch.
                    //   BlockType.EVENT - starts a stack in response to an event (full spec TBD)
                    //   BlockType.LOOP - control flow, like "repeat {} {}" or "forever {}"
                    //     A LOOP block is like a CONDITIONAL block with two differences:
                    //     - the block is assumed to have exactly one child branch, and
                    //     - each time a child branch finishes, the loop block is called again.
                    blockType: BlockType.COMMAND,

                    // Required for CONDITIONAL blocks, ignored for others: the number of
                    // child branches this block controls. An "if" or "repeat" block would
                    // specify a branch count of 1; an "if-else" block would specify a
                    // branch count of 2.
                    // branchCount: 0,

                    // Required: the human-readable text on this block, including argument
                    // placeholders. Argument placeholders should be in [MACRO_CASE] and
                    // must be [ENCLOSED_WITHIN_SQUARE_BRACKETS].
                    text: 'move [STEPS] and rotate [ANGLE]',

                    // Required: describe each argument.
                    // Argument order may change during translation, so arguments are
                    // identified by their placeholder name. In those situations where
                    // arguments must be ordered or assigned an ordinal, such as interaction
                    // with Scratch Blocks, arguments are ordered as they are in the default
                    // translation (probably English).
                    arguments: {
                        // Required: the ID of the argument, which will be the name in the
                        // args object passed to the implementation function.
                        STEPS: {
                            // Required: type of the argument / shape of the block input
                            type: ArgumentType.NUMBER,

                            defaultValue: 80
                        },
                        ANGLE: {
                            type: ArgumentType.ANGLE,
                        }
                    },

                    // Optional: the function implementing this block.
                    // If absent, assume `func` is the same as `opcode`.
                    // func: 'myReporter2'
                }
            ]
        };
    }

    /**
     * Implement myReporter.
     * @param {object} args - the block's arguments.
     * @property {string} MY_ARG - the string value of the argument.
     * @returns {string} a string which includes the block argument value.
     */
    myReporter (args) {
        return 'Letter ' + args.LETTER_NUM + ' of ' +
        args.TEXT + ' is ' + args.TEXT.charAt(args.LETTER_NUM) + '.';
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
}

module.exports = Simulator