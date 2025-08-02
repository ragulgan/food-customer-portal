import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// production ====>'BHKpOkcIBVVVnUM7kfI5PDltCigFYNz1vrj2DOtDooXOZ-pnX72N4-NXFOFRDkPBlUHJ1O-0z4XqNLe4wvijBa8'
// development====>'BJWsmqhB0lwNYUO3NaRGkFMqzfkagTjl2R3CdL8a21HVayB5nASTrm2T7L-5fpo0aVYrAu3LSmxKpoH33caKIVU'

export const RequestForToken = () => {
    return getToken(messaging, { vapidKey: 'BJWsmqhB0lwNYUO3NaRGkFMqzfkagTjl2R3CdL8a21HVayB5nASTrm2T7L-5fpo0aVYrAu3LSmxKpoH33caKIVU' })
        .then((currentToken) => {
            if (currentToken) {
                sessionStorage.setItem("FCM", currentToken)
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};

initializeApp(firebaseConfig); 

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});