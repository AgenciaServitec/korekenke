import { readFileSync } from "fs";
import path from "path";

const htmlTemplate = (url: string): string =>
  readFileSync(path.join(__dirname, url)).toString();

export const template = {
  newDasApplicationEmailTemplate: htmlTemplate(
    "./newDasApplicationEmailTemplate.html"
  ),
  dasRequestFinalizedEmailTemplate: htmlTemplate(
    "./dasRequestFinalizedEmailTemplate.html"
  ),
  dasRequestNotProceedsEmailTemplate: htmlTemplate(
    "./dasRequestNotProceedsEmailTemplate.html"
  ),
  verifyEmailSendCodeEmailTemplate: htmlTemplate(
    "./verifyEmailSendCodeEmailTemplate.html"
  ),
  militaryServiceRecruitmentFinalizedEmailTemplate: htmlTemplate(
    "./militaryServiceRecruitmentFinalizedEmailTemplate.html"
  ),
};
