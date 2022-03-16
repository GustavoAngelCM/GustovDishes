import admin from "firebase-admin"

const serviceAccount = require("./gustov-restaurant-firebase-adminsdk-4zyum-53c9978985.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const fireDB = admin.firestore();