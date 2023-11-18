import { firestore } from "../index";
import { fetchDocumentOnce } from "../firestore";

export const principalCategoriesRef = firestore.collection("documents");

export const getPrincipalCategoryId = () => principalCategoriesRef.doc().id;

export const fetchPrincipalCategory = async (id) =>
  fetchDocumentOnce(principalCategoriesRef.doc(id));
