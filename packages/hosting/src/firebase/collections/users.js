import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { chunk } from "lodash";
import { updateDocument } from "../firestore";

export const usersRef = firestore.collection("users");

export const getUserId = () => usersRef.doc().id;

export const fetchUser = async (id) => fetchDocumentOnce(usersRef.doc(id));

export const fetchUsers = async () =>
  fetchCollectionOnce(usersRef.where("isDeleted", "==", false));

export const updateUsersWithBatch = async (users = []) => {
  const batch = firestore.batch();

  chunk(users, 400).forEach((users) =>
    users.forEach((user) =>
      batch.update(firestore.collection("users").doc(user.id), user)
    )
  );

  return await batch.commit();
};

export const updateUser = async (userId, user) =>
  updateDocument(usersRef.doc(userId), user);
