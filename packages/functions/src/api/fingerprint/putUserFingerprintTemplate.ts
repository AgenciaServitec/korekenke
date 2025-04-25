import { Request, Response } from "express";
import { fetchCollection, firestore } from "../../_firebase";
import { defaultFirestoreProps } from "../../utils";

interface Params {
  cip: string;
}

const { assignUpdateProps } = defaultFirestoreProps();

export const putUserFingerprintTemplate = async (
  req: Request<Params, unknown, User, unknown>,
  res: Response
): Promise<void> => {
  const { cip } = req.params;
  const { fingerprintTemplate } = req.body;

  try {
    const user = await fetchUserByCip(cip);

    const userWihtFingerprintTemplate = { ...user[0], fingerprintTemplate };

    await updateUser(assignUpdateProps(userWihtFingerprintTemplate));
    res.json();
  } catch (error) {
    console.error(error);
  }
};

const updateUser = async (user: User): Promise<void> => {
  await firestore
    .collection("users")
    .doc(user.id)
    .update({ ...user });
};

const fetchUserByCip = async (cip: string | null): Promise<User[]> =>
  await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("cip", "==", cip)
      .limit(1)
  );
