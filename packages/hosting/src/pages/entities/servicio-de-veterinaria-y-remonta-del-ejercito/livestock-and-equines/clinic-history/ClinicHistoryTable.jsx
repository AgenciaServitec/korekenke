import React from "react";
import { Space, Table } from "antd";
import { Acl, IconAction } from "../../../../../components";
import { faEdit, faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

export const ClinicHistoryTable = ({
  clinicHistories,
  loading,
  livestockAndEquineId,
  onConfirmRemoveClinicHistory,
  onSetIsVisibleModal,
  onSetClinicHistoryId,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (_, clinicHistory) => <div>{clinicHistory.date}</div>,
    },
    {
      title: "Sintomatología",
      key: "symptomatology",
      dataIndex: "symptomatology",
      render: (_, clinicHistory) => <div>{clinicHistory.symptomatology}</div>,
    },
    {
      title: "Diagnóstico",
      dataIndex: "diagnosis",
      key: "diagnosis",
      render: (_, clinicHistory) => <div>{clinicHistory.diagnosis}</div>,
    },
    {
      title: "Tratamiento",
      key: "treatment",
      dataIndex: "treatment",
      render: (_, clinicHistory) => <div>{clinicHistory.treatment}</div>,
    },
    {
      title: "Observaciones",
      dataIndex: "observations",
      key: "observations",
      render: (_, clinicHistory) => <div>{clinicHistory.observations}</div>,
    },
    {
      title: "Acciones",
      key: "action",
      render: (_, clinicHistory) => (
        <Space>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="clinicHistory"
            name="/livestock-and-equines/:livestockAndEquineId/clinic-history/:clinicHistoryId/pdf-clinic-history"
          >
            <IconAction
              tooltipTitle="Pdf"
              icon={faFilePdf}
              styled={{ color: (theme) => theme.colors.error }}
              onClick={() =>
                navigate(`${livestockAndEquineId}/pdf-clinic-history`)
              }
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="clinicHistory"
            name="/livestock-and-equines/:livestockAndEquineId/clinic-history/:clinicHistoryId"
          >
            <IconAction
              tooltipTitle="Editar"
              icon={faEdit}
              onClick={() => {
                onSetClinicHistoryId(clinicHistory.id);
                onSetIsVisibleModal();
              }}
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="clinicHistory"
            name="/livestock-and-equines/:livestockAndEquineId/clinic-history#delete"
          >
            <IconAction
              tooltipTitle="Eliminar"
              icon={faTrash}
              styled={{ color: (theme) => theme.colors.error }}
              onClick={() => onConfirmRemoveClinicHistory(clinicHistory)}
            />
          </Acl>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={clinicHistories}
      pagination={false}
      scroll={{ x: "max-content" }}
      loading={loading}
    />
  );
};
