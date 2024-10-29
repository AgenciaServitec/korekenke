import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Acl,
  IconAction,
  Space,
  TableVirtualized,
  Tag,
} from "../../components/ui";
import { Col, Row } from "../../components";
import {
  faEdit,
  faEnvelopeOpenText,
  faEye,
  faFilter,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { CorrespondencesStatus } from "../../data-list";
import { useAuthentication } from "../../providers";
import { fetchDepartmentBoss, fetchEntityManager } from "../../utils";

export const CorrespondencesTable = ({
  entityGuDASNameId,
  departmentNameId,
  correspondences,
  onClickEditCorrespondence,
  onAddReplyCorrespondence,
  onShowReplyCorrespondenceInformation,
  onAddCorrespondenceReceivedBy,
  onCorrespondenceProceeds,
  onCorrespondenceFiles,
  onChangeStatusToInProgress,
}) => {
  const { authUser } = useAuthentication();
  const [bossEntityGu, setBossEntityGu] = useState({});
  const [bossMDP, setBossMDP] = useState({});

  useEffect(() => {
    (async () => {
      const p0 = fetchEntityManager(entityGuDASNameId);
      const p1 = fetchDepartmentBoss(departmentNameId);

      const [_bossEntityGu, _bossMDP] = await Promise.all([p0, p1]);

      setBossEntityGu(_bossEntityGu);
      setBossMDP(_bossMDP);
    })();
  }, []);

  const isBossMDP = authUser.id === bossMDP?.id;

  const correspondencesViewBy = correspondences.filter((correspondence) => {
    if (["super_admin"].includes(authUser.roleCode)) return correspondence;

    if (correspondence.userId === authUser.id) return correspondence;

    if (["waiting", "notProceeds"].includes(correspondence.status) && isBossMDP)
      return correspondence;

    if (
      !["waiting", "notProceeds"].includes(correspondence.status) ===
      ["manager"].includes(authUser.roleCode)
    )
      return correspondence;
  });

  const onShowCorrespondenceFiles = async (correspondence) => {
    onCorrespondenceFiles(correspondence);

    if (correspondence.status === "inProgress") return;

    await onChangeStatusToInProgress(correspondence);
  };

  const columns = [
    {
      title: "F. Creación",
      align: "center",
      width: ["9rem", "100%"],
      render: (dasRequest) =>
        dayjs(dasRequest.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Destinatario",
      align: "center",
      width: ["10rem", "100%"],
      render: (correspondence) => (
        <div className="capitalize">{correspondence?.destination}</div>
      ),
    },
    {
      title: "Recibido por",
      align: "center",
      width: ["10rem", "100%"],
      render: (correspondence) => (
        <div className="capitalize">{correspondence?.receivedBy}</div>
      ),
    },
    {
      title: "Asunto",
      align: "center",
      width: ["10rem", "100%"],
      render: (correspondence) => <div>{correspondence?.issue}</div>,
    },
    {
      title: "Archivos",
      align: "center",
      width: ["5rem", "100%"],
      render: (correspondence) => {
        return (
          <div>
            {(["pending", "inProgress", "finalized"].includes(
              correspondence.status,
            ) ||
              ["super_admin", "user"].includes(authUser.roleCode)) && (
              <Space align="center">
                <IconAction
                  tooltipTitle="Ver archivos"
                  icon={faEye}
                  onClick={() => onShowCorrespondenceFiles(correspondence)}
                />
              </Space>
            )}
          </div>
        );
      },
    },
    {
      title: "Estado",
      align: "center",
      width: ["6rem", "100%"],
      render: (correspondence) => {
        const status = CorrespondencesStatus?.[correspondence?.status];
        return <Tag color={status?.color}>{status?.name}</Tag>;
      },
    },
    {
      title: "Respuesta",
      align: "center",
      width: ["8rem", "100%"],
      render: (correspondence) => {
        const status = correspondence?.response?.type === "positive";
        return (
          <Space>
            {correspondence?.response && (
              <>
                <Tag color={status ? "green" : "red"}>
                  {status ? "Positivo" : "Negativo"}
                </Tag>
                <IconAction
                  tooltipTitle="Ver detalle de respuesta"
                  icon={faEye}
                  size={30}
                  styled={{ color: (theme) => theme.colors.info }}
                  onClick={() =>
                    onShowReplyCorrespondenceInformation(correspondence)
                  }
                />
              </>
            )}
          </Space>
        );
      },
    },
    {
      title: "Opciones",
      align: "center",
      width: ["14rem", "100%"],
      render: (correspondence) => (
        <Space>
          {bossMDP.id === authUser.id && (
            <Acl
              category="public"
              subCategory="correspondences"
              name="/correspondences/:correspondenceId#proceeds"
            >
              <IconAction
                tooltipTitle="Evaluación solicitud"
                icon={faFilter}
                onClick={() => onCorrespondenceProceeds(correspondence)}
              />
            </Acl>
          )}
          {correspondence?.status === "proceeds" &&
            bossEntityGu.id === authUser.id && (
              <IconAction
                tooltipTitle="Recibido por"
                icon={faEnvelopeOpenText}
                onClick={() => onAddCorrespondenceReceivedBy(correspondence)}
              />
            )}
          {correspondence?.status === "inProgress" &&
            authUser.id === bossEntityGu.id && (
              <Acl
                category="public"
                subCategory="correspondences"
                name="/correspondences/:correspondenceId#reply"
              >
                <IconAction
                  tooltipTitle="Responder solicitud"
                  icon={faReply}
                  styled={{ color: (theme) => theme.colors.primary }}
                  onClick={() => onAddReplyCorrespondence(correspondence)}
                />
              </Acl>
            )}
          <Acl
            category="public"
            subCategory="correspondences"
            name="/correspondences/:correspondenceId"
          >
            <IconAction
              tooltipTitle="Editar"
              onClick={() => onClickEditCorrespondence(correspondence.id)}
              styled={{ color: (theme) => theme.colors.tertiary }}
              icon={faEdit}
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
          dataSource={correspondencesViewBy}
          columns={columns}
          rowHeaderHeight={50}
          rowBodyHeight={150}
        />
      </Col>
    </Row>
  );
};
