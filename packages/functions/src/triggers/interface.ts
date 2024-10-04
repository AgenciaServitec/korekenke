import firestoreV2 = require("firebase-functions/v2/firestore");

export type OnDocumentWritten = (
  event: firestoreV2.FirestoreEvent<
    firestoreV2.Change<firestoreV2.DocumentSnapshot> | undefined
  >
) => void | Promise<void>;

export type OnDocumentUpdated = (
  event: firestoreV2.FirestoreEvent<
    firestoreV2.Change<firestoreV2.DocumentSnapshot> | undefined
  >
) => void | Promise<void>;

export type OnDocumentCreated = (
  event: firestoreV2.FirestoreEvent<
    firestoreV2.QueryDocumentSnapshot | undefined
  >
) => void | Promise<void>;

export type OnDocumentDeleted = (
  event: firestoreV2.FirestoreEvent<
    firestoreV2.QueryDocumentSnapshot | undefined
  >
) => void | Promise<void>;
