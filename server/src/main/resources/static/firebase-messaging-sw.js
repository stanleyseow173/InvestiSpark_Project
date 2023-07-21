// // importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.min.js');
// // importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.min.js');

// // import { getMessaging } from 'firebase/messaging';
// // import { initializeApp } from 'firebase/app';

// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
// import { getMessaging, onBackgroundMessage, isSupported } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-sw.js';

// // firebase.initializeApp({
// //     apiKey: "AIzaSyACGJkKS1Je2-Ph59YyBdEWKkA6iOiC1yA",
// //     authDomain: "investispark-6909a.firebaseapp.com",
// //     projectId: "investispark-6909a",
// //     storageBucket: "investispark-6909a.appspot.com",
// //     messagingSenderId: "894216379970",
// //     appId: "1:894216379970:web:978ed1f8d5d533283c97db",
// //     measurementId: "G-J7QTJ6Z3XK"
// // })

// // const messaging = firebase.messaging();

// // importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js');
// // importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js');

// const app = initializeApp({
//     apiKey: "AIzaSyACGJkKS1Je2-Ph59YyBdEWKkA6iOiC1yA",
//     authDomain: "investispark-6909a.firebaseapp.com",
//     projectId: "investispark-6909a",
//     storageBucket: "investispark-6909a.appspot.com",
//     messagingSenderId: "894216379970",
//     appId: "1:894216379970:web:978ed1f8d5d533283c97db",
//     measurementId: "G-J7QTJ6Z3XK"
// })

// // const firebaseConfig = {
// //     apiKey: "AIzaSyACGJkKS1Je2-Ph59YyBdEWKkA6iOiC1yA",
// //     authDomain: "investispark-6909a.firebaseapp.com",
// //     projectId: "investispark-6909a",
// //     storageBucket: "investispark-6909a.appspot.com",
// //     messagingSenderId: "894216379970",
// //     appId: "1:894216379970:web:978ed1f8d5d533283c97db",
// //     measurementId: "G-J7QTJ6Z3XK"
// //   };

// // firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// // const messaging = firebase.messaging();

// // messaging.onBackgroundMessage(payload => {
// //   console.log('Received background message ', payload);

// //   const notificationTitle = payload.notification.title;
// //   const notificationOptions = {
// //     body: payload.notification.body,
// //   };

// //   self.registration.showNotification(notificationTitle, notificationOptions);
// // });

// isSupported().then(isSupported => {

//     if (isSupported) {
  
//       const messaging = getMessaging(app);
  
//       onBackgroundMessage(messaging, ({ notification: { title, body, image } }) => {
//         self.registration.showNotification(title, { body, icon: image || '/assets/icons/icon-72x72.png' });
//       });
  
//     }
  
//   });