import React from "react";
import dayjs from "dayjs";
import { Acl, IconAction, Space, TableVirtualized } from "../../components";
import {
  faEdit,
  faHome,
  faMapLocation,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { orderBy } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      title: "Ubicación",
      align: "center",
      width: ["10rem", "100%"],
      render: (recruited) => (
        <Space>
          <FontAwesomeIcon icon={faMapLocation} size="lg" />
          <a
            href={`https://www.google.com/maps/@${recruited?.location?.latitude},${recruited?.location?.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            Ver mapa
          </a>
        </Space>
      ),
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
