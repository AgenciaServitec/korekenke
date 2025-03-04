import React, { useEffect, useState } from "react";
import {
  Acl,
  IconAction,
  Space,
  TableVirtualized,
  Tag,
} from "../../../../components";
import { findDasRequest, userFullName } from "../../../../utils";
import dayjs from "dayjs";
import {
  faEdit,
  faEye,
  faFilePdf,
  faFilter,
  faReply,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { orderBy } from "lodash";
import { DasRequestStatus } from "../../../../data-list";
import { useNavigate } from "react-router";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import { useAuthentication } from "../../../../providers";
import { useBosses } from "../../../../hooks";

const ENTITY_GU_NAME_ID = "departamento-de-apoyo-social";
const DEPARTMENT_NAME_ID = "mesa-de-partes";

export const DasRequestsTable = ({
  dasRequests,
  onEditDasRequest,
  onDeleteDasRequest,
  onShowDasRequestProceedsModal,
  onShowReplyDasRequestModal,
  onShowReplyDasRequestInformationModal,
  user,
  dasRequestsLoading,
}) => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
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

  const isManagerEntityGu = user.id === bossEntityGu?.id;
  const isBossMDP = user.id === bossMDP?.id;

  const navigateTo = (pathname) => navigate(pathname);

  const isPositiveOrApproved = (dasRequest) =>
    dasRequest?.status === "finalized" ||
    dasRequest?.status === "inProgress" ||
    dasRequest?.response?.type === "positive";

  const isWaiting = (dasRequest) => dasRequest?.status === "waiting";
  const isFinalized = (dasRequest) => dasRequest?.status === "finalized";
  const isProceeds = (dasRequest) => dasRequest?.status === "finalized";

  const dasRequestsView = dasRequests.filter((dasRequest) => {
    // Das requests for super-admin
    if (["super_admin"].includes(authUser.roleCode)) return dasRequest;

    // Das requests for user
    if (dasRequest.userId === authUser.id) return dasRequest;

    // Das requests for Boss - mesa de partes
    if (
      ["waiting", "notProceeds", "proceeds"].includes(dasRequest.status) &&
      isBossMDP
    )
      return dasRequest;

    // Das requests for manager
    if (
      !["waiting", "notProceeds"].includes(dasRequest.status) &&
      isManagerEntityGu
    )
      return dasRequest;
  });

  const columns = [
    {
      title: "F. Creación",
      align: "center",
      width: ["7rem", "100%"],
      render: (dasRequest) =>
        dayjs(dasRequest.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Titular",
      align: "center",
      width: ["15rem", "100%"],
      render: (dasRequest) => (
        <Space align="center" direction="vertical">
          <div>{userFullName(dasRequest.headline)}</div>
          <div>
            CIP: <strong>{dasRequest.headline.cip}</strong>
          </div>
        </Space>
      ),
    },
    {
      title: "Solicitud / Institución",
      align: "center",
      width: ["20rem", "100%"],
      render: (dasRequest) => {
        return (
          <Space align="center" direction="vertical" className="capitalize">
            <div>{findDasRequest(dasRequest?.requestType)?.name}</div>
            <div>
              <strong>{dasRequest?.institution?.id}</strong>
            </div>
            <div>Para: {dasRequest?.isHeadline ? "Titular" : "Familiar"}</div>
          </Space>
        );
      },
    },
    {
      title: "Contácto",
      align: "center",
      width: ["14rem", "100%"],
      render: (dasRequest) => (
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
      width: ["5rem", "100%"],
      render: (dasRequest) => {
        const requestStatus = DasRequestStatus[dasRequest.status];

        return <Tag color={requestStatus?.color}>{requestStatus?.name}</Tag>;
      },
    },
    {
      title: "Respuesta",
      align: "center",
      width: ["7rem", "100%"],
      render: (dasRequest) => {
        const status = dasRequest?.response?.type === "positive";
        return (
          dasRequest?.response && (
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
                onClick={() =>
                  onShowReplyDasRequestInformationModal(dasRequest)
                }
              />
            </Space>
          )
        );
      },
    },
    {
      title: "Opciones",
      align: "center",
      width: ["14rem", "100%"],
      render: (dasRequest) => (
        <Space>
          <Acl
            category="public"
            subCategory="dasRequests"
            name="/das-requests/:dasRequestId#proceeds"
          >
            {["waiting", "notProceeds"].includes(dasRequest.status) && (
              <IconAction
                tooltipTitle="Evaluación de solicitud"
                icon={faFilter}
                onClick={() => onShowDasRequestProceedsModal(dasRequest)}
              />
            )}
          </Acl>
          {isManagerEntityGu && dasRequest?.status === "inProgress" && (
            <Acl
              category="public"
              subCategory="dasRequests"
              name="/das-requests/:dasRequestId#reply"
            >
              <IconAction
                tooltipTitle="Responder solicitud"
                icon={faReply}
                styled={{ color: (theme) => theme.colors.primary }}
                onClick={() => onShowReplyDasRequestModal(dasRequest)}
              />
            </Acl>
          )}
          <Acl
            category="public"
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
          {isWaiting(dasRequest) && (
            <Acl
              category="public"
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
          {((!isPositiveOrApproved(dasRequest) &&
            user.roleCode === "manager") ||
            dasRequest.headline.id === user.id) && (
            <Acl
              category="public"
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
      <TableVirtualized
        dataSource={orderBy(dasRequestsView, "createAt", "desc")}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={150}
        loading={dasRequestsLoading}
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
