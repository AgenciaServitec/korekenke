export * from "./firestore";

import * as admin from "firebase-admin";

admin.initializeApp();

export const firestore = admin.firestore();
export const storage = admin.storage();
export const auth = admin.auth();

const projectId = process.env.GCLOUD_PROJECT;

export const bucketAtFunction = projectId + ".appspot.com";
export const firestoreFieldValue = admin.firestore.FieldValue;
export const firestoreTimestamp = admin.firestore.Timestamp;
