import React, { createContext, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components";
import { orderBy } from "lodash";
import { usersByRoleCode } from "../utils";

const GlobalDataContext = createContext({
  users: [],
  departmentUsers: [],
  sectionUsers: [],
  officeUsers: [],
  entities: [],
  departments: [],
  sections: [],
  rolesAcls: [],
  offices: [],
  correspondences: [],
});

export const GlobalDataProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [rolesAcls = [], rolesAclsLoading, rolesAclsError] = useCollectionData(
    authUser
      ? firestore.collection("roles-acls").where("isDeleted", "==", false)
      : null
  );

  const [users = [], usersLoading, usersError] = useCollectionData(
    authUser
      ? firestore.collection("users").where("isDeleted", "==", false)
      : null
  );

  const [entities = [], entitiesLoading, entitiesError] = useCollectionData(
    authUser
      ? firestore.collection("entities").where("isDeleted", "==", false)
      : null
  );

  const [departments = [], departmentsLoading, departmentsError] =
    useCollectionData(
      authUser
        ? firestore.collection("departments").where("isDeleted", "==", false)
        : null
    );

  const [sections = [], sectionsLoading, sectionsError] = useCollectionData(
    authUser
      ? firestore.collection("sections").where("isDeleted", "==", false)
      : null
  );

  const [offices = [], officesLoading, officesError] = useCollectionData(
    authUser
      ? firestore.collection("offices").where("isDeleted", "==", false)
      : null
  );

  const [correspondences = [], correspondencesLoading, correspondencesError] =
    useCollectionData(
      firestore.collection("correspondences").where("isDeleted", "==", false) ||
        null
    );

  const error =
    entitiesError ||
    rolesAclsError ||
    usersError ||
    correspondencesError ||
    departmentsError ||
    sectionsError ||
    officesError;

  const loading =
    entitiesLoading ||
    rolesAclsLoading ||
    usersLoading ||
    correspondencesLoading ||
    departmentsLoading ||
    sectionsLoading ||
    officesLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="100vh" />;

  return (
    <GlobalDataContext.Provider
      value={{
        users: orderBy(users, (user) => [user.createAt], ["desc"]),
        departmentUsers: orderBy(
          usersByRoleCode(users, ["department_boss", "department_assistant"]),
          (user) => [user.createAt],
          ["desc"]
        ),
        sectionUsers: orderBy(
          usersByRoleCode(users, ["section_boss", "section_assistant"]),
          (user) => [user.createAt],
          ["desc"]
        ),
        officeUsers: orderBy(
          usersByRoleCode(users, ["office_boss", "office_assistant"]),
          (user) => [user.createAt],
          ["desc"]
        ),
        entities,
        departments,
        sections,
        rolesAcls,
        offices,
        correspondences: orderBy(
          correspondences,
          (document) => [document.createAt],
          ["desc"]
        ),
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
