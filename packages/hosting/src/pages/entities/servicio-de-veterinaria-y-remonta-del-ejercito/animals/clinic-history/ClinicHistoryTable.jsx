import React from "react";
import { Acl, IconAction, Space, Table, Tag } from "../../../../../components";
import {
  faClipboardCheck,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { orderBy } from "lodash";
import dayjs from "dayjs";

export const ClinicHistoryTable = ({
  clinicHistories,
  onConfirmRemoveClinicHistory,
  onSetIsVisibleModal,
  onSetIsVisibleCheckModal,
  onSetClinicHistoryId,
  loading,
  user,
  PEL_VET_DEL_RC_MDN_EPR_boss,
}) => {
  const columns = [
    {
      title: "Fecha creación",
      key: "createAt",
      dataIndex: "createAt",
      render: (_, clinicHistory) =>
        dayjs(clinicHistory.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Sintomatología",
      key: "symptomatology",
      width: 300,
      dataIndex: "symptomatology",
    },
    {
      title: "Diagnóstico",
      key: "diagnosis",
      width: 300,
      dataIndex: "diagnosis",
    },
    {
      title: "Tratamiento",
      key: "treatment",
      width: 300,
      dataIndex: "treatment",
    },
    {
      title: "Estado",
      key: "status",
      align: "center",
      dataIndex: "status",
      render: (_, clinicHistory) =>
        clinicHistory?.status && (
          <Space>
            <span>
              <Tag
                color={
                  clinicHistory?.status === "pending" ? "warning" : "success"
                }
              >
                {clinicHistory?.status === "pending" ? "Pendiente" : "Revisado"}
              </Tag>
            </span>
          </Space>
        ),
    },
    {
      title: "Acciones",
      align: "center",
      key: "action",
      render: (_, clinicHistory) => (
        <>
          {clinicHistory?.status === "pending" && (
            <Space>
              {PEL_VET_DEL_RC_MDN_EPR_boss?.id === user.id && (
                <Acl
                  category="servicio-de-veterinaria-y-remonta-del-ejercito"
                  subCategory="clinicHistory"
                  name="/animals/:animalId/clinic-history#clinicHistoryReview"
                >
                  <IconAction
                    tooltipTitle="Revisar"
                    icon={faClipboardCheck}
                    onClick={() => {
                      onSetClinicHistoryId(clinicHistory.id);
                      onSetIsVisibleCheckModal();
                    }}
                  />
                </Acl>
              )}
              <Acl
                category="servicio-de-veterinaria-y-remonta-del-ejercito"
                subCategory="clinicHistory"
                name="/animals/:animalId/clinic-history/:clinicHistoryId"
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
                name="/animals/:animalId/clinic-history#delete"
              >
                <IconAction
                  tooltipTitle="Eliminar"
                  icon={faTrash}
                  styled={{ color: (theme) => theme.colors.error }}
                  onClick={() => onConfirmRemoveClinicHistory(clinicHistory)}
                />
              </Acl>
            </Space>
          )}
        </>
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
