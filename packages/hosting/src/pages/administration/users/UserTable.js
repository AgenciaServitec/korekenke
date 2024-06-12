import React from "react";
import { Acl, IconAction, Space, Table, Tag } from "../../../components";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { capitalize } from "lodash";
import dayjs from "dayjs";
import { findDegree, findRole } from "../../../utils";

export const UsersTable = ({
  users,
  rolesAcls,
  onEditUser,
  onConfirmRemoveUser,
}) => {
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
      dataIndex: "roleCode",
      key: "roleCode",
      render: (_, user) =>
        capitalize(findRole(rolesAcls, user?.roleCode)?.name || ""),
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
        dayjs(user?.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, user) => (
        <Space>
          <Acl
            category="administration"
            subCategory="users"
            name="/users/:userId"
          >
            <IconAction
              tooltipTitle="Editar"
              icon={faEdit}
              onClick={() => onEditUser(user)}
            />
          </Acl>
          <Acl
            category="administration"
            subCategory="users"
            name="/users#delete"
          >
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
