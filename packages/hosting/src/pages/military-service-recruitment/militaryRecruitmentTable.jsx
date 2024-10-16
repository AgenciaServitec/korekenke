import React from "react";
import dayjs from "dayjs";
import { Acl, IconAction, Space, TableVirtualized } from "../../components";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { orderBy } from "lodash";

export const MilitaryRecruitmentTable = ({
  loading,
  militaryRecruitment,
  onEditMilitaryRecruitment,
  onConfirmDeleteMilitaryRecruitment,
}) => {
  const columns = [
    {
      title: "Fecha creación",
      align: "center",
      width: ["9rem", "100%"],
      render: (recruited) =>
        dayjs(recruited.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "DNI",
      align: "center",
      width: ["9rem", "100%"],
      render: (recruited) => recruited.dni,
    },
    {
      title: "Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (recruited) => recruited.firstName,
    },
    {
      title: "Apellidos",
      align: "center",
      width: ["15rem", "100%"],
      render: (recruited) =>
        `${recruited.paternalSurname} ${recruited.maternalSurname}`,
    },
    {
      title: "Correo",
      align: "center",
      width: ["15rem", "100%"],
      render: (recruited) => recruited.email,
    },
    {
      title: "Opciones",
      align: "center",
      width: ["14rem", "100%"],
      render: (recruited) => (
        <Space>
          <Acl
            category="public"
            subCategory="militaryServiceRecruitment"
            name="/military-service-recruitment/:militaryServiceRecruitmentId"
          >
            <IconAction
              tooltipTitle="Editar"
              icon={faEdit}
              onClick={() => onEditMilitaryRecruitment(recruited)}
            />
          </Acl>
          <Acl
            category="public"
            subCategory="militaryServiceRecruitment"
            name="/military-service-recruitment#delete"
          >
            <IconAction
              tooltipTitle="Eliminar"
              icon={faTrash}
              styled={{ color: (theme) => theme.colors.error }}
              onClick={() => onConfirmDeleteMilitaryRecruitment(recruited)}
            />
          </Acl>
        </Space>
      ),
    },
  ];

  return (
    <TableVirtualized
      loading={loading}
      dataSource={orderBy(militaryRecruitment, "createAt", "desc")}
      columns={columns}
      rowHeaderHeight={50}
      rowBodyHeight={150}
    />
  );
};
