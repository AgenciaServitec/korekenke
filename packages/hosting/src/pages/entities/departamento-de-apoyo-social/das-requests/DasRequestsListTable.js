import React from "react";
import { IconAction, Space, Table } from "../../../../components";
import { userFullName } from "../../../../utils";
import dayjs from "dayjs";
import { faEdit, faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";

export const DasRequestsListTable = ({
  dasApplications,
  onEditDasRequest,
  onDeleteDasRequest,
}) => {
  const columns = [
    {
      title: "Fecha de Creación",
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
      title: "Institución",
      key: "institution",
      render: (_, dasRequest) => dasRequest.institution.name,
    },
    {
      title: "E-mail",
      key: "email",
      render: (_, dasRequest) => dasRequest.headline.email,
    },
    {
      title: "Opciones",
      key: "Options",
      render: (_, dasRequest) => (
        <Space>
          <IconAction
            tooltipTitle="PDF"
            icon={faFilePdf}
            styled={{ color: (theme) => theme.colors.error }}
            onClick={() => console.log("PDF")}
          />
          <IconAction
            tooltipTitle="Editar"
            icon={faEdit}
            onClick={() => onEditDasRequest(dasRequest)}
          />
          <IconAction
            tooltipTitle="Eliminar"
            icon={faTrash}
            styled={{ color: (theme) => theme.colors.error }}
            onClick={() => onDeleteDasRequest(dasRequest)}
          />
        </Space>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      scroll={{ x: "max-content" }}
      dataSource={dasApplications}
    />
  );
};
