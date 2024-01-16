// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAW6bxP66Cg8v7JmVGxll_95sbpaNYwSSg",
  authDomain: "wordsmith-vocabulary-builder.firebaseapp.com",
  projectId: "wordsmith-vocabulary-builder",
  storageBucket: "wordsmith-vocabulary-builder.appspot.com",
  messagingSenderId: "401318579949",
  appId: "1:401318579949:web:2680d8f4947fdd803c06e4",
  measurementId: "G-PX3C2ZLDCQ"
};

firebase.initializeApp(firebaseConfig);


// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Customize the notification here
  const notificationTitle = 'background notification';
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
