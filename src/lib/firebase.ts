import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True khi đã cấu hình Firebase qua biến môi trường. */
export const isFirebaseEnabled = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | undefined;
let _db: Firestore | undefined;
let _auth: Auth | undefined;

if (isFirebaseEnabled) {
  app = getApps().length ? getApps()[0] : initializeApp(config);
  _db = getFirestore(app);
  _auth = getAuth(app);
}

export const db = _db;
export const auth = _auth;
