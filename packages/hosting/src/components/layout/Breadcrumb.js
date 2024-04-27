import React from "react";
import { capitalize } from "lodash";
import Breadcrumb from "antd/lib/breadcrumb";
import { allRoles } from "../../data-list";

export const BreadcrumbLayout = ({ user }) => {
  const legend = window.location.pathname.split("/").filter((legend) => legend);

  const findRole = (roleCode) =>
    allRoles.find((role) => role.defaultRoleCode === roleCode);

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item>
        {capitalize(findRole(user?.defaultRoleCode)?.roleName || "User")}
      </Breadcrumb.Item>
      {(legend || []).map((legend, index) => (
        <Breadcrumb.Item key={index}>{capitalize(legend)}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
