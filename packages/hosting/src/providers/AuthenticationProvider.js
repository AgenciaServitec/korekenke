import React, { createContext, useContext, useMemo, useState } from "react";
import { auth } from "../firebase";
import { isError } from "lodash";
import { notification, Spinner } from "../components";

const AuthenticationContext = createContext({
  authUser: null,
  logout: () => Promise.reject("Unable to find AuthenticationProvider."),
  loginLoading: false,
});

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [authenticating, setAuthenticating] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  useMemo(() => {
    auth.onAuthStateChanged((currentUser) => {
      console.log("currentUser: ", currentUser);

      return currentUser ? onLogin(currentUser) : onLogout();
    });
  }, []);

  // useEffect(() => {
  //   !loadingUser && userSnapshot && !errorUser && onLogin(userSnapshot?.data());
  // }, [loadingUser, userSnapshot]);

  const onLogout = async () => {
    setAuthenticating(true);

    setAuthUser(null);
    setAuthenticating(false);
    setLoginLoading(false);
  };

  const onLogin = async (user) => {
    try {
      setLoginLoading(true);

      if (!user) throw new Error("User doesn't exists");

      setAuthUser(user);
      setLoginLoading(false);
      setAuthenticating(false);
    } catch (error) {
      console.error("Login", error);

      if (isError(error)) {
        notification({
          type: "error",
          title: error.message,
        });
      }

      await logout();
    }
  };

  const logout = async () => {
    sessionStorage.clear();
    localStorage.clear();

    return auth.signOut();
  };

  if (authenticating) return <Spinner height="100vh" />;

  return (
    <AuthenticationContext.Provider
      value={{
        authUser,
        logout,
        loginLoading,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
