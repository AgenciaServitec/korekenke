import React from "react";
import { capitalize } from "lodash";
import Breadcrumb from "antd/lib/breadcrumb";
import { useGlobalData } from "../../providers";

export const BreadcrumbLayout = ({ user }) => {
  const { rolesAcls } = useGlobalData();
  const legend = window.location.pathname.split("/").filter((legend) => legend);

  const findRole = (roleCode) => {
    return rolesAcls.find((role) => role.id === roleCode);
  };

  return (
    <Breadcrumb style={{ margin: "16px 0", fontSize: 12 }}>
      <Breadcrumb.Item>
        {capitalize(findRole(user?.roleCode)?.roleName || "User")}
      </Breadcrumb.Item>
      {(legend || []).map((legend, index) => (
        <Breadcrumb.Item key={index}>
          {legend === "entities" ? "Entidad (G.U)" : capitalize(legend)}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
