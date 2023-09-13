const Interpreter = require('./package/interpreter');

const interpreter = new Interpreter("API-KEY", {
    debug: true,
    maxRetry: 3
});

const input = "extract all emails numbers from the website sap.com and save it as emails.txt file";
// const input = "extract all email addresses from the website nextechfusion.com and save it as emails.txt file";
interpreter.execute(input)
    .then(result => {
    })
    .catch(error => {
        console.error(error.message);
    });