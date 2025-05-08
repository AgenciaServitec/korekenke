import React from "react";
import {
  Col,
  Row,
  TableVirtualized,
  Space,
  Tag,
  Acl,
  IconAction,
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
export const VisitsTable = ({
  user,
  visits,
  onClickAddVisit,
  onClickDeleteVisit,
  onClickEditVisit,
  onConfirmIOChecker,
  onShowVisitReplyModal,
}) => {
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
      render: (visit) => visit.fullName,
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
      title: "A quien visita",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => visit?.personVisited,
    },
    {
      title: "N° contacto de OO/TCO/SO",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => (
        <Space>
          <IconAction
            tooltipTitle="Whatsapp"
            icon={faWhatsapp}
            size={27}
            styled={{ color: (theme) => theme.colors.success }}
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send/?phone=+51${visit.contactOfficer}&text=Te viene a visitar ${visit.fullName}&app_absent=0`,
              )
            }
          />
          <span>
            +51 &nbsp;
            {visit.contactOfficer}
          </span>
        </Space>
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
          dataSource={visits}
          columns={columns}
          rowHeaderHeight={50}
          rowBodyHeight={150}
        />
      </Col>
    </Row>
  );
};
