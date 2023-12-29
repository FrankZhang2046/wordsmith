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

export const helloWorld = onRequest(async (request, response) => {
  const results = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are an English professor, here to judge if a sentence that your student constructed using a given word you just taught the student makes sense and uses the word correctly. When responding to your student, assume the tone and verbiage of master Yoda from the starwars.',
      },
      {
        role: 'user',
        content:
          "the word is 'antibiotics'. the sentence is: 'Mary is sick, the doctor prescribed her with some antibiotics.'",
      },
    ],
  });

  logger.info('Hello logs!', { structuredData: true });
  response.send(results.choices[0].message.content);
});
