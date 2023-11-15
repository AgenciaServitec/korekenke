import { firestore } from "../index";
import { fetchCollectionOnce, fetchDocumentOnce } from "../firestore";

export const productsRef = firestore.collection("products");

export const getProductId = () => productsRef.doc().id;

export const fetchProduct = async (id) =>
  fetchDocumentOnce(productsRef.doc(id));

export const fetchProducts = async (active) =>
  fetchCollectionOnce(
    productsRef.where("active", "==", active).where("isDeleted", "==", false)
  );
