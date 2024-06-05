import React from "react";
import { Space, Table } from "antd";
import { Acl, IconAction } from "../../../../../components";
import { faEdit, faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { orderBy } from "lodash";
import moment from "moment";

export const ClinicHistoryTable = ({
  clinicHistories,
  loading,
  onConfirmRemoveClinicHistory,
  onSetIsVisibleModal,
  onSetClinicHistoryId,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Fecha creación",
      dataIndex: "createAt",
      key: "createAt",
      render: (_, clinicHistory) =>
        moment(clinicHistory.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Sintomatología",
      key: "symptomatology",
      dataIndex: "symptomatology",
    },
    {
      title: "Diagnóstico",
      dataIndex: "diagnosis",
      key: "diagnosis",
    },
    {
      title: "Tratamiento",
      key: "treatment",
      dataIndex: "treatment",
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
              onClick={() => navigate(`${clinicHistory.id}/pdf-clinic-history`)}
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
      dataSource={orderBy(clinicHistories, "createAt", "desc")}
      pagination={false}
      scroll={{ x: "max-content" }}
      loading={loading}
    />
  );
};
