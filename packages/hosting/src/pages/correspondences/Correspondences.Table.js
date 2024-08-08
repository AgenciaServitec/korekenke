import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import dayjs from "dayjs";
import {
  Acl,
  IconAction,
  Space,
  TableVirtualized,
  Tag,
} from "../../components/ui";
import { Row, Col } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEnvelopeOpenText,
  faEye,
  faFilePdf,
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

  const _entityGuDasManagerView = correspondences.filter(
    (correspondence) =>
      !["waiting", "notProceeds"].includes(correspondence.status),
  );

  const _departmentMPBossView = correspondences.filter(
    (correspondence) =>
      ["waiting", "notProceeds"].includes(correspondence.status) ===
      ["department_boss"].includes(authUser.roleCode),
  );

  const _correspondencesPublicView = correspondences.filter((correspondence) =>
    ["super_admin"].includes(authUser.roleCode)
      ? true
      : correspondence.userId === authUser.userId,
  );

  const columns = [
    {
      title: "F. Creación",
      width: ["80px", "10%"],
      render: (correspondence) => (
        <CorrespondenceContainer>
          <Space direction="vertical">
            <div>
              <span>
                {dayjs(correspondence.createAt.toDate()).format(
                  "DD/MM/YYYY HH:mm",
                )}
              </span>
            </div>
          </Space>
        </CorrespondenceContainer>
      ),
    },
    {
      title: "Destinatario",
      align: "center",
      width: ["100px", "10%"],
      render: (correspondence) => (
        <div className="capitalize">{correspondence?.destination}</div>
      ),
    },
    {
      title: "Recibido por",
      align: "center",
      width: ["100px", "10%"],
      render: (correspondence) => (
        <div className="capitalize">{correspondence?.receivedBy}</div>
      ),
    },
    {
      title: "Clase",
      align: "center",
      width: ["100px", "10%"],
      render: (correspondence) => (
        <div className="capitalize">{correspondence?.class}</div>
      ),
    },
    {
      title: "Indicativo",
      align: "center",
      width: ["100px", "7%"],
      render: (correspondence) => (
        <div className="capitalize">{correspondence?.indicative}</div>
      ),
    },
    {
      title: "Clasificación",
      align: "center",
      width: ["100px", "15%"],
      render: (correspondence) => (
        <div>
          <div className="capitalize">{correspondence?.classification}</div>
        </div>
      ),
    },
    {
      title: "Asunto",
      align: "center",
      width: ["200px", "30%"],
      render: (correspondence) => <div>{correspondence?.issue}</div>,
    },
    {
      title: "Archivos",
      align: "center",
      width: ["100px", "15%"],
      render: (correspondence) => {
        const changeStatus = async () => {
          await onChangeStatusToInProgress(correspondence);
        };

        return (
          <div>
            {(["pending", "inProgress", "finalized"].includes(
              correspondence.status,
            ) ||
              ["super_admin", "user"].includes(authUser.roleCode)) && (
              <Space align="center">
                {(correspondence?.documents || []).map((document, index) => (
                  <a
                    key={index}
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={changeStatus}
                  >
                    <FontAwesomeIcon icon={faFilePdf} size="2x" />
                  </a>
                ))}
              </Space>
            )}
          </div>
        );
      },
    },
    {
      title: "Estado",
      align: "center",
      width: ["50px", "10%"],
      render: (correspondence) => {
        const status = CorrespondencesStatus?.[correspondence?.status];
        return (
          <Space>
            <Tag color={status?.color} style={{ margin: 0 }}>
              {status?.name}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "Respuesta",
      align: "center",
      width: ["130px", "30%"],
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
      title: "Acciones",
      align: "center",
      width: ["130px", "30%"],
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
        {authUser.roleCode === "manager" && (
          <TableVirtualized
            dataSource={_entityGuDasManagerView}
            columns={columns}
            rowHeaderHeight={50}
            rowBodyHeight={150}
          />
        )}

        {authUser.roleCode === "department_boss" && (
          <TableVirtualized
            dataSource={_departmentMPBossView}
            columns={columns}
            rowHeaderHeight={50}
            rowBodyHeight={150}
          />
        )}

        {["super_admin", "user"].includes(authUser.roleCode) && (
          <TableVirtualized
            dataSource={_correspondencesPublicView}
            columns={columns}
            rowHeaderHeight={50}
            rowBodyHeight={150}
          />
        )}
      </Col>
    </Row>
  );
};

const CorrespondenceContainer = styled.div`
  ${({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .purchase-number {
      margin-top: ${theme.paddings.small};
      font-size: ${theme.font_sizes.xx_small};
      font-weight: ${theme.font_weight.medium};
    }
  `}
`;

const IconsActionWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;
`;
