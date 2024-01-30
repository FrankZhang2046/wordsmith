const admin = require('firebase-admin');
const serviceAccount = require('./wordsmith-vocabulary-builder-firebase-adminsdk-tl8hp-c23b1c4597.json');
// const dictionary = require('./dictionary.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({
  host: 'localhost:8080',
  ssl: false
});

// 1. create a list of words from dictionary.json
// const vocabCollectionRef = db.collection('vocabularies');
// const wordList = Object.keys(dictionary);
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

// writeRecords()
//   .then(() => console.log('done'));

function printVocabSize() {
  vocabCollectionRef.get()
    .then(snapshot => {
      console.log(`${snapshot.size} in collection, ${wordList.length} words in dict.`)
    });
}

// printVocabSize();


const usersCollection = db.collection('users');

function resolveGhostDocuments() {
  usersCollection.listDocuments().then(documentRefs => {
    return db.getAll(...documentRefs);
  }).then(documentSnapshots => {
    for (let docSnap of documentSnapshots) {
      if (!docSnap.exists) {
        console.log(`Found a ghost document at '${docSnap.ref.path}'`);
        // Add a dummy field to this 'ghost' document
        docSnap.ref.set({
          dummyField: true
        });
      }
    }
  }).catch(error => {
    console.error("Error processing documents: ", error);
  });
}

function decrementMasteryLevel() {
  usersCollection.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      const updatePromises = [];
      snapshot.forEach(doc => {
        const userWordCol = db.collection(`users/${doc.id}/words`);
        console.log(`reading word bank for user `, doc.id);

        const userWordBankPromise = userWordCol.get().then(userWordBank => {
          const wordUpdatePromises = userWordBank.docs.map(wordDoc => {
            if (wordDoc.data().masteryLevel > 0) {
              const newMasteryLevel = wordDoc.data().masteryLevel - 1;
              console.log(`new masteryLevel for ${wordDoc.data().word}: `, newMasteryLevel);
              return wordDoc.ref.update({
                masteryLevel: newMasteryLevel
              });
            }
          });

          return Promise.all(wordUpdatePromises);
        });

        updatePromises.push(userWordBankPromise);
      });

      return Promise.all(updatePromises);
    })
    .then(() => {
      console.log('All words updated successfully.');
    })
    .catch(error => {
      console.error("Error getting documents or updating words: ", error);
    });
}

decrementMasteryLevel();
