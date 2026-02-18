const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Check if serviceAccountKey.json exists, otherwise use environment variables or mock
let serviceAccount;
try {
  serviceAccount = require('../../serviceAccountKey.json');
} catch (error) {
  console.warn('Warning: serviceAccountKey.json not found. Firebase Admin might not work without CREDENTIALS.');
}

if (serviceAccount || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin Initialized');
    }
} else {
    console.warn('Firebase Admin NOT initialized. Missing credentials.');
}

module.exports = admin;
