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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEnvelopeOpenText,
  faEye,
  faFilePdf,
  faPrint,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { CorrespondencesStatus } from "../../data-list";
import { useAuthentication, useGlobalData } from "../../providers";
import { fetchUser } from "../../firebase/collections";

export const CorrespondencesTable = ({
  correspondences,
  onChangeStatusToInProgress,
  onClickEditCorrespondence,
  onClickDeleteCorrespondence,
  onDecreeCorrespondence,
  onClickPrintTicket,
  onGoToDecreeSheets,
  onAddReplyCorrespondence,
  onShowReplyCorrespondenceInformation,
  onAddCorrespondenceReceivedBy,
  onCorrespondenceProceeds,
}) => {
  const { authUser } = useAuthentication();
  const { departments } = useGlobalData();
  const [departmentBossMP, setDepartmentBossMP] = useState({});
  const { departmentMP, setDepartmentMP } = useState({});

  useEffect(() => {
    (async () => {
      console.log(departments);
      const departmentMPBossId = departments.find(
        (_department) =>
          _department.commandId === "cobiene" &&
          _department.nameId === "mesa-de-partes",
      )?.bossId;

      const departmentMPboss = departmentMPBossId
        ? await fetchUser(departmentMPBossId)
        : {};
      setDepartmentBossMP(departmentMPboss);
    })();
  }, []);

  const isDepartmentBossMP = (correspondence) => {
    correspondence?.status === "pending";
  };

  const columns = [
    {
      title: "F. Creación",
      width: ["40px", "10%"],
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
      width: ["50px", "7%"],
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
      width: ["230px", "30%"],
      render: (correspondence) => <div>{correspondence?.issue}</div>,
    },
    {
      title: "Archivos",
      align: "center",
      width: ["130px", "15%"],
      render: (correspondence) => {
        const changeStatus = async () => {
          await onChangeStatusToInProgress(correspondence);
        };

        return (
          <div>
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
          </div>
        );
      },
    },
    {
      title: "Estado",
      align: "center",
      width: ["70px", "10%"],
      render: (correspondence) => {
        const status = CorrespondencesStatus?.[correspondence?.status];
        return (
          <Space>
            <Tag color={status?.color} style={{ margin: 0 }}>
              {status?.name}
            </Tag>
            {correspondence?.status === "pending" && (
              <IconAction
                className="pointer"
                tooltipTitle="Ver hoja de decreto"
                onClick={() => onGoToDecreeSheets(correspondence.id)}
                styled={{ color: (theme) => theme.colors.tertiary }}
                icon={faEye}
              />
            )}
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
            <Tag color={status ? "green" : "red"}>
              {status ? "Positivo" : "Negativo"}
            </Tag>
            <IconAction
              tooltipTitle="Ver detalle de respuesta"
              icon={faEye}
              size={30}
              styled={{ color: (theme) => theme.colors.info }}
              onClick={() => {
                if (correspondence?.response)
                  onShowReplyCorrespondenceInformation(correspondence);
              }}
            />
          </Space>
        );
      },
    },
    {
      title: "Opciones",
      align: "center",
      width: ["130px", "30%"],
      render: (correspondence) => (
        <IconsActionWrapper>
          {!isDepartmentBossMP(correspondence) && (
            <IconAction
              tooltipTitle="Responder"
              icon={faReply}
              styled={{ color: (theme) => theme.colors.primary }}
              onClick={() => onCorrespondenceProceeds(correspondence)}
            />
          )}
          {correspondence?.status === "notDecreed" && (
            <IconAction
              tooltipTitle="Recibido por"
              icon={faEnvelopeOpenText}
              onClick={() => onAddCorrespondenceReceivedBy(correspondence)}
            />
          )}
          {correspondence?.status !== "finalized" && (
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
              className="pointer"
              onClick={() => onClickEditCorrespondence(correspondence.id)}
              styled={{ color: (theme) => theme.colors.tertiary }}
              icon={faEdit}
            />
          </Acl>
          {correspondence?.status === "finalized" && (
            <IconAction
              className="pointer"
              onClick={() => onClickPrintTicket(correspondence.id)}
              styled={{ color: (theme) => theme.colors.info }}
              icon={faPrint}
            />
          )}
        </IconsActionWrapper>
      ),
    },
  ];

  return (
    <TableVirtualized
      dataSource={correspondences}
      columns={columns}
      rowHeaderHeight={50}
      rowBodyHeight={150}
    />
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
