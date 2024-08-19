import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Acl,
  IconAction,
  ShowImagesAndDocumentsModal,
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
  faPrint,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { CorrespondencesStatus } from "../../data-list";
import { useAuthentication } from "../../providers";
import { fetchDepartmentBoss, fetchEntityManager } from "../../utils";

export const CorrespondencesTable = ({
  correspondences,
  onChangeStatusToInProgress,
  onClickEditCorrespondence,
  onClickPrintTicket,
  onAddReplyCorrespondence,
  onShowReplyCorrespondenceInformation,
  onAddCorrespondenceReceivedBy,
  onCorrespondenceProceeds,
}) => {
  const { authUser } = useAuthentication();
  const [departmentMPBoss, setDepartmentMPBoss] = useState({});
  const [entityGuDASBoss, setEntityGuDASBoss] = useState({});
  const [isVisibleFiles, setIsVisibleFiles] = useState(false);
  const [correspondence, setCorrespondence] = useState(null);

  const entityGuDASNameId = "departamento-de-apoyo-social";
  const departmentNameId = "mesa-de-partes";

  useEffect(() => {
    (async () => {
      const _entityDasBoss = await fetchEntityManager(entityGuDASNameId);
      const _departmentMpBoss = await fetchDepartmentBoss(departmentNameId);

      setEntityGuDASBoss(_entityDasBoss);
      setDepartmentMPBoss(_departmentMpBoss);
    })();
  }, []);

  const correspondencesViewBy = correspondences.filter((correspondence) => {
    if (["super_admin"].includes(authUser.roleCode)) return correspondence;

    if (correspondence.userId === authUser.id) return correspondence;

    if (
      ["waiting", "notProceeds"].includes(correspondence.status) ===
      ["department_boss"].includes(authUser.roleCode)
    )
      return correspondence;

    if (
      !["waiting", "notProceeds"].includes(correspondence.status) ===
      ["department_boss"].includes(authUser.roleCode)
    )
      return correspondence;
  });

  const onShowFiles = async (correspondence) => {
    setCorrespondence(correspondence);
    setIsVisibleFiles(true);

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
              correspondence.status
            ) ||
              ["super_admin", "user"].includes(authUser.roleCode)) && (
              <Space align="center">
                <IconAction
                  tooltipTitle="Ver archivos"
                  icon={faEye}
                  onClick={() => onShowFiles(correspondence)}
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
          {departmentMPBoss.id === authUser.id && (
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
            entityGuDASBoss.id === authUser.id && (
              <IconAction
                tooltipTitle="Recibido por"
                icon={faEnvelopeOpenText}
                onClick={() => onAddCorrespondenceReceivedBy(correspondence)}
              />
            )}
          {correspondence?.status === "inProgress" &&
            authUser.id === entityGuDASBoss.id && (
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
          {correspondence?.status === "finalized" && (
            <Acl
              category="public"
              subCategory="correspondences"
              name="/correspondences/:correspondenceId#"
            >
              <IconAction
                className="pointer"
                onClick={() => onClickPrintTicket(correspondence.id)}
                styled={{ color: (theme) => theme.colors.info }}
                icon={faPrint}
              />
            </Acl>
          )}
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
      <ShowImagesAndDocumentsModal
        title="Archivos de Correspondencia"
        images={correspondence?.photos}
        documents={correspondence?.documents}
        isVisibleModal={isVisibleFiles}
        onSetIsVisibleModal={setIsVisibleFiles}
      />
    </Row>
  );
};
