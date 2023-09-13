
const { spawn } = require('child_process');
let globalState = {};


async function executeNodeCodeEval(code, {}) {
    return new Promise(async (resolve, reject) => {
        try {

            const cheerio = require('cheerio');
            const Puppeteer = require('puppeteer');
            const puppeteer = require('puppeteer');
            const axios = require('axios');
            const fs = require('fs');

            let state = globalState;

            const asyncCode = `
            (async () => {
                ${code}
            }
            )();
            `;

            const res = await eval(asyncCode);
            resolve(res);
        } catch (error) {
            console.error('Error executing code:', error);
            reject(error);
        }
    });
}

const runShell = (command, timeout = 300000) => {
    return new Promise((resolve, reject) => {
        const child = spawn(removeComments(command), { shell: true, stdio: 'inherit' });

        child.on('exit', async (code, signal) => {
            if (code === 0) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                resolve();
            } else {
                reject(`Command exited with code ${code} and signal ${signal}`);
            }
        });

        setTimeout(() => {
            child.kill();
            reject('Command execution timed out.');
        }, timeout);
    });
};

function removeComments(txt) {
    let lines = txt.split('\n');
    let newLines = [];

    for (let line of lines) {
        let newLine = line.replace(/\/\/.*|\/\*.*\*\//g, '');
        newLines.push(newLine);
    }

    return newLines.join('\n');
}

module.exports = {
    executeNodeCodeEval,
    runShell
};