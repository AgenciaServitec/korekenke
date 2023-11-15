import { firestore } from "../index";
import { fetchDocumentOnce } from "../firestore";

export const brandsRef = firestore.collection("brands");

export const getBrandId = () => brandsRef.doc().id;

export const fetchBrand = async (id) => fetchDocumentOnce(brandsRef.doc(id));
