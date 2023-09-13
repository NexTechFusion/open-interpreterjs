const Interpreter = require('./package/interpreter');

const interpreter = new Interpreter("API-KEY", {
    debug: true,
    maxRetry: 3
});
const input = "extract all email addresses from the website mmmake.com and save it as emails.txt file";
interpreter.execute(input)
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error(error.message);
    });