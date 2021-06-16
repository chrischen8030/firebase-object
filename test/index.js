const admin = require('firebase-admin');

const serviceAccount = require('./config/firebase.server.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const docRef = db.collection('users').doc('alovelace');

docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815
});