import "moment-timezone";
import { app } from "./api";
import functionsHttps = require("firebase-functions/v2/https");
import functionsTrigger = require("firebase-functions/v2/firestore");
import { OnCreatedDasRequestSendMailNotification } from "./triggers";

type HttpsOptions = functionsHttps.HttpsOptions;
type TriggersOptions = functionsTrigger.DocumentOptions;

const httpsOptions = (httpsOptions?: Partial<HttpsOptions>): HttpsOptions => ({
  timeoutSeconds: 540,
  memory: "256MiB",
  maxInstances: 10,
  ...httpsOptions,
});

const triggersOptions = (
  document: string,
  triggerOptions?: Partial<TriggersOptions>
): TriggersOptions => ({
  document,
  timeoutSeconds: 540,
  memory: "256MiB",
  ...triggerOptions,
});

exports.api = functionsHttps.onRequest(httpsOptions(), app);

exports.onCreatedDasRequestSendMailNotification =
  functionsTrigger.onDocumentCreated(
    triggersOptions("das-applications/{id}"),
    OnCreatedDasRequestSendMailNotification
  );
