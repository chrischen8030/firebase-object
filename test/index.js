const admin = require('firebase-admin');

const serviceAccount = require('./config/firebase.server.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


const firebase = require('../src/model/firebase.model');
const FirebaseModel = firebase.FirebaseModel;
const model = new FirebaseModel(admin,`ylWajkg5vdF7fzFLX5Tv`);
model.paths.push('test');
model.data = {}
model.get().then(()=>{
  // console.log(model);
})