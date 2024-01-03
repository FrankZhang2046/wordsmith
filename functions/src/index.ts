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

const openai = new OpenAI({
  apiKey: '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',
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest(
  { cors: true },
  async (request, response) => {
    const results = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "You are an English professor, here to judge if a sentence that your student constructed using a given word you just taught the student makes sense and uses the word correctly. When responding, format your response as a JSON literal in this format: {correct: boolean, // this represents if the sentence is gramatically, and syntactically correct feedback: string, // this is your feedback}, be strict about the grammar. You should be strict with the grammatical and semantic correctness of the student's constructed sentence, but don't be unreasonable.",
        },
        {
          role: 'user',
          content: `the word is '${request.body.word}'. the sentence is: '${request.body.sentence}'`,
        },
      ],
    });

    logger.info(`request is: `, request.body);
    logger.info(`result is: `, results.choices[0].message.content);
    response.setHeader('Content-Type', 'application/json');
    console.log(`response is: `, results.choices[0].message.content);
    response.send(results.choices[0].message.content);
  }
);
