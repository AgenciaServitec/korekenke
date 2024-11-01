import React, { createContext, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components";
import { orderBy } from "lodash";
import { INITIAL_HIGHER_ENTITIES } from "../data-list";
import {
  animalsRef,
  correspondencesRef,
  departmentsRef,
  entitiesRef,
  sectionsRef,
  unitsRef,
  usersRef,
} from "../firebase/collections";
import { useCommand } from "./CommandProvider";

const GlobalDataContext = createContext({
  commands: [],
  users: [],
  entities: [],
  units: [],
  departments: [],
  sections: [],
  rolesAcls: [],
  offices: [],
  correspondences: [],
  animals: [],
});

export const GlobalDataProvider = ({ children }) => {
  const { authUser } = useAuthentication();
  const { currentCommand } = useCommand();

  const commands = INITIAL_HIGHER_ENTITIES?.[0]?.organs?.[0]?.commands || [];
  const _currentCommandId = currentCommand?.id || null;

  const [rolesAcls = [], rolesAclsLoading, rolesAclsError] = useCollectionData(
    authUser
      ? firestore.collection("roles-acls").where("isDeleted", "==", false)
      : null,
  );

  const getUsersQueryByRoleCode = () => {
    if (!authUser) return null;
    let usersQuery = usersRef;

    if (authUser.roleCode !== "super_admin") {
      return usersQuery
        .where("commandsIds", "array-contains", currentCommand.id)
        .where("isDeleted", "==", false);
    }

    return usersQuery.where("isDeleted", "==", false);
  };

  const [users = [], usersLoading, usersError] = useCollectionData(
    authUser ? getUsersQueryByRoleCode() : null,
  );

  const [entities = [], entitiesLoading, entitiesError] = useCollectionData(
    authUser
      ? entitiesRef
          .where("isDeleted", "==", false)
          .where("commandId", "==", _currentCommandId)
      : null,
  );

  const [units = [], unitsLoading, unitsError] = useCollectionData(
    authUser
      ? unitsRef
          .where("isDeleted", "==", false)
          .where("commandId", "==", _currentCommandId)
      : null,
  );

  const [departments = [], departmentsLoading, departmentsError] =
    useCollectionData(
      authUser
        ? departmentsRef
            .where("isDeleted", "==", false)
            .where("commandId", "==", _currentCommandId)
        : null,
    );

  const [sections = [], sectionsLoading, sectionsError] = useCollectionData(
    authUser
      ? sectionsRef
          .where("isDeleted", "==", false)
          .where("commandId", "==", _currentCommandId)
      : null,
  );

  const [offices = [], officesLoading, officesError] = useCollectionData(
    authUser
      ? firestore
          .collection("offices")
          .where("isDeleted", "==", false)
          .where("commandId", "==", _currentCommandId)
      : null,
  );

  const [animals = [], animalsLoading, animalsError] = useCollectionData(
    _currentCommandId === "cologe"
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
    animalsError;

  const loading =
    entitiesLoading ||
    unitsLoading ||
    rolesAclsLoading ||
    usersLoading ||
    correspondencesLoading ||
    departmentsLoading ||
    sectionsLoading ||
    officesLoading ||
    animalsLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="100vh" />;

  return (
    <GlobalDataContext.Provider
      value={{
        commands: orderBy(commands, (command) => [command.name], ["asc"]),
        users: orderBy(users, (user) => [user.createAt], ["desc"]),
        entities: orderBy(entities, "createAt", "desc"),
        units: orderBy(units, "createAt", "desc"),
        departments: orderBy(departments, "createAt", "desc"),
        sections: orderBy(sections, "createAt", "desc"),
        rolesAcls: orderBy(rolesAcls, "createAt", "desc"),
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
