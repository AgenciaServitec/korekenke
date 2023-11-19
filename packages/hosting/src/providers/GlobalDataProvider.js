import React, { createContext, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components";
import { orderBy } from "lodash";

const GlobalDataContext = createContext({
  users: [],
  receptions: [],
});

export const GlobalDataProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [users = [], usersLoading, usersError] = useCollectionData(
    authUser
      ? firestore.collection("users").where("isDeleted", "==", false)
      : null
  );

  const [receptions = [], receptionsLoading, receptionsError] =
    useCollectionData(
      firestore.collection("receptions").where("isDeleted", "==", false) || null
    );

  const error = usersError || receptionsError;

  const loading = usersLoading || receptionsLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="100vh" />;

  return (
    <GlobalDataContext.Provider
      value={{
        users: orderBy(users, (user) => [user.createAt], ["desc"]),
        receptions: orderBy(receptions, (document) => [document.createAt], [
          "desc",
        ]),
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
