// import dictionary json file
const dictionary = require('./dictionary.json');
const fs = require('fs');
const listOfWords = Object.keys(dictionary);

// write listOfWords to a new ts file
fs.writeFileSync('listOfWords.ts', `export const listOfWords = ${JSON.stringify(listOfWords)};`);
