import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";
import { usersRef } from "./users";

export const activitiesRef = (userId) =>
  usersRef.doc(userId).collection("activities");

export const getActivityId = (userId) => activitiesRef(userId).doc().id;

export const fetchActivity = async (userId, activityId) =>
  fetchDocumentOnce(activitiesRef(userId).doc(activityId));

export const fetchActivities = async (userId) =>
  fetchCollectionOnce(activitiesRef(userId).where("isDeleted", "==", false));

export const addActivity = async (userId, activity) =>
  setDocument(activitiesRef(userId).doc(activity.id), activity);

export const updateActivity = async (userId, activity) =>
  updateDocument(activitiesRef(userId).doc(activity.id), activity);
