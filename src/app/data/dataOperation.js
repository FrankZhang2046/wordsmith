const admin = require('firebase-admin');
const serviceAccount = require('./wordsmith-vocabulary-builder-firebase-adminsdk-tl8hp-3df4ebe0cc.json');
const dictionary = require('./dictionary.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({
  host: 'localhost:8080',
  ssl: false
});

const collectionRef = db.collection('vocabularies');
const wordList = Object.keys(dictionary);

async function writeRecords() {
  let batch = db.batch();
  let count = 0;
  let batchCount = 0;

  for (let index = 0; index < wordList.length; index++) {
    const word = wordList[index];
    const docRef = collectionRef.doc();
    batch.set(docRef, {
      word: word,
      definition: dictionary[word]
    });
    count++;

    if (count >= 500) {
      try {
        await batch.commit();
        console.log(`Batch ${++batchCount} committed successfully. Last word is ${index} ${wordList[index]}`);
      } catch (error) {
        console.error(`Error committing batch ${batchCount}:`, error);
        // Handle specific error (e.g., retry logic, logging)
      }
      count = 0;
      batch = db.batch();
    }
  }

  // Commit the final batch
  if (count > 0) {
    try {
      await batch.commit();
      console.log(`Final batch committed successfully.`);
    } catch (error) {
      console.error('Error committing final batch:', error);
      // Handle specific error
    }
  }
}

// writeRecords()
//   .then(() => console.log('All data uploaded'))
//   .catch(error => console.error('Error during the upload process:', error));

collectionRef.get()
  .then(snapshot => {
    console.log(snapshot.size, Object.keys(dictionary).length);
  })
