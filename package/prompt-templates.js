const preInstalledPackages = "pupeteer, cheerio, axios, fs";

const fewShotTemplate = `
const axios = require('axios');
const cheerio = require('cheerio');
const websiteUrl = 'https://www.mmmake.com';

async function fetchEmails() {
  try {
    const response = await axios.get(websiteUrl);
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
      const emails = html.match(emailPattern);

     return emails;
  } catch (error) {
    throw new Error(e);
  }
}

const emails = await fetchEmails();
state = { emails };
`;





const promptTemplate = `
Act as an expert in nodejs and write me code snippets to make this possible : {GOAL}.

Your NodeJs code must be promise based with **await ...**, NEVER use then() because i will exectute it in an async function.
Take a break if you write to much code we will continue later.
Reponse code as mardown format.

Write **DONE** in your last line to indicate that you are done.

Response me now please : 
`;

const errorPromptTemplate = `
 Resolve the previouse error and rewrite your plan after the step of the error.
 Strictly reponse only the newly written steps and code not the already executed steps

 New Steps :

`;

module.exports = { promptTemplate, errorPromptTemplate }
