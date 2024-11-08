import "moment-timezone";
import { app } from "./api";
import {
  onCreatedSendMailNotificationDasRequest,
  onUpdatedSendMailDasRequest,
  onTriggerCleanSessionVerification,
  onUpdatedSendMailMilitaryRecruitment,
} from "./triggers";
import functionsHttps = require("firebase-functions/v2/https");
import functionsTrigger = require("firebase-functions/v2/firestore");
import functionScheduler = require("firebase-functions/v2/scheduler");

type HttpsOptions = functionsHttps.HttpsOptions;
type TriggersOptions = functionsTrigger.DocumentOptions;
type ScheduleOptions = functionScheduler.ScheduleOptions;

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

const scheduleOptions = (
  schedule: string,
  options?: Partial<ScheduleOptions>
): ScheduleOptions => ({
  schedule: schedule || "0 1 * * *",
  memory: "256MiB",
  timeoutSeconds: 540,
  timeZone: "America/Lima",
  ...options,
});

exports.api = functionsHttps.onRequest(httpsOptions(), app);

exports.onCreatedSendMailNotificationDasRequest =
  functionsTrigger.onDocumentCreated(
    triggersOptions("das-applications/{id}"),
    onCreatedSendMailNotificationDasRequest
  );

exports.onUpdatedSendMailDasRequest = functionsTrigger.onDocumentUpdated(
  triggersOptions("das-applications/{id}"),
  onUpdatedSendMailDasRequest
);

exports.onUpdatedSendMailMilitaryRecruitment =
  functionsTrigger.onDocumentUpdated(
    triggersOptions("military-recruitment/{id}"),
    onUpdatedSendMailMilitaryRecruitment
  );

exports.onTriggerCleanSessionVerification = functionsTrigger.onDocumentCreated(
  triggersOptions("session-verification/{id}"),
  onTriggerCleanSessionVerification
);
