import * as functions from "firebase-functions";
import { app } from "./api";

exports.api = functions.https.onRequest(app);
