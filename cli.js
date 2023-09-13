#!/usr/bin/env node
const yargs = require('yargs');
const Interpreter = require('./package/interpreter'); // Import the Interpreter class

const interpreter = new Interpreter();

yargs.command({
    command: 'intpreterjs <input>',
    describe: 'Code interpreter in nodejs',
    builder: (yargs) => {
        yargs.positional('input', {
            describe: 'What should the interpreter do',
            type: 'string',
        });
    },
    handler: async (argv) => {
        const { input } = argv;
        try {
            const result = await interpreter.execute(input);
            console.log(result);
        } catch (error) {
            console.error(error.message);
        }
    },
});

yargs.parse();
