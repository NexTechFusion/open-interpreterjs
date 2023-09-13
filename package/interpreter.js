
const { runShell, executeNodeCodeEval } = require('./code-runner');
const LangChainLLM = require('./llm');
const { parseResultToList } = require('./parser');
const { promptTemplate, errorPromptTemplate } = require('./prompt-templates');

class Interpreter {
    constructor(apiKey, options = { debug: false, maxRetry: 3 }) {
        this.options = options;
        this.llm = new LangChainLLM({ apiKey });
        this.maxRetry = options.maxRetry;
        this.retryCount = 0;
    }

    handleError(error) {

        const message = error.message || error;

        if (this.options?.debug) {
            console.log("======= Error =======");
            console.log(message);
        }

        if (this.retryCount > this.maxRetry) {
            throw new Error(message);
        }

        this.llm.addSystemMessage("ERROR: " + message);

        this.retryCount++;
        this.tryFixLlmCall();
    }

    async execute(input, isInitial = true) {
        try {
            const prompt = isInitial ? promptTemplate.replace("{GOAL}", input) : input;
            const res = await this.llm.execute(prompt);
            const parsed = await this.parseResult(res.response);
            await this.proceedResult(parsed);
        } catch (e) {
            this.handleError(e);
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async proceedResult(parsed) {
        try {
            let isDone = false;
            let lastValue = {};
            for (let parsedItem of parsed) {


                this.llm.addHuman("Im executing now : " + parsedItem.txt);

                if (parsedItem.isText) {

                    if (this.options?.debug) {
                        console.log("======= Info =======");
                    }

                    console.log(parsedItem.txt);
                } else if (
                    parsedItem.codeType == "shell" ||
                    parsedItem.txt.startsWith('npm') ||
                    parsedItem.txt.includes('npm install') ||
                    parsedItem.txt.includes('npm i')) {

                    if (this.options?.debug) {
                        console.log("======= Shell execution =======");
                        console.log(parsedItem.txt);
                    }

                    await runShell(parsedItem.txt);
                } else {

                    if (this.options?.debug) {
                        console.log("======= Node execution =======");
                        console.log(parsedItem.txt);
                    }

                    lastValue = await executeNodeCodeEval(parsedItem.txt, lastValue ?? {});
                }

                if (parsedItem.txt.includes('DONE')) {
                    if (this.options?.debug) {
                        console.log("======= DONE =======");
                    }
                    isDone = true;
                    return;
                }
            }

            await this.sleep(2000);


            if (!isDone) {
                this.execute("Proceed on doing the next steps");
            }

        }
        catch (e) {
            await this.sleep(2000);
            this.handleError(e);
        }
    }

    async parseResult(result) {
        try {
            const list = parseResultToList(result);
            return list;
        } catch (e) {
            this.handleError("Could not parse result - make a new plan");
        }
    }

    async tryFixLlmCall() {
        try {
            const res = await this.llm.execute(errorPromptTemplate);
            const parsed = await this.parseResult(res.response);
            await this.proceedResult(parsed);
        } catch (e) {
            this.handleError(e)
        }
    }
}

module.exports = Interpreter;
