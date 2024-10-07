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
  animalsRef,
  sectionsRef,
  unitsRef,
  usersRef,
  modulesAdministratorRef,
} from "../firebase/collections";
import { useCommand } from "./CommandProvider";

const GlobalDataContext = createContext({
  commands: [],
  users: [],
  unitUsers: [],
  departmentUsers: [],
  sectionUsers: [],
  officeUsers: [],
  entities: [],
  units: [],
  departments: [],
  sections: [],
  rolesAcls: [],
  modulesAdministrator: [],
  offices: [],
  correspondences: [],
  animals: [],
});

export const GlobalDataProvider = ({ children }) => {
  const { authUser } = useAuthentication();
  const { currentCommand } = useCommand();

  const commands = INITIAL_HIGHER_ENTITIES?.[0]?.organs?.[0]?.commands || [];
  const _currentCommand = currentCommand?.id || null;

  const [rolesAcls = [], rolesAclsLoading, rolesAclsError] = useCollectionData(
    authUser
      ? firestore.collection("roles-acls").where("isDeleted", "==", false)
      : null,
  );

  const [
    modulesAdministrator = [],
    modulesAdministratorLoading,
    modulesAdministratorError,
  ] = useCollectionData(
    authUser
      ? modulesAdministratorRef
          .where("isDeleted", "==", false)
          .where("commandId", "==", _currentCommand)
      : null,
  );

  const [users = [], usersLoading, usersError] = useCollectionData(
    authUser ? usersRef.where("isDeleted", "==", false) : null,
  );

  const [entities = [], entitiesLoading, entitiesError] = useCollectionData(
    authUser
      ? entitiesRef
          .where("isDeleted", "==", false)
          .where("commandId", "==", _currentCommand)
      : null,
  );

  const [units = [], unitsLoading, unitsError] = useCollectionData(
    authUser
      ? unitsRef
          .where("isDeleted", "==", false)
          .where("commandId", "==", _currentCommand)
      : null,
  );

  const [departments = [], departmentsLoading, departmentsError] =
    useCollectionData(
      authUser
        ? departmentsRef
            .where("isDeleted", "==", false)
            .where("commandId", "==", _currentCommand)
        : null,
    );

  const [sections = [], sectionsLoading, sectionsError] = useCollectionData(
    authUser
      ? sectionsRef
          .where("isDeleted", "==", false)
          .where("commandId", "==", _currentCommand)
      : null,
  );

  const [offices = [], officesLoading, officesError] = useCollectionData(
    authUser
      ? firestore
          .collection("offices")
          .where("isDeleted", "==", false)
          .where("commandId", "==", _currentCommand)
      : null,
  );

  const [animals = [], animalsLoading, animalsError] = useCollectionData(
    _currentCommand === "cologe"
      ? animalsRef.where("isDeleted", "==", false)
      : null,
  );

  const [correspondences = [], correspondencesLoading, correspondencesError] =
    useCollectionData(
      correspondencesRef.where("isDeleted", "==", false) || null,
    );

  const error =
    entitiesError ||
    unitsError ||
    rolesAclsError ||
    usersError ||
    correspondencesError ||
    departmentsError ||
    sectionsError ||
    officesError ||
    animalsError ||
    modulesAdministratorError;

  const loading =
    entitiesLoading ||
    unitsLoading ||
    rolesAclsLoading ||
    usersLoading ||
    correspondencesLoading ||
    departmentsLoading ||
    sectionsLoading ||
    officesLoading ||
    animalsLoading ||
    modulesAdministratorLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="100vh" />;

  return (
    <GlobalDataContext.Provider
      value={{
        commands: orderBy(commands, (command) => [command.name], ["asc"]),
        users: orderBy(users, (user) => [user.createAt], ["desc"]),
        unitUsers: orderBy(
          usersByRoleCode(users, ["unit_boss", "unit_assistant"]),
          (user) => [user.createAt],
          ["desc"],
        ),
        departmentUsers: orderBy(
          usersByRoleCode(users, ["department_boss", "department_assistant"]),
          (user) => [user.createAt],
          ["desc"],
        ),
        sectionUsers: orderBy(
          usersByRoleCode(users, ["section_boss", "section_assistant"]),
          (user) => [user.createAt],
          ["desc"],
        ),
        officeUsers: orderBy(
          usersByRoleCode(users, ["office_boss", "office_assistant"]),
          (user) => [user.createAt],
          ["desc"],
        ),
        entities: orderBy(entities, "createAt", "desc"),
        units: orderBy(units, "createAt", "desc"),
        departments: orderBy(departments, "createAt", "desc"),
        sections: orderBy(sections, "createAt", "desc"),
        rolesAcls: orderBy(rolesAcls, "createAt", "desc"),
        modulesAdministrator: orderBy(modulesAdministrator, "createAt", "desc"),
        offices: orderBy(offices, "createAt", "desc"),
        correspondences: orderBy(correspondences, "createAt", "desc"),
        animals: orderBy(animals, "createAt", "desc"),
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
