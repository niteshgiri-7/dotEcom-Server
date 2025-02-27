import admin from "firebase-admin";
import firesbaseAdminService from "../../firebaseAdminService.json" with { type: "json" };
admin.initializeApp({
    credential: admin.credential.cert(firesbaseAdminService),
});
export default admin;
