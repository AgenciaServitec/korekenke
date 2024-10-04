import { NextFunction, Request, Response } from "express";
import { fetchDocument, firestore } from "../_firebase";
import assert from "assert";
import { sendMailNotificationDasRequest } from "../mailer/korekenke";
import { logger } from "../utils";

interface Params {
  dasRequestId: string;
}

export const onResendMailNotificationDasRequest = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    params: { dasRequestId },
  } = req;

  try {
    const dasRequest = await fetchDasRequest(dasRequestId);
    assert(dasRequest, "Missing dasRequest!");

    await sendMailNotificationDasRequest(dasRequest);

    res.send(200).end();
  } catch (e) {
    logger.log(e);
    next(e);
  }
};

const fetchDasRequest = async (
  dasRequestId: string
): Promise<DasApplication | undefined> => {
  return await fetchDocument(
    firestore.collection("das-applications").doc(dasRequestId)
  );
};
