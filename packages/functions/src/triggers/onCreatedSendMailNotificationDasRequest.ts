import { OnDocumentCreated } from "./interface";
import { sendMailNotificationDasRequest } from "../mailer/korekenke";
import assert from "assert";
import { logger } from "../utils";

export const onCreatedSendMailNotificationDasRequest: OnDocumentCreated =
  async (event) => {
    const dasApplication = event.data?.data() as DasApplication | undefined;

    assert(dasApplication, "Missing dasApplication!");

    logger.log("dasApplication: ", dasApplication);

    await sendMailNotificationDasRequest(dasApplication);
  };
