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
  token: 'flnGgQM5vlckl1kWTMAjNc:APA91bGM1UzR368XnrHRU-uAip1z58ZFirImKTOJTfcF_efvqjE8jJRv1zmGclw9eN2Sy2qA7eBPJkIHBdIcCKpMruBGAqw4VpOmrYV8OtdZtV2oTvznchIVdqsvBV6vFnPWFS6qXtbG'
}
admin.messaging().send(message)
  .then((res) => {
    console.log(`successfully sent message`, res);
  })
  .catch((err) => {
    console.log(`error sending message`, err);
  });
