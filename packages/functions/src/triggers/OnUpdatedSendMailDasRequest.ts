import { OnDocumentUpdated } from "./interface";
import assert from "assert";
import {
  sendMailDasRequestNotProceeds,
  sendMailDasRequestFinalized,
} from "../mailer/korekenke";

export const OnUpdatedSendMailDasRequest: OnDocumentUpdated = async (event) => {
  const dasApplication = event.data?.after.data() as DasApplication | undefined;

  assert(dasApplication, "Missing dasApplication");

  if (dasApplication.status === "notProceeds") {
    await sendMailDasRequestNotProceeds(dasApplication);
  }

  if (dasApplication.status === "finalized") {
    await sendMailDasRequestFinalized(dasApplication);
  }
};
