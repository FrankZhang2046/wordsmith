const admin = require('firebase-admin');
const serviceAccount = require('./wordsmith-vocabulary-builder-firebase-adminsdk-tl8hp-3df4ebe0cc');
const dictionary = require('./dictionary.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const message = {
  notification: {
    title: 'wordsmith is my app',
    body: 'wordsmith is my app'
  },
  token: 'emgW_nDJK2mvkctDRoeMKp:APA91bGcYEh6FmEqZFWHmKEjVdGnf8DUJRrqFXq82Vb3DVgh6ttT6YgZYgg_LDCEyjrcZqK6Fouynmigge3__T_fcibYCwtyer9OUPdxlE7Me8AvFUIAetgtMdg4bfpRXojY_lbHhOf2'
}
admin.messaging().send(message)
  .then((res) => {
    console.log(`successfully sent message`, res);
  })
  .catch((err) => {
    console.log(`error sending message`, err);
  });
