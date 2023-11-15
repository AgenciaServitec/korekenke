import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import {
  currentConfig,
  common,
  contactData,
  currentEnvironment,
} from "../config";

firebase.initializeApp(currentConfig.firebaseApp);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

const { version, apiUrl } = currentConfig;

console.log(currentEnvironment, ":", version);

export {
  currentConfig,
  firebase,
  version,
  common,
  contactData,
  auth,
  firestore,
  storage,
  apiUrl,
};
