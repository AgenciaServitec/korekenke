import React from "react";
import { Space, Table } from "antd";
import { IconAction } from "../../../../../components";
import { faEdit, faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

export const ClinicHistoryTable = ({
  livestockAndEquines,
  loading,
  onConfirmRemoveClinicHistory,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (_, equine) => <div>{equine.date}</div>,
    },
    {
      title: "Sintomatología",
      key: "symptomatology",
      dataIndex: "symptomatology",
      render: (_, equine) => <div>{equine.symptomatology}</div>,
    },
    {
      title: "Diagnóstico",
      dataIndex: "diagnosis",
      key: "diagnosis",
      render: (_, equine) => <div>{equine.diagnosis}</div>,
    },
    {
      title: "Tratamiento",
      key: "treatment",
      dataIndex: "treatment",
      render: (_, equine) => <div>{equine.treatment}</div>,
    },
    {
      title: "Observaciones",
      dataIndex: "observations",
      key: "observations",
      render: (_, equine) => <div>{equine.observations}</div>,
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
            styled={{ color: (theme) => theme.colors.error }}
            onClick={() => onConfirmRemoveClinicHistory(equine)}
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
      loading={loading}
    />
  );
};
