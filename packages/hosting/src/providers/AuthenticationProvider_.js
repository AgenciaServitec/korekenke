// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { firebase, auth, firestore } from "../firebase";
// import { isError } from "lodash";
// import { useDocument } from "react-firebase-hooks/firestore";
// import { notification, Spinner } from "../components";
//
// const AuthenticationContext = createContext({
//   authUser: null,
//   login: () => Promise.reject("Unable to find AuthenticationProvider."),
//   logout: () => Promise.reject("Unable to find AuthenticationProvider."),
//   loginLoading: false,
// });
//
// export const useAuthentication = () => useContext(AuthenticationContext);
//
// export const AuthenticationProvider = ({ children }) => {
//   const [authenticating, setAuthenticating] = useState(true);
//   const [authUser, setAuthUser] = useState(null);
//   const [firebaseUser, setFirebaseUser] = useState(null);
//   const [loginLoading, setLoginLoading] = useState(false);
//
//   const [userSnapshot, loadingUser, errorUser] = useDocument(
//     firebaseUser ? firestore.collection("users").doc(firebaseUser.uid) : null
//   );
//
//   useMemo(() => {
//     auth.onAuthStateChanged((currentUser) =>
//       currentUser ? setFirebaseUser(currentUser) : onLogout()
//     );
//   }, []);
//
//   useEffect(() => {
//     !loadingUser && userSnapshot && !errorUser && onLogin(userSnapshot?.data());
//   }, [loadingUser, userSnapshot]);
//
//   const onLogout = async () => {
//     setAuthenticating(true);
//
//     setAuthUser(null);
//     setFirebaseUser(null);
//     setAuthenticating(false);
//     setLoginLoading(false);
//   };
//
//   const onLogin = async (user) => {
//     try {
//       setLoginLoading(true);
//
//       if (!user) throw new Error("User doesn't exists");
//
//       setAuthUser(user);
//       setLoginLoading(false);
//       setAuthenticating(false);
//     } catch (error) {
//       console.error("Login", error);
//
//       if (isError(error)) {
//         notification({
//           type: "error",
//           title: error.message,
//         });
//       }
//
//       await logout();
//     }
//   };
//
//   const login = async (email, password) => {
//     try {
//       setLoginLoading(true);
//
//       await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
//
//       await auth.signInWithEmailAndPassword(email, password);
//     } catch (e) {
//       const error = isError(e) ? e : undefined;
//
//       console.error("singInUser:", e);
//
//       notification({
//         type: "error",
//         title: error.message,
//       });
//
//       setLoginLoading(false);
//     }
//   };
//
//   const logout = async () => {
//     sessionStorage.clear();
//     localStorage.clear();
//
//     return auth.signOut();
//   };
//
//   if (authenticating) return <Spinner height="100vh" />;
//
//   return (
//     <AuthenticationContext.Provider
//       value={{
//         authUser,
//         login,
//         logout,
//         loginLoading,
//       }}
//     >
//       {children}
//     </AuthenticationContext.Provider>
//   );
// };
