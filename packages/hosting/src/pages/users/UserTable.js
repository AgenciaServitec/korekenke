import React from "react";
import { Space, Table, Tag } from "antd";
import { IconAction, modalConfirm } from "../../components";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { capitalize } from "lodash";
import moment from "moment";
import { allRoles, DegreesArmy } from "../../data-list";

export const UsersTable = ({ users, onDeleteUser }) => {
  const navigate = useNavigate();

  const onEditUser = (user) => {
    navigate(`/users/${user.id}`);
  };

  const findRole = (roleCode) =>
    allRoles.find((role) => role.code === roleCode);

  const findDegree = (degreeCode) =>
    DegreesArmy.flatMap((degreeArmy) => degreeArmy.options).find(
      (degree) => degree.value === degreeCode
    );

  const onConfirmRemoveUser = (user) => {
    modalConfirm({
      content: "El usuario se eliminará",
      onOk: async () => {
        await onDeleteUser(user);
      },
    });
  };

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
      render: (_, user) => capitalize(user?.defaultRoleCode || ""),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (_, user) => (
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
          <IconAction
            tooltipTitle="Editar"
            icon={faEdit}
            onClick={() => onEditUser(user)}
          />
          <IconAction
            tooltipTitle="Eliminar"
            styled={{ color: (theme) => theme.colors.error }}
            icon={faTrash}
            onClick={() => onConfirmRemoveUser(user)}
          />
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
