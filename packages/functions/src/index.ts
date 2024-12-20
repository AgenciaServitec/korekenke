import "moment-timezone";
import { app } from "./api";
import {
  onTriggerCleanSessionVerification,
  onTriggerCreatedSendMailNotificationDasRequest,
  onTriggerUpdatedSendMailDasRequest,
  onTriggerUpdatedSendMailMilitaryRecruitment,
} from "./triggers";
import functionScheduler = require("firebase-functions/v2/scheduler");
import functionsHttps = require("firebase-functions/v2/https");
import functionsTrigger = require("firebase-functions/v2/firestore");
import { isProduction } from "./config";
import { onScheduleResetHolidayDaysForAllUsers } from "./schedules";

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
  schedule: isProduction ? schedule : "0 1 * * *",
  memory: "256MiB",
  timeoutSeconds: 540,
  timeZone: "America/Lima",
  ...options,
});

exports.api = functionsHttps.onRequest(httpsOptions(), app);

exports.onTriggerCreatedSendMailNotificationDasRequest =
  functionsTrigger.onDocumentCreated(
    triggersOptions("das-applications/{id}"),
    onTriggerCreatedSendMailNotificationDasRequest
  );

exports.onTriggerUpdatedSendMailDasRequest = functionsTrigger.onDocumentUpdated(
  triggersOptions("das-applications/{id}"),
  onTriggerUpdatedSendMailDasRequest
);

exports.onTriggerUpdatedSendMailMilitaryRecruitment =
  functionsTrigger.onDocumentUpdated(
    triggersOptions("military-recruitment/{id}"),
    onTriggerUpdatedSendMailMilitaryRecruitment
  );

exports.onTriggerCleanSessionVerification = functionsTrigger.onDocumentCreated(
  triggersOptions("session-verification/{id}"),
  onTriggerCleanSessionVerification
);

exports.onScheduleResetHolidayDaysForAllUsers = functionScheduler.onSchedule(
  scheduleOptions("59 23 31 * *"),
  onScheduleResetHolidayDaysForAllUsers
);
