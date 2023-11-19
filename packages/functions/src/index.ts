import "moment-timezone";
import { app } from "./api";
import functionsHttps = require("firebase-functions/v2/https");

type HttpsOptions = functionsHttps.HttpsOptions;

const httpsOptions = (httpsOptions?: Partial<HttpsOptions>): HttpsOptions => ({
  timeoutSeconds: 540,
  memory: "256MiB",
  maxInstances: 10,
  ...httpsOptions,
});

exports.api = functionsHttps.onRequest(httpsOptions(), app);
