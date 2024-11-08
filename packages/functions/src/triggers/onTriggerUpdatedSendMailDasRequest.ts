import { OnDocumentUpdated } from "./interface";
import assert from "assert";
import {
  sendMailDasRequestNotProceeds,
  sendMailDasRequestFinalized,
} from "../mailer/korekenke";
import { sendMailMilitaryServiceRecruitmentFinalized } from "../mailer/korekenke/sendMailMilitaryServiceRecruitmentFinalized";

export const onTriggerUpdatedSendMailDasRequest: OnDocumentUpdated = async (
  event
) => {
  const dasApplication = event.data?.after.data() as DasApplication | undefined;
  const militaryRecruitment = event.data?.after.data() as
    | MilitaryRecruiment
    | undefined;

  assert(dasApplication, "Missing dasApplication");
  assert(militaryRecruitment, "Missing militaryRecruitment");

  if (dasApplication.status === "notProceeds") {
    await sendMailDasRequestNotProceeds(dasApplication);
  }

  if (dasApplication.status === "finalized") {
    await sendMailDasRequestFinalized(dasApplication);
  }

  if (militaryRecruitment.status === "finalized") {
    await sendMailMilitaryServiceRecruitmentFinalized(militaryRecruitment);
  }
};
