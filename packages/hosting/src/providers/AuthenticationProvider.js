import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { includes, isError, isObject, orderBy } from "lodash";
import { notification, Spinner } from "../components";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { rolesAclsRef, usersRef } from "../firebase/collections";
import { authPersistence } from "../firebase/auth";
import { InitialEntities } from "../data-list";

const AuthenticationContext = createContext({
  authUser: null,
  loginWithEmailAndPassword: () =>
    Promise.reject("Unable to find AuthenticationProvider."),
  logout: () => Promise.reject("Unable to find AuthenticationProvider."),
  loginLoading: false,
});

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [loginLoading, setLoginLoading] = useState(false);

  const { firebaseUser, firebaseUserLoading } = useFirebaseUser();

  const [user, userLoading, userError] = useDocumentData(
    firebaseUser ? usersRef.doc(firebaseUser.uid) : null
  );

  const [rolesAcls, rolesAclsLoading, rolesAclsError] =
    useCollectionData(rolesAclsRef);

  const authLoading = firebaseUserLoading || userLoading;
  const authError = userError;
  const authEmptyData = !user;

  const authUser =
    !authLoading && !authError && !authEmptyData
      ? mapAuthUser(user, rolesAcls)
      : null;

  useEffect(() => {
    authError && logout();
  }, [authError]);

  useEffect(() => {
    rolesAclsError && notification({ type: "error", title: rolesAclsError });
  }, []);

  useEffect(() => {
    if (isAuthUserError(authUser)) {
      notification({ type: "warning", title: authUser.message });

      logout();
    }
  }, [JSON.stringify(authUser)]);

  const loginWithEmailAndPassword = async (email, password) => {
    try {
      setLoginLoading(true);

      await auth.setPersistence(authPersistence.LOCAL);
      await auth.signInWithEmailAndPassword(email, password);

      setLoginLoading(false);
    } catch (e) {
      const error = isError(e) ? e : undefined;

      notification({
        type: "error",
        title: "Login error",
        description: error?.message,
      });

      setLoginLoading(false);
    }
  };

  const logout = async () => {
    sessionStorage.clear();
    localStorage.clear();

    return auth.signOut();
  };

  if (authLoading && location.pathname !== "/") return <Spinner fullscreen />;

  return (
    <AuthenticationContext.Provider
      value={{
        authUser: isAuthUser(authUser) ? authUser : null,
        loginWithEmailAndPassword,
        logout,
        loginLoading: loginLoading || rolesAclsLoading,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

const useFirebaseUser = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firebaseUserLoading, setFirebaseUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      setFirebaseUserLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { firebaseUser, firebaseUserLoading };
};

const mapAuthUser = (user, rolesAcls) => {
  const authUserRole = findAuthUserRole(user, rolesAcls);

  if (!authUserRole) return mapAuthUserError("You don't have an assigned role");

  const commands = InitialEntities?.[0]?.organs?.[0]?.commands || [];

  const authUserCommands =
    user.roleCode === "super_admin"
      ? commands
      : findAuthUserCommands(user, commands);

  const [initialCommand] = orderBy(
    authUserCommands,
    [(command) => command.name],
    ["asc"]
  );

  return {
    ...user,
    role: authUserRole,
    commands: authUserCommands,
    initialCommand: initialCommand,
  };
};

const mapAuthUserError = (message) => ({
  type: "error",
  message,
});

const isAuthUser = (data) => isObject(data) && "id" in data;

const isAuthUserError = (data) =>
  isObject(data) && "type" in data && data.type === "error";

const findAuthUserRole = (user, rolesAcls = []) =>
  rolesAcls.find((roleAcl) => roleAcl.id === user.roleCode);

const findAuthUserPathnames = (user) =>
  (user?.acls || []).map((acl) => acl.split("#")[0]);

const findAuthUserCommands = (user, commands = []) =>
  commands.filter((command) => includes(user?.commandsIds || [], command.id));
