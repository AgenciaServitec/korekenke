import React, { useEffect, useState } from "react";
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
  faFileArrowDown,
  faFileArrowUp,
  faFilePdf,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { userFullName } from "../../utils";
import { orderBy } from "lodash";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";
import { useNavigate } from "react-router";
import { useBosses } from "../../hooks";

const ENTITY_GU_NAME_ID = "departamento-de-personal";
const DEPARTMENT_NAME_ID = "mesa-de-partes";

export const HolidaysTable = ({
  loading,
  user,
  holidays,
  onEditHolidayRequest,
  onConfirmDeleteHolidayRequest,
  onShowCalendar,
  onShowSubmitPDF,
  onShowHolidayRequestInformation,
}) => {
  const navigate = useNavigate();
  const { fetchEntityManager, fetchDepartmentBoss } = useBosses();

  const [bossEntityGu, setBossEntityGu] = useState(null);
  const [bossMDP, setBossMDP] = useState(null);

  useEffect(() => {
    (async () => {
      const p0 = fetchEntityManager(ENTITY_GU_NAME_ID);
      const p1 = fetchDepartmentBoss(DEPARTMENT_NAME_ID);

      const [_bossEntityGu, _bossMDP] = await Promise.all([p0, p1]);

      setBossEntityGu(_bossEntityGu);
      setBossMDP(_bossMDP);
    })();
  }, []);

  const isBossMDP = user.id === bossMDP?.id;

  const onNavigateTo = (pathname) => navigate(pathname);

  const displayValidationEditAndDeleted = (holidayRequest) => {
    const startDate = dayjs(
      holidayRequest.startDate,
      DATE_FORMAT_TO_FIRESTORE,
    ).subtract(1, "day");

    return holidayRequest?.status === "waiting";
  };

  const isPositiveOrApproved = (holidayRequest) =>
    holidayRequest?.status === "finalized" ||
    holidayRequest?.status === "inProgress" ||
    holidayRequest?.response?.type === "positive";

  const holidaysRequestViewBy = holidays.filter((holiday) => {
    if (["super_admin"].includes(user.roleCode)) return holiday;

    if (holiday.user.id === user.id) return holiday;

    if (["waiting", "notProceeds"].includes(holiday.status) && isBossMDP)
      return holiday;

    if (
      !["waiting", "notProceeds"].includes(holiday.status) &&
      ["manager"].includes(user.roleCode)
    )
      return holiday;
  });

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
                onClick={() => onShowHolidayRequestInformation(holiday)}
              />
            </Space>
          )
        );
      },
    },
    {
      title: "Documento (PDF)",
      align: "center",
      width: ["9rem", "100%"],
      render: (holiday) => {
        return (
          <Acl
            category="public"
            subCategory="holidaysRequest"
            name="/holidays-request#submit-pdf"
          >
            <IconAction
              tooltipTitle="Subir PDF"
              icon={holiday.document ? faFileArrowDown : faFileArrowUp}
              styled={{
                color: (theme) =>
                  holiday.document ? theme.colors.info : theme.colors.error,
              }}
              onClick={() => onShowSubmitPDF(holiday)}
            />
          </Acl>
        );
      },
    },
    {
      title: "Opciones",
      align: "start",
      width: ["13rem", "100%"],
      render: (holiday) => {
        return (
          <Space>
            <Acl
              category="public"
              subCategory="holidaysRequest"
              name="/holidays-request#showCalendar"
            >
              <IconAction
                tooltipTitle="Ver calendario"
                icon={faCalendar}
                styled={{ color: (theme) => theme.colors.primary }}
                onClick={() => onShowCalendar(holiday)}
              />
            </Acl>
            <Acl
              category="public"
              subCategory="holidaysRequest"
              name="/holidays-request/:holidayRequestId/sheets/:userId"
            >
              <IconAction
                tooltipTitle="PDF"
                icon={faFilePdf}
                styled={{ color: (theme) => theme.colors.error }}
                onClick={() => onNavigateTo(`${holiday.id}/sheets/${user.id}`)}
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
                {!isPositiveOrApproved(holiday) &&
                  user.roleCode === "manager" && (
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
                  )}
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
        dataSource={orderBy(holidaysRequestViewBy, "createAt", "desc")}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={90}
      />
    </Container>
  );
};

const Container = styled.div``;
