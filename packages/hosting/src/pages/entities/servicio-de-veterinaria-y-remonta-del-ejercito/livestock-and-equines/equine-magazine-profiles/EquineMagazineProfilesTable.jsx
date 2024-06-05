import React from "react";
import { Space, Table } from "antd";
import { IconAction } from "../../../../../components";
import { faEdit, faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export const EquineMagazineProfilesTable = ({
  livestockOrEquineId,
  equineMagazineProfiles,
}) => {
  const navigate = useNavigate();

  const navigateTo = (equineMagazineProfileId) =>
    navigate(
      `/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/${livestockOrEquineId}/equine-magazine-profiles/${equineMagazineProfileId}`
    );

  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (_, equineMagazineProfile) => (
        <div>
          {moment(equineMagazineProfile?.createAt.toDate()).format(
            "DD/MM/YYYY"
          )}
        </div>
      ),
    },
    {
      title: "Condición Corporal",
      key: "bodyContition",
      dataIndex: "bodyContition",
      render: (_, equineMagazineProfile) => (
        <div>{equineMagazineProfile?.bodyCondition?.name}</div>
      ),
    },
    {
      title: "Toillete",
      dataIndex: "toillete",
      key: "toillete",
      render: (_, equineMagazineProfile) => (
        <div>{equineMagazineProfile?.toillete?.name}</div>
      ),
    },
    {
      title: "Herrado",
      key: "horseshoe",
      dataIndex: "horseshoe",
      render: (_, equineMagazineProfile) => (
        <div>{equineMagazineProfile?.horseshoe?.name}</div>
      ),
    },
    {
      title: "Acciones",
      key: "action",
      render: (_, equineMagazineProfile) => (
        <Space>
          <IconAction
            tooltipTitle="Pdf"
            icon={faFilePdf}
            styled={{ color: (theme) => theme.colors.error }}
            onClick={() =>
              navigate(
                `/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/${livestockOrEquineId}/equine-magazine-profiles/sheets`
              )
            }
          />
          <IconAction
            tooltipTitle="Editar"
            icon={faEdit}
            onClick={() => navigateTo(equineMagazineProfile.id)}
          />
          <IconAction
            tooltipTitle="Eliminar"
            icon={faTrash}
            styled={{ color: (theme) => theme.colors.error }}
            onClick={() => ""}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={equineMagazineProfiles}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};
