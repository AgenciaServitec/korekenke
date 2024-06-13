import React, { createContext, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components";
import { orderBy } from "lodash";
import { usersByRoleCode } from "../utils";
import { InitialEntities } from "../data-list";

const GlobalDataContext = createContext({
  commands: [],
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
  livestockAndEquines: [],
});

export const GlobalDataProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const commands = InitialEntities?.[0]?.organs?.[0]?.commands || [];

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

  const [
    livestockAndEquines = [],
    livestockAndEquinesLoading,
    livestockAndEquinesError,
  ] = useCollectionData(
    firestore
      .collection("livestock-and-equines")
      .where("isDeleted", "==", false) || null
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
    officesError ||
    livestockAndEquinesError;

  const loading =
    entitiesLoading ||
    rolesAclsLoading ||
    usersLoading ||
    correspondencesLoading ||
    departmentsLoading ||
    sectionsLoading ||
    officesLoading ||
    livestockAndEquinesLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="100vh" />;

  return (
    <GlobalDataContext.Provider
      value={{
        commands: orderBy(commands, (command) => [command.name], ["asc"]),
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
        correspondences: orderBy(correspondences, ["createAt"], ["desc"]),
        livestockAndEquines,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
