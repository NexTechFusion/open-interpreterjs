const Interpreter = require('./package/interpreter');

const interpreter = new Interpreter("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", {
    debug: true,
    maxRetry: 3
});

const input = "Plot AAPL and META's normalized stock prices in a HTML file";
// const input = "extract all email addresses from the website nextechfusion.com and save it as emails.txt file";
interpreter.execute(input)
    .then(result => {
    })
    .catch(error => {
        console.error(error.message);
    });