import React from "react";
import { Space, Table } from "antd";
import { Acl, IconAction } from "../../../../../components";
import { faEdit, faTrash, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

export const ClinicHistoryTable = ({ livestockAndEquines }) => {
  const navigate = useNavigate();

  console.log(livestockAndEquines);

  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (_) => <div>{_}</div>,
    },
    {
      title: "Sintomatología",
      key: "symptomatology",
      dataIndex: "symptomatology",
      render: (_) => <div>{_}</div>,
    },
    {
      title: "Diagnóstico",
      dataIndex: "diagnosis",
      key: "diagnosis",
      render: (_) => <div>{_}</div>,
    },
    {
      title: "Tratamiento",
      key: "treatment",
      dataIndex: "treatment",
      render: (_) => <div>{_}</div>,
    },
    {
      title: "Observaciones",
      dataIndex: "observations",
      key: "observations",
      render: (_) => <div>{_}</div>,
    },
    {
      title: "Acciones",
      key: "action",
      render: (_, equine) => (
        <Space>
          <IconAction
            tooltipTitle="Pdf"
            icon={faFilePdf}
            styled={{ color: (theme) => theme.colors.error }}
            onClick={() =>
              navigate(
                `/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/${equine.id}/clinic-history/sheets`
              )
            }
          />
          <IconAction
            tooltipTitle="Eliminar"
            icon={faTrash}
            onClick={() => ""}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={livestockAndEquines}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};
