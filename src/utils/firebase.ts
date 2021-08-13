import admin from "firebase-admin";

var serviceAccount = require(`${process.cwd()}/firebase-admin-sdk.json`);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export async function getFirebaseUserFromIdToken (idToken:string){
    try {
        return await admin.auth().verifyIdToken(idToken);
    } catch (err) {
        console.log(err);
        return null;
    }
}
