importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
// production config
// const firebaseConfig = {
//     apiKey: "AIzaSyC5NWuCMvOoC_8APtc3t0XY4ueVqaBy4l0",
//     authDomain: "food-app-customer-production.firebaseapp.com",
//     projectId: "food-app-customer-production",
//     storageBucket: "food-app-customer-production.appspot.com",
//     messagingSenderId: "240045874205",
//     appId: "1:240045874205:web:5e40f5a81b1ea71992faf4",
//     measurementId: "G-6MH4L02L5Y"
// };

// Development config
const firebaseConfig = {
    apiKey: "AIzaSyA4NsW_c1fykvTcKTaYzD5WamPfkYp5Jm8",
    authDomain: "food-app-customer-portal.firebaseapp.com",
    projectId: "food-app-customer-portal",
    storageBucket: "food-app-customer-portal.appspot.com",
    messagingSenderId: "727624930047",
    appId: "1:727624930047:web:63cbbc5a7c7d12243572ca",
    measurementId: "G-JY2E09KRBB"
  };
firebase.initializeApp(firebaseConfig);
// Retrieve firebase messaging
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});