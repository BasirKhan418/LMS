
import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUyw49yZBMzcAIdA56VuyTmfT00eKUOVY",
  authDomain: "devsomeware-3d0c9.firebaseapp.com",
  projectId: "devsomeware-3d0c9",
  storageBucket: "devsomeware-3d0c9.firebasestorage.app",
  messagingSenderId: "791953599551",
  appId: "1:791953599551:web:e21bae4ccfcad220715c8a",
  measurementId: "G-TLJ5TYYG3K"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };