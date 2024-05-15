import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { useDefaultFirestoreProps } from "../../hooks";

export const usersRef = firestore.collection("users");

export const getUserId = () => usersRef.doc().id;

export const fetchUser = async (id) => fetchDocumentOnce(usersRef.doc(id));

export const fetchUsers = async () =>
  fetchCollectionOnce(usersRef.where("isDeleted", "==", false));

export const updateUsersWithBatch = async (users = []) => {
  const { assignUpdateProps } = useDefaultFirestoreProps();

  const batch = firestore.batch();

  users.forEach((user) =>
    batch.update(
      firestore.collection("users").doc(user.id),
      assignUpdateProps(user)
    )
  );

  return await batch.commit();
};
