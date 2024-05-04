import React, { memo } from "react";
import styled, { css } from "styled-components";
import moment from "moment";
import {
  Acl,
  IconAction,
  Space,
  TableVirtualized,
  Tag,
} from "../../components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleInfo,
  faEdit,
  faFilePdf,
  faPrint,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const CorrespondencesTable = ({
  correspondences,
  onClickEditCorrespondence,
  onClickDeleteCorrespondence,
  onClickPrintTicket,
}) => {
  const columns = [
    {
      title: "F. Creación",
      width: ["97px", "10%"],
      render: (correspondence) => (
        <CorrespondenceContainer>
          <Space direction="vertical">
            <div>
              <span>
                {moment(correspondence.createAt.toDate()).format("DD/MM/YYYY")}
              </span>
              <span>
                {moment(correspondence.createAt.toDate()).format("h:mm a")}
              </span>
            </div>
            <div>{correspondencesStatus(correspondence.status)}</div>
          </Space>
        </CorrespondenceContainer>
      ),
    },
    {
      title: "Destinatario",
      align: "center",
      width: ["130px", "15%"],
      render: (correspondence) => (
        <div className="capitalize">{correspondence?.destination}</div>
      ),
    },
    {
      title: "Recibido por",
      align: "center",
      width: ["130px", "15%"],
      render: (correspondence) => (
        <div className="capitalize">{correspondence?.receivedBy}</div>
      ),
    },
    {
      title: "Clase",
      align: "center",
      width: ["130px", "15%"],
      render: (correspondence) => (
        <div className="capitalize">{correspondence?.class}</div>
      ),
    },
    {
      title: "Indicativo",
      align: "center",
      width: ["130px", "10%"],
      render: (correspondence) => (
        <div className="capitalize">{correspondence?.indicative}</div>
      ),
    },
    {
      title: "Clasificación",
      align: "center",
      width: ["130px", "25%"],
      render: (correspondence) => (
        <div>
          <div className="capitalize">{correspondence?.classification}</div>
        </div>
      ),
    },
    {
      title: "Asunto",
      align: "center",
      width: ["130px", "15%"],
      render: (correspondence) => <div>{correspondence?.issue}</div>,
    },
    {
      title: "Archivos",
      align: "center",
      width: ["130px", "15%"],
      render: (correspondence) => (
        <div>
          <Space>
            {(correspondence?.documents || []).map((document, index) => (
              <a
                key={index}
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFilePdf} size="2x" />
              </a>
            ))}
          </Space>
        </div>
      ),
    },
    {
      title: "⚙️",
      width: ["70px", "15%"],
      render: (correspondence) => (
        <IconsActionWrapper>
          <Acl name="/correspondences/:correspondenceId">
            <IconAction
              className="pointer"
              onClick={() => onClickEditCorrespondence(correspondence.id)}
              styled={{ color: (theme) => theme.colors.tertiary }}
              icon={faEdit}
            />
          </Acl>
          <Acl name="/correspondences#delete">
            <IconAction
              className="pointer"
              onClick={() => onClickDeleteCorrespondence(correspondence.id)}
              styled={{ color: (theme) => theme.colors.error }}
              icon={faTrash}
            />
          </Acl>
          {correspondence.status === "accepted" && (
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
      rowBodyHeight={100}
    />
  );
};

export default memo(CorrespondencesTable);

const correspondencesStatus = (status) => {
  switch (status) {
    case "pending":
      return (
        <Tag color="processing" style={{ margin: 0 }}>
          <FontAwesomeIcon icon={faCircleInfo} /> Pendiente
        </Tag>
      );
    case "accepted":
      return (
        <Tag color="success" style={{ margin: 0 }}>
          <FontAwesomeIcon icon={faCheckCircle} /> Aceptado
        </Tag>
      );
  }
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
  flex-wrap: wrap;
  gap: 0.5em;
`;
