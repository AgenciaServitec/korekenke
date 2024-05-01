import React, { createContext, useContext, useState } from "react";
import { usersRef } from "../firebase/collections";
import { orderBy, uniq } from "lodash";
import moment from "moment/moment";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components";
import { useGlobalData } from "./GlobalDataProvider";

const ChangeDefaultRoleContext = createContext({
  changeDefaultRole: (role = null) => console.log("Change default role", role),
});

export const ChangeDefaultRoleProvider = ({ children }) => {
  const { rolesAcls } = useGlobalData();
  const { authUser } = useAuthentication();

  const [loadingChangeDefaultRole, setLoadingChangeDefaultRole] =
    useState(false);

  const onSaveUser = async (role) => {
    console.log(
      uniq(
        (rolesAcls || []).find((_role) => _role.id === role.code)?.acls || [
          "/home",
        ]
      )
    );

    await usersRef.doc(authUser.id).update({
      defaultRoleCode: role.code,
      acls: uniq(
        (rolesAcls || []).find((_role) => _role.id === role.code)?.acls || [
          "/home",
        ]
      ),
      otherRoles: orderBy(
        [
          ...authUser.otherRoles.filter((_role) => _role.code !== role.code),
          { ...role, updateAt: moment().format("YYYY-MM-DD HH:mm:ss") },
        ],
        "updateAt",
        "desc"
      ),
    });
  };

  const changeDefaultRole = async (role) => {
    try {
      setLoadingChangeDefaultRole(true);
      await onSaveUser(role);
      notification({
        type: "success",
        title: (
          <div>
            Rol cambiado exitosamente a <strong>{role.name}</strong>
          </div>
        ),
      });
    } catch (e) {
      console.error("Error change default role", e);
      notification({ type: "error" });
    } finally {
      setLoadingChangeDefaultRole(false);
    }
  };

  return (
    <ChangeDefaultRoleContext.Provider
      value={{
        changeDefaultRole,
      }}
    >
      {loadingChangeDefaultRole ? (
        <Spinner height="100vh" message="Cambiando de rol" />
      ) : (
        children
      )}
    </ChangeDefaultRoleContext.Provider>
  );
};

export const useChangeDefaultRole = () => useContext(ChangeDefaultRoleContext);
