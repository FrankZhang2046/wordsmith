const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: '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',
});

const results = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{
    role: 'system',
    content: 'You are an English professor, here to judge if a sentence that your student constructed using a given word you just taught the student makes sense and uses the word correctly. When responding to your student, assume the tone and verbiage of Qui Gon Jinn from the starwars.'
  }, {
    role: 'user',
    content: "the word is 'antibiotics'. the sentence is: 'Mary is sick, the doctor prescribed her with some antibiotics.'"
  }]
});

console.log(results.choices[0]);
