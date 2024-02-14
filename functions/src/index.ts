/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */
/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { OpenAI } from 'openai';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const evaluateSentence = onRequest(
  { cors: true, secrets: ['API_KEY'] },
  async (request, response) => {
    console.log(`api key is: `, process.env.API_KEY);
    const openai = new OpenAI({
      apiKey: process.env.API_KEY,
    });
    const results = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "You are an English professor, here to judge if a sentence that your student constructed using a given word you just taught the student makes sense and uses the word correctly. When responding, format your response as a JSON literal in this format: {correct: boolean, // this represents if the sentence is grammatically, semantically, and syntactically correct feedback: string, // this is your feedback, example: string, // optional, provide an example sentence if the student had previously constructed an incorrect sentence}, be strict about the grammar. You should be strict with the grammatical and semantic correctness of the student's constructed sentence, but don't be unreasonable.  If the student's sentence is semantically or grammatically incorrect, in your response provide an example sentence as the value for the `example` key, else omit the `example` key.Adhere to the provided json literal format in your response. Example sentence should be provided as the value of the example key. In the JSON literal, the feedback property has to have value. ",
        },
        {
          role: 'user',
          content: `the word is '${request.body.word}'. the sentence is: '${
            request.body.sentence
          }', please ${
            request.body.provideExample ? 'do' : 'do not'
          } provide an example sentence.`,
        },
      ],
    });

    response.setHeader('Content-Type', 'application/json');
    response.send(results.choices[0].message.content);
  }
);

export const testChronJob = onRequest({ cors: true }, (request, response) => {
  logger.log('req body: ', request.body.text);
  response.setHeader('Content-Type', 'application/json');
  response.send({ status: 'success', message: request.body.text });
});
