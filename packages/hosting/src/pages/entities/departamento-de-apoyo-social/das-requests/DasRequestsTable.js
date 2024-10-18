import React, { useEffect, useState } from "react";
import {
  Acl,
  IconAction,
  notification,
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
  faPaperPlane,
  faReply,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { isEmpty, orderBy } from "lodash";
import { DasRequestStatus } from "../../../../data-list";
import { useNavigate } from "react-router";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import { entitiesRef } from "../../../../firebase/collections";
import { fetchCollectionOnce } from "../../../../firebase/firestore";
import { useAuthentication } from "../../../../providers";
import { useAPiSendMailNotificationDasRequestPost } from "../../../../api";
import { updateDasApplication } from "../../../../firebase/collections/dasApplications";

export const DasRequestsTable = ({
  dasApplications,
  onEditDasRequest,
  onDeleteDasRequest,
  onAddReplyDasRequest,
  onShowReplyDasRequestInformation,
  onDasRequestProceeds,
  user,
}) => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { postSendMailNotificationDasRequestPost } =
    useAPiSendMailNotificationDasRequestPost();

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

  const onResendNotificationDasRequestPost = async (dasRequest) => {
    try {
      await postSendMailNotificationDasRequestPost(dasRequest.id);

      await updateDasApplication(dasRequest.id, {
        sendNotificationDasRequest: true,
      });

      notification({ type: "success" });
    } catch (e) {
      console.log(e);
      notification({ type: "error" });
    }
  };

  const isPositiveOrApproved = (dasRequest) =>
    dasRequest?.status === "finalized" ||
    dasRequest?.status === "inProgess" ||
    dasRequest?.response?.type === "positive";

  const isSendNotificationDasRequest = (dasRequest) =>
    !isEmpty(dasRequest?.sendNotificationDasRequest) ||
    dasRequest?.sendNotificationDasRequest === true;

  const isFinalized = (dasRequest) => dasRequest?.status === "finalized";

  const dasApplicationsViewBy = dasApplications.filter((dasApplication) => {
    if (["super_admin"].includes(authUser.roleCode)) return dasApplication;

    if (dasApplication.userId === authUser.id) return dasApplication;

    if (
      ["waiting", "notProceeds"].includes(dasApplication.status) ===
      ["department_boss"].includes(authUser.roleCode)
    )
      return dasApplication;

    if (
      !["waiting", "notProceeds"].includes(dasApplication.status) ===
      ["manager"].includes(authUser.roleCode)
    )
      return dasApplication;
  });

  const columns = [
    {
      title: "Fecha creación",
      align: "center",
      width: ["9rem", "100%"],
      render: (dasRequest) =>
        dayjs(dasRequest.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Titular",
      align: "center",
      width: ["15rem", "100%"],
      render: (dasRequest) => userFullName(dasRequest.headline),
    },
    {
      title: "Solicitud / Institución",
      align: "center",
      width: ["20rem", "100%"],
      render: (dasRequest) => {
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
      align: "center",
      width: ["12rem", "100%"],
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
      width: ["8rem", "100%"],
      render: (dasRequest) => {
        const requestStatus = DasRequestStatus[dasRequest.status];

        return <Tag color={requestStatus?.color}>{requestStatus?.name}</Tag>;
      },
    },
    {
      title: "Respuesta",
      align: "center",
      width: ["9rem", "100%"],
      render: (dasRequest) => {
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
      width: ["14rem", "100%"],
      render: (dasRequest) => (
        <Space>
          <Acl
            category="public"
            subCategory="dasRequests"
            name="/das-requests/:dasRequestId#sendNotificationDasRequest"
          >
            {!isSendNotificationDasRequest(dasRequest) && (
              <IconAction
                tooltipTitle="Reenviar notificación"
                icon={faPaperPlane}
                onClick={() => onResendNotificationDasRequestPost(dasRequest)}
              />
            )}
          </Acl>
          <Acl
            category="public"
            subCategory="dasRequests"
            name="/das-requests/:dasRequestId#proceeds"
          >
            <IconAction
              tooltipTitle="Evaluación de solicitud"
              icon={faFilter}
              onClick={() => onDasRequestProceeds(dasRequest)}
            />
          </Acl>
          {entity?.entityManageId === user?.id && !isFinalized(dasRequest) && (
            <Acl
              category="public"
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
          {!isFinalized(dasRequest) && (
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
          {!isPositiveOrApproved(dasRequest) &&
            dasRequest.headline.id !== user.id && (
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
        dataSource={orderBy(dasApplicationsViewBy, "createAt", "desc")}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={150}
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
