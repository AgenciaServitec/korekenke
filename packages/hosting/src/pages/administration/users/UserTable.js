import React from "react";
import { Acl, IconAction, Space, Table, Tag } from "../../../components";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { capitalize, orderBy } from "lodash";
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
      width: 130,
      render: (_, user) => (
        <strong className="capitalize">
          {findRole(rolesAcls, user?.roleCode)?.name || ""}
        </strong>
      ),
    },
    {
      title: "Commandos",
      dataIndex: "commands",
      key: "commands",
      width: 200,
      render: (_, user) => (
        <Space style={{ display: "flex", flexWrap: "wrap" }}>
          {user.commands.map((command) => (
            <span key={command.id}>
              <Tag color="blue" style={{ margin: 0 }}>
                {command.code.toUpperCase()}
              </Tag>
            </span>
          ))}
        </Space>
      ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (_) => (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <Tag color="yellow" style={{ margin: "0" }}>
            Registrado
          </Tag>
        </div>
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
      dataSource={orderBy(users, ["createAt"], ["desc"])}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};
