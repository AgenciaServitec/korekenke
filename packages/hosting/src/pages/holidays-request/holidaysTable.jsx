import React from "react";
import styled from "styled-components";
import {
  Acl,
  IconAction,
  Space,
  TableVirtualized,
  Tag,
} from "../../components";
import { HolidaysRequestStatus } from "../../data-list";
import {
  faCalendar,
  faEdit,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { userFullName } from "../../utils";
import { orderBy } from "lodash";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";

export const HolidaysTable = ({
  loading,
  holidays,
  onEditHolidayRequest,
  onConfirmDeleteHolidayRequest,
  onShowCalendar,
}) => {
  const displayValidationEditAndDeleted = (holiday) => {
    const startDate = dayjs(
      holiday.startDate,
      DATE_FORMAT_TO_FIRESTORE,
    ).subtract(1, "day");

    return dayjs().isBefore(startDate);
  };

  const columns = [
    {
      title: "Fecha creación",
      align: "center",
      width: ["9rem", "100%"],
      render: (holiday) =>
        dayjs(holiday.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Apellidos y Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (holiday) => userFullName(holiday.user),
    },
    {
      title: "Fecha de Inicio",
      align: "center",
      width: ["11rem", "100%"],
      render: (holiday) =>
        dayjs(holiday.startDate, DATE_FORMAT_TO_FIRESTORE).format("DD/MM/YYYY"),
    },
    {
      title: "Fecha de Finalización",
      align: "center",
      width: ["15rem", "100%"],
      render: (holiday) =>
        dayjs(holiday.endDate, DATE_FORMAT_TO_FIRESTORE).format("DD/MM/YYYY"),
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
      render: (holiday) => {
        return (
          <Space>
            <Acl
              category="public"
              subCategory="holidaysRequest"
              name="/holidays-request#reply"
            >
              <IconAction
                tooltipTitle="Ver calendario"
                icon={faCalendar}
                styled={{ color: (theme) => theme.colors.primary }}
                onClick={() => onShowCalendar(holiday)}
              />
            </Acl>
            {displayValidationEditAndDeleted(holiday) && (
              <>
                <Acl
                  category="public"
                  subCategory="holidaysRequest"
                  name="/holidays-request/:holidayRequestId"
                >
                  {holiday?.status !== "finalized" && (
                    <IconAction
                      tooltipTitle="Editar"
                      icon={faEdit}
                      onClick={() => onEditHolidayRequest(holiday)}
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
                    onClick={() => onConfirmDeleteHolidayRequest(holiday)}
                  />
                </Acl>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Container>
      <TableVirtualized
        loading={loading}
        dataSource={orderBy(holidays, "createAt", "desc")}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={90}
      />
    </Container>
  );
};

const Container = styled.div``;
