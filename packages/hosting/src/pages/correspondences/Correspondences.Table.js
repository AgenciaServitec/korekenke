import React, { memo } from "react";
import styled, { css } from "styled-components";
import moment from "moment";
import { IconAction, TableVirtualized, Tag } from "../../components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleInfo,
  faPrint,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const CorrespondencesTable = ({
  correspondences,
  onClickDeleteCorrespondence,
  onClickPrintTicket,
}) => {
  const columns = [
    {
      title: "Fecha creación",
      width: ["97px", "10%"],
      render: (correspondence) => (
        <CorrespondenceContainer>
          <span>
            {moment(correspondence.createAt.toDate()).format("DD/MM/YYYY")}
          </span>
          <span>
            {moment(correspondence.createAt.toDate()).format("h:mm a")}
          </span>
          <br />
          <span>{correspondencesStatus(correspondence)}</span>
        </CorrespondenceContainer>
      ),
    },
    {
      title: "Destinatario",
      align: "center",
      width: ["130px", "15%"],
      render: (correspondence) => <div>{correspondence?.destination}</div>,
    },
    {
      title: "Recibido por",
      align: "center",
      width: ["130px", "15%"],
      render: (correspondence) => <div>{correspondence?.receivedBy}</div>,
    },
    {
      title: "Clase",
      align: "center",
      width: ["130px", "15%"],
      render: (correspondence) => <div>{correspondence?.class}</div>,
    },
    {
      title: "Indicativo",
      align: "center",
      width: ["130px", "10%"],
      render: (correspondence) => <div>{correspondence?.indicative}</div>,
    },
    {
      title: "Clasificación",
      align: "center",
      width: ["130px", "25%"],
      render: (correspondence) => (
        <div>
          <div>{correspondence?.classification}</div>
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
      render: () => <div>Files</div>,
    },
    {
      title: "⚙️",
      width: ["70px", "15%"],
      render: (correspondence) => (
        <IconsActionWrapper>
          <IconAction
            className="pointer"
            onClick={() => onClickDeleteCorrespondence(correspondence.id)}
            styled={{ color: (theme) => theme.colors.error }}
            icon={faTrash}
          />
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
      rowBodyHeight={150}
    />
  );
};

export default memo(CorrespondencesTable);

const correspondencesStatus = (correspondence) => {
  switch (correspondence.status) {
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
