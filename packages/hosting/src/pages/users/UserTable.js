import React from "react";
import { Space, Table, Tag } from "antd";
import { Acl, IconAction } from "../../components";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { capitalize } from "lodash";
import moment from "moment";
import { allRoles, DegreesArmy } from "../../data-list";

export const UsersTable = ({ users, onEditUser, onConfirmRemoveUser }) => {
  const findRole = (roleCode) =>
    allRoles.find((role) => role.code === roleCode);

  const findDegree = (degreeCode) =>
    DegreesArmy.flatMap((degreeArmy) => degreeArmy.options).find(
      (degree) => degree.value === degreeCode
    );

  const columns = [
    {
      title: "Nombres y Apellidos",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, user) =>
        capitalize(
          `${user?.firstName} ${user?.paternalSurname} ${
            user?.maternalSurname || ""
          }`
        ),
    },
    {
      title: "Grado",
      dataIndex: "degree",
      key: "degree",
      render: (_, user) => capitalize(findDegree(user?.degree)?.label || ""),
    },
    {
      title: "CIP",
      dataIndex: "cip",
      key: "cip",
      render: (_, user) => capitalize(user?.cip || ""),
    },
    {
      title: "Rol",
      dataIndex: "defaultRoleCode",
      key: "defaultRoleCode",
      render: (_, user) => findRole(user?.defaultRoleCode)?.name || "",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (_) => (
        <Space>
          <span>
            <Tag color="yellow">Registrado</Tag>
          </span>
        </Space>
      ),
    },
    {
      title: "Fecha de Creación",
      dataIndex: "createAt",
      key: "createAt",
      render: (_, user) =>
        moment(user?.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, user) => (
        <Space>
          <Acl name="/users/:userId">
            <IconAction
              tooltipTitle="Editar"
              icon={faEdit}
              onClick={() => onEditUser(user)}
            />
          </Acl>
          <Acl name="/users#delete">
            <IconAction
              tooltipTitle="Eliminar"
              styled={{ color: (theme) => theme.colors.error }}
              icon={faTrash}
              onClick={() => onConfirmRemoveUser(user)}
            />
          </Acl>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};
``;
