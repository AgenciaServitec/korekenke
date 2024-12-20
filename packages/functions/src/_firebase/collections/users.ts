import { firestore } from "../index";
import { fetchCollection, fetchDocument } from "../firestore";

export const usersRef = firestore.collection("users");

export const getUserId = (): string => usersRef.doc().id;

export const fetchUser = async (userId: string): Promise<User | undefined> =>
  fetchDocument<User>(usersRef.doc(userId));

export const fetchUsers = async (): Promise<User[] | undefined> =>
  fetchCollection(usersRef.where("isDeleted", "==", false));

export const updateUser = (userId: string, user: Partial<User>) =>
  usersRef.doc(userId).update(user);
