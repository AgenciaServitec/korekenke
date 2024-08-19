import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";
import { setDocument, updateDocument } from "../firestore";

export const entitiesRef = firestore.collection("entities");

export const getEntityId = () => entitiesRef.doc().id;

export const fetchEntity = async (id) => fetchDocumentOnce(entitiesRef.doc(id));
export const fetchEntityByNameId = async (nameId) =>
  fetchCollectionOnce(
    entitiesRef
      .where("nameId", "==", nameId)
      .where("isDeleted", "==", false)
      .limit(1)
  );

export const fetchEntities = async () =>
  fetchCollectionOnce(entitiesRef.where("isDeleted", "==", false));

export const addEntity = async (entity) =>
  setDocument(entitiesRef.doc(entity.id), entity);

export const updateEntity = async (entityId, entity) =>
  updateDocument(entitiesRef.doc(entityId), entity);
