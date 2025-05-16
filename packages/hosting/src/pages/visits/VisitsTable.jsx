import React from "react";
import {
  Acl,
  Col,
  IconAction,
  Row,
  Space,
  TableVirtualized,
  Tag,
} from "../../components/ui";
import dayjs from "dayjs";
import { VisitsStatus } from "../../data-list";
import {
  faDoorOpen,
  faEdit,
  faReply,
  faRightFromBracket,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { orderBy } from "lodash";
import { userFullName } from "../../utils/users/userFullName2";

export const VisitsTable = ({
  visits,
  onClickDeleteVisit,
  onClickEditVisit,
  onConfirmIOChecker,
  onShowVisitReplyModal,
}) => {
  const messageWhatsapp = (visit) =>
    `https://api.whatsapp.com/send/?phone=${visit.personVisited.phone.prefix.replace("+", "")}${visit.personVisited.phone.number}&text=Hola ${userFullName(visit.personVisited)} 👋,te viene a visitar ${userFullName(visit)} ‍💼.%0A%0APor favor, ingresa al módulo de visitas en Korekenke 📲 para que puedas aprobar la visita ✅.%0A%0AGracias.&app_absent=0`;
  const columns = [
    {
      title: "F. Creación",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) =>
        dayjs(visit.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Apellidos Y Nombres",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => userFullName(visit),
    },
    {
      title: "DNI",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => visit.dni,
    },
    {
      title: "CIP",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => visit.cip,
    },
    {
      title: "Dependencia",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => visit.dependency,
    },
    {
      title: "¿A quién visita?",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => (
        <div>
          <span>{userFullName(visit?.personVisited)}</span>
          <Space>
            <IconAction
              tooltipTitle="Whatsapp"
              icon={faWhatsapp}
              size={27}
              styled={{ color: (theme) => theme.colors.success }}
              onClick={() =>
                window.open(
                  `https://api.whatsapp.com/send/?phone=${visit.personVisited.phone.prefix.replace("+", "")}${visit.personVisited.phone.number}&text=${messageWhatsapp(visit)}&app_absent=0`,
                )
              }
            />
            <span>{visit.personVisited.phone.number}</span>
          </Space>
        </div>
      ),
    },
    {
      title: "Estado",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => {
        const status = VisitsStatus?.[visit?.status];
        return <Tag color={status?.color}>{status?.name}</Tag>;
      },
    },
    {
      title: "F/H - INGRESO",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) =>
        visit.entryDateTime ? (
          visit.entryDateTime
        ) : (
          <Acl category="public" subCategory="visits" name="/visits#check-out">
            <IconAction
              tooltipTitle="Registrar Entrada"
              icon={faDoorOpen}
              styled={{
                color:
                  visit.status === "approved"
                    ? (theme) => theme.colors.success
                    : (theme) => theme.colors.gray,
              }}
              onClick={() =>
                visit.status === "approved" &&
                onConfirmIOChecker(visit, "entry")
              }
            />
          </Acl>
        ),
    },
    {
      title: "F/H - SALIDA",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) =>
        visit.exitDateTime ? (
          visit.exitDateTime
        ) : (
          <Acl category="public" subCategory="visits" name="/visits#check-out">
            <IconAction
              tooltipTitle="Registrar Salida"
              styled={{
                color:
                  visit.status === "approved"
                    ? (theme) => theme.colors.error
                    : (theme) => theme.colors.gray,
              }}
              icon={faRightFromBracket}
              onClick={() =>
                visit.status === "approved" && onConfirmIOChecker(visit, "exit")
              }
            />
          </Acl>
        ),
    },
    {
      title: "Opciones",
      align: "center",
      width: ["14rem", "100%"],
      render: (visit) => (
        <Space>
          <Acl
            category="public"
            subCategory="visits"
            name="/visits/:visitId#reply"
          >
            <IconAction
              tooltipTitle="Responder solicitud"
              icon={faReply}
              styled={{ color: (theme) => theme.colors.primary }}
              onClick={() => onShowVisitReplyModal(visit)}
            />
          </Acl>
          <Acl category="public" subCategory="visits" name="/visits/:visitId">
            <IconAction
              tooltipTitle="Editar"
              onClick={() => onClickEditVisit(visit.id)}
              styled={{ color: (theme) => theme.colors.tertiary }}
              icon={faEdit}
            />
          </Acl>
          <Acl category="public" subCategory="visits" name="/visits#delete">
            <IconAction
              tooltipTitle="Eliminar"
              onClick={() => onClickDeleteVisit(visit.id)}
              icon={faTrash}
              styled={{
                color: (theme) => theme.colors.error,
              }}
            />
          </Acl>
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <TableVirtualized
          dataSource={orderBy(visits, "createAt", "desc")}
          columns={columns}
          rowHeaderHeight={50}
          rowBodyHeight={150}
        />
      </Col>
    </Row>
  );
};
