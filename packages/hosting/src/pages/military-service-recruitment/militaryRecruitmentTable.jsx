import React from "react";
import dayjs from "dayjs";
import {
  Acl,
  IconAction,
  Space,
  TableVirtualized,
  Tag,
} from "../../components";
import {
  faEdit,
  faEye,
  faMapLocation,
  faReply,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { capitalize, isEmpty, orderBy } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { MilitaryRecruitmentStatus } from "../../data-list";

export const MilitaryRecruitmentTable = ({
  loading,
  militaryRecruitment,
  onEditMilitaryRecruitment,
  onConfirmDeleteMilitaryRecruitment,
  onShowReplyModal,
  onShowReplyInformationModal,
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
      title: "Apellidos y Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (recruited) =>
        `${capitalize(recruited.paternalSurname)} ${capitalize(recruited.maternalSurname)} ${capitalize(recruited.firstName)}`,
    },
    {
      title: "Contácto",
      align: "center",
      width: ["13rem", "100%"],
      render: (recruited) => (
        <div className="contact">
          <div className="contact__item">
            <a href={`mailto:${recruited.email}`}>{recruited.email}</a>
          </div>
          <div className="contact__item">
            <IconAction
              tooltipTitle="Whatsapp"
              icon={faWhatsapp}
              size={27}
              styled={{ color: (theme) => theme.colors.success }}
              onClick={() =>
                window.open(
                  `https://api.whatsapp.com/send?phone=${recruited.phone.prefix.replace(
                    "+",
                    "",
                  )}${recruited.phone.number}`,
                )
              }
            />
            <span>
              {recruited.phone.prefix} &nbsp;
              {recruited.phone.number}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Estado",
      align: "center",
      width: ["5rem", "100%"],
      render: (recruited) => {
        const recruitedStatus = MilitaryRecruitmentStatus[recruited.status];

        return (
          <Tag color={recruitedStatus?.color}>{recruitedStatus?.name}</Tag>
        );
      },
    },
    {
      title: "Respuesta",
      align: "center",
      width: ["9rem", "100%"],
      render: (recruited) => {
        const status = recruited?.response?.type === "positive";
        return (
          recruited?.response && (
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
                onClick={() => onShowReplyInformationModal(recruited)}
              />
            </Space>
          )
        );
      },
    },
    {
      title: "Ubicación",
      align: "center",
      width: ["10rem", "100%"],
      render: (recruited) => (
        <>
          {isEmpty(recruited?.location) ? (
            <span style={{ color: "red" }}>No se obtuvo su ubicación</span>
          ) : (
            <>
              <a
                href={`https://www.google.com/maps/place/${recruited?.location?.latitude},${recruited?.location?.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                <Space>
                  <FontAwesomeIcon
                    icon={faMapLocation}
                    color="#1677ff"
                    size="lg"
                  />
                  Ver mapa
                </Space>
              </a>
            </>
          )}
        </>
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
            name="/military-service-recruitment#reply"
          >
            {recruited?.status !== "finalized" && (
              <IconAction
                tooltipTitle="Responder registro"
                icon={faReply}
                styled={{ color: (theme) => theme.colors.primary }}
                onClick={() => onShowReplyModal(recruited)}
              />
            )}
          </Acl>
          <Acl
            category="public"
            subCategory="militaryServiceRecruitment"
            name="/military-service-recruitment/:militaryServiceRecruitmentId"
          >
            {recruited?.status !== "finalized" && (
              <IconAction
                tooltipTitle="Editar"
                icon={faEdit}
                onClick={() => onEditMilitaryRecruitment(recruited)}
              />
            )}
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
    <Container>
      <TableVirtualized
        loading={loading}
        dataSource={orderBy(militaryRecruitment, "createAt", "desc")}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={90}
      />
    </Container>
  );
};

const Container = styled.div`
  .contact {
    &__item {
      display: flex;
      align-items: center;
    }
  }
`;
