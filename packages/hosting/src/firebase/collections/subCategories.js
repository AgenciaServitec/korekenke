import { firestore } from "../index";
import { fetchDocumentOnce } from "../firestore";

export const subCategoriesRef = firestore.collection("sub-categories");

export const getSubCategoryId = () => subCategoriesRef.doc().id;

export const fetchSubCategory = async (id) =>
  fetchDocumentOnce(subCategoriesRef.doc(id));
