import React, { useEffect, useState } from "react";
import { Acl, IconAction, Space, Table, Tag } from "../../../../components";
import { findDasRequest, userFullName } from "../../../../utils";
import dayjs from "dayjs";
import {
  faEdit,
  faEye,
  faFilePdf,
  faReply,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { orderBy } from "lodash";
import { DasRequestStatus } from "../../../../data-list";
import { useNavigate } from "react-router";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import { entitiesRef } from "../../../../firebase/collections";
import { fetchCollectionOnce } from "../../../../firebase/firestore";
import { useAuthentication } from "../../../../providers";

export const DasRequestsTable = ({
  dasApplications,
  onEditDasRequest,
  onDeleteDasRequest,
  dasApplicationsLoading,
  onAddReplyDasRequest,
  onShowReplyDasRequestInformation,
}) => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();

  const [entity, setEntity] = useState(null);

  useEffect(() => {
    (async () => {
      const entities = await fetchCollectionOnce(
        entitiesRef.where("nameId", "==", "departamento-de-apoyo-social"),
      );

      setEntity(entities?.[0]);
    })();
  }, []);

  const navigateTo = (pathname) => navigate(pathname);

  const isPositiveOrApproved = (dasRequest) =>
    dasRequest?.status === "finalized" ||
    dasRequest?.status === "inProgess" ||
    dasRequest?.response?.type === "positive";

  const isFinalized = (dasRequest) => dasRequest?.status === "finalized";

  const columns = [
    {
      title: "Fecha creación",
      dataIndex: "createAt",
      key: "createAt",
      render: (_, dasRequest) =>
        dayjs(dasRequest.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Titular",
      key: "name",
      render: (_, dasRequest) => userFullName(dasRequest.headline),
    },
    {
      title: "Solicitud / Institución",
      key: "requestType",
      render: (_, dasRequest) => {
        // let institutionData = null;
        // const institutionType = dasRequest?.institution?.type;

        // switch (institutionType) {
        //   case "institutes":
        //     institutionData = (institutions?.[institutionType] || []).find(
        //       (institution) => institution.id === dasRequest?.institution?.id
        //     );
        //     break;
        //   case "universities":
        //     institutionData = (institutions?.[institutionType] || []).find(
        //       (university) => university.id === dasRequest?.institution?.id
        //     );
        //     break;
        //   default:
        //     institutionData = "";
        //     break;
        // }

        return (
          <div className="capitalize">
            <div>{findDasRequest(dasRequest?.requestType)?.name}</div>
            <div>
              <strong>{dasRequest?.institution?.id}</strong>
            </div>
          </div>
        );
      },
    },
    {
      title: "Contácto",
      key: "email",
      render: (_, dasRequest) => (
        <div className="contact">
          <div className="contact__item">
            <a href={`mailto:${dasRequest.headline.email}`}>
              {dasRequest.headline.email}
            </a>
          </div>
          <div className="contact__item">
            <IconAction
              tooltipTitle="Whatsapp"
              icon={faWhatsapp}
              size={27}
              styled={{ color: (theme) => theme.colors.success }}
              onClick={() =>
                window.open(
                  `https://api.whatsapp.com/send?phone=${dasRequest.headline.phone.prefix.replace(
                    "+",
                    "",
                  )}${dasRequest.headline.phone.number}`,
                )
              }
            />
            <span>
              {dasRequest.headline.phone.prefix} &nbsp;
              {dasRequest.headline.phone.number}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Estado",
      align: "center",
      key: "status",
      render: (_, dasRequest) => {
        const requestStatus = DasRequestStatus[dasRequest.status];

        return <Tag color={requestStatus?.color}>{requestStatus?.name}</Tag>;
      },
    },
    {
      title: "Respuesta",
      align: "center",
      key: "status",
      render: (_, dasRequest) => {
        return (
          dasRequest?.response && (
            <Space>
              <div>
                <Tag
                  color={
                    dasRequest?.response?.type === "positive" ? "green" : "red"
                  }
                >
                  {dasRequest?.response?.type === "positive"
                    ? "Positivo"
                    : "Negativo"}
                </Tag>
              </div>
              <IconAction
                tooltipTitle="Ver detalle de respuesta"
                icon={faEye}
                size={30}
                styled={{ color: (theme) => theme.colors.info }}
                onClick={() => onShowReplyDasRequestInformation(dasRequest)}
              />
            </Space>
          )
        );
      },
    },
    {
      title: "Opciones",
      align: "center",
      key: "options",
      render: (_, dasRequest) => (
        <Space>
          {entity?.entityManageId === authUser?.id &&
            !isFinalized(dasRequest) && (
              <Acl
                category="departamento-de-apoyo-social"
                subCategory="dasRequests"
                name="/das-requests/:dasRequestId#reply"
              >
                <IconAction
                  tooltipTitle="Responder solicitud"
                  icon={faReply}
                  styled={{ color: (theme) => theme.colors.primary }}
                  onClick={() => onAddReplyDasRequest(dasRequest)}
                />
              </Acl>
            )}
          <Acl
            category="departamento-de-apoyo-social"
            subCategory="dasRequests"
            name="/das-requests/:dasRequestId/sheets"
          >
            <IconAction
              tooltipTitle="PDF"
              icon={faFilePdf}
              styled={{ color: (theme) => theme.colors.error }}
              onClick={() =>
                navigateTo(`${dasRequest.id}/${dasRequest.requestType}/sheets`)
              }
            />
          </Acl>
          {!isFinalized(dasRequest) && (
            <Acl
              category="departamento-de-apoyo-social"
              subCategory="dasRequests"
              name="/das-requests/:dasRequestId"
            >
              <IconAction
                tooltipTitle="Editar"
                icon={faEdit}
                onClick={() => onEditDasRequest(dasRequest)}
              />
            </Acl>
          )}
          {!isPositiveOrApproved(dasRequest) && (
            <Acl
              category="departamento-de-apoyo-social"
              subCategory="dasRequests"
              name="/das-requests#delete"
            >
              <IconAction
                tooltipTitle="Eliminar"
                icon={faTrash}
                styled={{ color: (theme) => theme.colors.error }}
                onClick={() => onDeleteDasRequest(dasRequest)}
              />
            </Acl>
          )}
        </Space>
      ),
    },
  ];
  return (
    <Container>
      <Table
        loading={dasApplicationsLoading}
        columns={columns}
        scroll={{ x: "max-content" }}
        dataSource={orderBy(dasApplications, "createAt", "desc")}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  .contact {
    &__item {
      display: flex;
      align-items: center;
    }
  }
`;
