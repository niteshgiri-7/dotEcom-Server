import admin, { ServiceAccount } from "firebase-admin";
import firesbaseAdminService from "../../firebaseAdminService.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(firesbaseAdminService as ServiceAccount),
});

export default admin;
