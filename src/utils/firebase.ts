import admin from "firebase-admin";

var serviceAccount = require(`${process.cwd()}/firebase-admin-sdk.json`);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
export default admin;