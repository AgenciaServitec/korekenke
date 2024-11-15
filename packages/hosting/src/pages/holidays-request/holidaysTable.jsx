import React from "react";
import styled from "styled-components";
import {
  Acl,
  IconAction,
  TableVirtualized,
  Space,
  Tag,
} from "../../components";
import { capitalize } from "lodash";
import { HolidaysRequestStatus, HolidaysTemps } from "../../data-list";
import {
  faCalendar,
  faEdit,
  faEye,
  faReply,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export const HolidaysTable = ({ loading, onShowCalendarModal }) => {
  const columns = [
    {
      title: "Fecha creación",
      align: "center",
      width: ["9rem", "100%"],
      render: (holiday) => holiday.createAt,
    },
    {
      title: "Apellidos y Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (holiday) =>
        `${capitalize(holiday.user.paternalSurname)} ${capitalize(holiday.user.maternalSurname)} ${capitalize(holiday.user.firstName)}`,
    },
    {
      title: "Fecha de Inicio",
      align: "center",
      width: ["11rem", "100%"],
      render: (holiday) => holiday.startDate,
    },
    {
      title: "Fecha de Finalización",
      align: "center",
      width: ["15rem", "100%"],
      render: (holiday) => holiday.endDate,
    },
    {
      title: "Estado",
      align: "center",
      width: ["7rem", "100%"],
      render: (holiday) => {
        const holidayStatus = HolidaysRequestStatus[holiday.status];
        return <Tag color={holidayStatus?.color}>{holidayStatus?.name}</Tag>;
      },
    },
    {
      title: "Respuesta",
      align: "center",
      width: ["8rem", "100%"],
      render: (holiday) => {
        const status = holiday?.response?.type === "positive";
        return (
          holiday?.response && (
            <Space>
              <div>
                <Tag color={status ? "green" : "red"}>
                  {status ? "Positivo" : "Negativo"}
                </Tag>
              </div>
              <IconAction
                tooltipTitle="Ver detalle de respuesta"
                icon={faEye}
                size={30}
                styled={{ color: (theme) => theme.colors.info }}
                onClick={() => console.log("Aun no existe")}
              />
            </Space>
          )
        );
      },
    },
    {
      title: "Opciones",
      align: "center",
      width: ["8rem", "100%"],
      render: (holiday) => (
        <Space>
          <Acl
            category="public"
            subCategory="holidaysRequest"
            name="/holidays-request#reply"
          >
            {holiday.status !== "finalized" && (
              <IconAction
                tooltipTitle="Ver calendario"
                icon={faCalendar}
                styled={{ color: (theme) => theme.colors.primary }}
                onClick={() => onShowCalendarModal(holiday)}
              />
            )}
          </Acl>
          <Acl
            category="public"
            subCategory="holidaysRequest"
            name="/holidays-request/:holidayRequestId"
          >
            {holiday?.status !== "finalized" && (
              <IconAction
                tooltipTitle="Editar"
                icon={faEdit}
                onClick={() => console.log("No disponible")}
              />
            )}
          </Acl>
          <Acl
            category="public"
            subCategory="holidaysRequest"
            name="/holidays-request#delete"
          >
            <IconAction
              tooltipTitle="Eliminar"
              icon={faTrash}
              styled={{ color: (theme) => theme.colors.error }}
              onClick={() => console.log("Aun no existe")}
            />
          </Acl>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <TableVirtualized
        loading={loading}
        dataSource={HolidaysTemps}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={90}
      />
    </Container>
  );
};

const Container = styled.div``;
