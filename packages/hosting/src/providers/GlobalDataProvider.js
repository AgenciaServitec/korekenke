import React, { createContext, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components";
import { orderBy } from "lodash";

const GlobalDataContext = createContext({
  users: [],
  principalCategories: [],
  categories: [],
  subCategories: [],
  products: [],
});

export const GlobalDataProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [users = [], usersLoading, usersError] = useCollectionData(
    authUser
      ? firestore.collection("users").where("isDeleted", "==", false)
      : null
  );

  const [
    principalCategories = [],
    principalCategoriesLoading,
    principalCategoriesError,
  ] = useCollectionData(
    firestore
      .collection("principal-categories")
      .where("isDeleted", "==", false) || null
  );

  const [categories = [], categoriesLoading, categoriesError] =
    useCollectionData(
      firestore.collection("categories").where("isDeleted", "==", false) || null
    );

  const [subCategories = [], subCategoriesLoading, subCategoriesError] =
    useCollectionData(
      firestore.collection("sub-categories").where("isDeleted", "==", false) ||
        null
    );

  const [brands = [], brandsLoading, brandsError] = useCollectionData(
    firestore.collection("brands").where("isDeleted", "==", false) || null
  );

  const [products = [], productsLoading, productsError] = useCollectionData(
    firestore.collection("products").where("isDeleted", "==", false) || null
  );

  const error =
    usersError ||
    principalCategoriesError ||
    categoriesError ||
    subCategoriesError ||
    brandsError ||
    productsError;

  const loading =
    usersLoading ||
    principalCategoriesLoading ||
    categoriesLoading ||
    subCategoriesLoading ||
    brandsLoading ||
    productsLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="100vh" />;

  return (
    <GlobalDataContext.Provider
      value={{
        users: orderBy(users, (user) => [user.createAt], ["desc"]),
        principalCategories: orderBy(
          principalCategories,
          (principalCategory) => [principalCategory.createAt],
          ["desc"]
        ),
        categories: orderBy(categories, (category) => [category.createAt], [
          "desc",
        ]),
        subCategories: orderBy(
          subCategories,
          (subCategory) => [subCategory.createAt],
          ["desc"]
        ),
        brands: orderBy(brands, (brand) => [brand.createAt], ["desc"]),
        products: orderBy(products, (product) => [product.createAt], ["desc"]),
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
