import { firestore } from "../../_firebase";
import { NextFunction, Request, Response } from "express";
import { defaultFirestoreProps, logger } from "../../utils";

const { assignUpdateProps } = defaultFirestoreProps();

type CorrespondenceBody = OmitDefaultFirestoreProps<Correspondence>;

export const postCorrespondence = async (
  req: Request<unknown, unknown, CorrespondenceBody, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body: correspondence } = req;

  logger.log("「Post correspondence」Initialize", {
    params: req.params,
    body: req.body,
  });

  try {
    const correspondenceId = firestore.collection("correspondences").doc().id;

    await addCorrespondence(correspondenceId, correspondence);

    res.sendStatus(200).end();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const addCorrespondence = async (
  correspondenceId: string,
  correspondence: CorrespondenceBody
): Promise<void> => {
  await firestore
    .collection("correspondences")
    .doc(correspondenceId)
    .set(assignUpdateProps({ ...correspondence, id: correspondenceId }));
};
