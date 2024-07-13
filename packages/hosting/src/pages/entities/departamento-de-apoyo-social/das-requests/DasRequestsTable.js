import React from "react";
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
import { DasRequestStatus, institutions } from "../../../../data-list";
import { useNavigate } from "react-router";

export const DasRequestsTable = ({
  dasApplications,
  onEditDasRequest,
  onDeleteDasRequest,
  dasApplicationsLoading,
  onAddReplyDasRequest,
  onShowReplyDasRequestInformation,
}) => {
  const navigate = useNavigate();

  const navigateTo = (pathname) => navigate(pathname);

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
      title: "Solicitud",
      key: "requestType",
      render: (_, dasRequest) => (
        <div className="capitalize">
          {findDasRequest(dasRequest.requestType)?.name}
        </div>
      ),
    },
    {
      title: "Institución",
      key: "institution",
      render: (_, dasRequest) => {
        const institutionType = dasRequest?.institution?.type;

        switch (institutionType) {
          case "institutes":
            return (institutions?.[institutionType] || []).find(
              (institution) => institution.id === dasRequest?.institution?.id
            )?.name;
          case "universities":
            return (institutions?.[institutionType] || []).find(
              (university) => university.id === dasRequest?.institution?.id
            )?.name;
          default:
            return "";
        }
      },
    },
    {
      title: "Email",
      key: "email",
      render: (_, dasRequest) => dasRequest.headline.email,
    },
    {
      title: "Estado",
      key: "status",
      render: (_, dasRequest) => {
        const requestStatus = DasRequestStatus[dasRequest.status];

        return <Tag color={requestStatus.color}>{requestStatus?.name}</Tag>;
      },
    },
    {
      title: "Respuesta",
      key: "status",
      render: (_, dasRequest) => {
        return (
          dasRequest?.response && (
            <div
              style={{
                display: "flex",
                gap: ".5em",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
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
            </div>
          )
        );
      },
    },
    {
      title: "Opciones",
      key: "options",
      render: (_, dasRequest) => (
        <Space>
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
        </Space>
      ),
    },
  ];
  return (
    <Table
      loading={dasApplicationsLoading}
      columns={columns}
      scroll={{ x: "max-content" }}
      dataSource={orderBy(dasApplications, "createAt", "desc")}
    />
  );
};
