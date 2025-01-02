import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBXn3SWpn9U3DRL7M5VlDzewEXS1_b-LcI",
    authDomain: "health-records-a8382.firebaseapp.com",
    projectId: "health-records-a8382",
    storageBucket: "health-records-a8382.firebasestorage.app",
    messagingSenderId: "398389347012",
    appId: "1:398389347012:web:bbad227972752ca67a7f91",
    measurementId: "G-D788ZJDL9P"
  };

const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export default app;
