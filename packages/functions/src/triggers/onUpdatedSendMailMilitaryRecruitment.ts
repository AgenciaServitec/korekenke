import { OnDocumentUpdated } from "./interface";
import assert from "assert";
import { sendMailMilitaryServiceRecruitmentFinalized } from "../mailer/korekenke/sendMailMilitaryServiceRecruitmentFinalized";

export const onUpdatedSendMailMilitaryRecruitment: OnDocumentUpdated = async (
  event
) => {
  const militaryRecruitment = event.data?.after.data() as
    | MilitaryRecruiment
    | undefined;

  assert(militaryRecruitment, "Missing militaryRecruitment");

  if (militaryRecruitment.status === "finalized") {
    await sendMailMilitaryServiceRecruitmentFinalized(militaryRecruitment);
  }
};
