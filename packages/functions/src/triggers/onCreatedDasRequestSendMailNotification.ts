import { OnDocumentCreated } from "./interface";
import { sendMailDasRequestNotification } from "../mailer/korekenke";
import assert from "assert";
import { logger } from "../utils";

export const OnCreatedDasRequestSendMailNotification: OnDocumentCreated =
  async (event) => {
    const dasApplication = event.data?.data() as DasApplication | undefined;

    assert(dasApplication, "Missing dasApplication!");

    logger.log("dasApplication: ", dasApplication);

    await sendMailDasRequestNotification(dasApplication);
  };
