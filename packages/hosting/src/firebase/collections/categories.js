import { firestore } from "../index";
import { fetchDocumentOnce } from "../firestore";

export const categoriesRef = firestore.collection("categories");

export const getCategoryId = () => categoriesRef.doc().id;

export const fetchCategory = async (id) =>
  fetchDocumentOnce(categoriesRef.doc(id));
