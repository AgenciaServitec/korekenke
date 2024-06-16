import React, { createContext, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components";
import { orderBy } from "lodash";
import { usersByRoleCode } from "../utils";
import { INITIAL_HIGHER_ENTITIES } from "../data-list";
import {
  correspondencesRef,
  departmentsRef,
  entitiesRef,
  livestockAndEquinesRef,
  sectionsRef,
  usersRef,
} from "../firebase/collections";
import { useCommand } from "./CommandProvider";

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
  const { currentCommand } = useCommand();

  const commands = INITIAL_HIGHER_ENTITIES?.[0]?.organs?.[0]?.commands || [];

  const [rolesAcls = [], rolesAclsLoading, rolesAclsError] = useCollectionData(
    authUser
      ? firestore.collection("roles-acls").where("isDeleted", "==", false)
      : null
  );

  const [users = [], usersLoading, usersError] = useCollectionData(
    authUser && currentCommand
      ? usersRef
          .where("isDeleted", "==", false)
          .where("initialCommand.id", "==", currentCommand.id)
      : null
  );

  const [entities = [], entitiesLoading, entitiesError] = useCollectionData(
    authUser && currentCommand
      ? entitiesRef
          .where("isDeleted", "==", false)
          .where("commandId", "==", currentCommand.id)
      : null
  );

  const [departments = [], departmentsLoading, departmentsError] =
    useCollectionData(
      authUser ? departmentsRef.where("isDeleted", "==", false) : null
    );

  const [sections = [], sectionsLoading, sectionsError] = useCollectionData(
    authUser ? sectionsRef.where("isDeleted", "==", false) : null
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
    livestockAndEquinesRef.where("isDeleted", "==", false) || null
  );

  const [correspondences = [], correspondencesLoading, correspondencesError] =
    useCollectionData(
      correspondencesRef.where("isDeleted", "==", false) || null
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
