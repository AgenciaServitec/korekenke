import React from "react";
import { Acl, IconAction, Space, Table } from "../../../../../components";
import { faEdit, faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { orderBy } from "lodash";

export const AnimalMagazineProfilesTable = ({
  animalMagazineProfiles,
  animalMagazineProfilesLoading,
  onDeleteAnimalMagazineProfile,
}) => {
  const navigate = useNavigate();

  const navigateTo = (pathname) => navigate(pathname);

  const columns = [
    {
      title: "Fecha creación",
      dataIndex: "createAt",
      key: "createAt",
      render: (_, animalMagazineProfile) => (
        <div>
          {dayjs(animalMagazineProfile?.createAt.toDate()).format(
            "DD/MM/YYYY HH:mm"
          )}
        </div>
      ),
    },
    {
      title: "Condición Corporal",
      key: "bodyContition",
      dataIndex: "bodyContition",
      render: (_, animalMagazineProfile) => (
        <div>{animalMagazineProfile?.bodyCondition?.name}</div>
      ),
    },
    {
      title: "Toillete",
      dataIndex: "toillete",
      key: "toillete",
      render: (_, animalMagazineProfile) => (
        <div>{animalMagazineProfile?.toillete?.name}</div>
      ),
    },
    {
      title: "Patas",
      key: "paws",
      dataIndex: "paws",
      render: (_, animalMagazineProfile) => (
        <div>{animalMagazineProfile?.paws?.name}</div>
      ),
    },
    {
      title: "Acciones",
      align: "center",
      key: "action",
      render: (_, animalMagazineProfile) => (
        <Space>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="animalMagazineProfiles"
            name="/animals/:animalId/animal-magazine-profiles/:animalMagazineProfileId/pdf-animal-magazine-profile"
          >
            <IconAction
              tooltipTitle="Pdf"
              icon={faFilePdf}
              styled={{ color: (theme) => theme.colors.error }}
              onClick={() =>
                navigateTo(
                  `${animalMagazineProfile.id}/pdf-animal-magazine-profile`
                )
              }
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="animalMagazineProfiles"
            name="/animals/:animalId/animal-magazine-profiles/:animalMagazineProfileId"
          >
            <IconAction
              tooltipTitle="Editar"
              icon={faEdit}
              onClick={() => navigateTo(animalMagazineProfile.id)}
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="animalMagazineProfiles"
            name="/animals/:animalId/animal-magazine-profiles#delete"
          >
            <IconAction
              tooltipTitle="Eliminar"
              icon={faTrash}
              styled={{ color: (theme) => theme.colors.error }}
              onClick={() =>
                onDeleteAnimalMagazineProfile(animalMagazineProfile.id)
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
      dataSource={orderBy(animalMagazineProfiles, "createAt", "desc")}
      loading={animalMagazineProfilesLoading}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};
