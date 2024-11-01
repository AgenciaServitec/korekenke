import React from "react";
import { Acl, IconAction, Space, Table, Tag } from "../../../components";
import {
  faArrowUpRightFromSquare,
  faEdit,
  faLinkSlash,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { capitalize, orderBy } from "lodash";
import dayjs from "dayjs";
import { findDegree } from "../../../utils";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const UsersTable = ({
  users,
  onEditUser,
  onRemoveUser,
  onUnlinkAssignedToUser,
}) => {
  const getModuleByUserAssignedTo = (assignedTo = null) => {
    if (!assignedTo?.id) return null;

    switch (assignedTo?.type) {
      case "entity":
        return {
          module: "Entidad / G.U",
          url: `/entities-gu/${assignedTo.id}`,
        };
      case "unit":
        return { module: "Unidad", url: `/units/${assignedTo.id}` };
      case "department":
        return { module: "Departamento", url: `/departments/${assignedTo.id}` };
      case "section":
        return { module: "Sección", url: `/sections/${assignedTo.id}` };
      case "office":
        return { module: "Oficina", url: `/offices/${assignedTo.id}` };
    }
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
          }`,
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
      title: "Vinculado a",
      key: "linked",
      render: (_, user) => {
        const assignedTo = getModuleByUserAssignedTo(user.assignedTo);

        return (
          <Space>
            {assignedTo && (
              <>
                <Link to={assignedTo.url}>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />{" "}
                  {assignedTo.module}
                </Link>
                <IconAction
                  icon={faLinkSlash}
                  size={33}
                  tooltipTitle="Desvincular al usuario de su grupo"
                  onClick={() => onUnlinkAssignedToUser(user)}
                />
              </>
            )}
          </Space>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "status",
      align: "center",
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
      title: "Commandos",
      dataIndex: "commands",
      key: "commands",
      width: 200,
      render: (_, user) => (
        <Space style={{ display: "flex", flexWrap: "wrap" }}>
          {(user?.commands || []).map((command) => (
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
      title: "Acciones",
      align: "center",
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
              onClick={() => onRemoveUser(user)}
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
      pagination={true}
      scroll={{ x: "max-content" }}
    />
  );
};
