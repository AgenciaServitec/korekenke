import React from "react";
import { Space, Table } from "antd";
import { Acl, IconAction } from "../../../../../components";
import { faEdit, faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export const EquineMagazineProfilesTable = ({
  equineMagazineProfiles,
  equineMagazineProfilesLoading,
  onDeleteEquineMagazineProfile,
}) => {
  const navigate = useNavigate();

  const navigateTo = (pathname) => navigate(pathname);

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
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="equineMagazineProfiles"
            name="/livestock-and-equines/:livestockAndEquineId/equine-magazine-profiles/:equineMagazineProfileId/pdf-equine-magazine-profile"
          >
            <IconAction
              tooltipTitle="Pdf"
              icon={faFilePdf}
              styled={{ color: (theme) => theme.colors.error }}
              onClick={() =>
                navigateTo(
                  `${equineMagazineProfile.id}/pdf-equine-magazine-profile`
                )
              }
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="equineMagazineProfiles"
            name="/livestock-and-equines/:livestockAndEquineId/equine-magazine-profiles/:equineMagazineProfileId"
          >
            <IconAction
              tooltipTitle="Editar"
              icon={faEdit}
              onClick={() => navigateTo(equineMagazineProfile.id)}
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="equineMagazineProfiles"
            name="/livestock-and-equines/:livestockAndEquineId/equine-magazine-profiles#delete"
          >
            <IconAction
              tooltipTitle="Eliminar"
              icon={faTrash}
              styled={{ color: (theme) => theme.colors.error }}
              onClick={() =>
                onDeleteEquineMagazineProfile(equineMagazineProfile.id)
              }
            />
          </Acl>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={equineMagazineProfiles}
      loading={equineMagazineProfilesLoading}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};
