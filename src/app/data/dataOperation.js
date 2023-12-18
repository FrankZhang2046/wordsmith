const admin = require('firebase-admin');
const serviceAccount = require('./wordsmith-vocabulary-builder-firebase-adminsdk-tl8hp-3df4ebe0cc');
const dictionary = require('./dictionary.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({
  host: 'localhost:8080',
  ssl: false
});

// 1. create a list of words from dictionary.json
const vocabCollectionRef = db.collection('vocabularies');
const wordList = Object.keys(dictionary);
// 2. loop through the word list, use `counter` to track how many words have been added to the batch
async function writeRecords() {
  let batch = db.batch();
  let counter = 0;

  for (let index = 0; index < wordList.length; index++) {
    const word = wordList[index];
    const docRef = vocabCollectionRef.doc();
    batch.set(docRef, {
      word,
      definition: dictionary[word]
    });
    counter++;

    // 3. if `counter` === 500, we commit the batch
    if (counter === 500) {
      try {
        await batch.commit();
        console.log(`last word is ${index} ${wordList[index]}`);
      } catch (error) {
        console.log(`Error when committing batch`)
      }
      counter = 0;
      batch = db.batch();
    }

  }
  // 4. handle the last batch commit 
  if (counter > 0) {
    try {
      await batch.commit();
      console.log(`all words added to db.`);
    } catch (error) {
      console.log(`Error when committing batch`)
    }
  }
}

// writeRecords();

vocabCollectionRef.get()
  .then(snapshot => {
    console.log(`${snapshot.size} in collection, ${wordList.length} words in dict.`)
  });
