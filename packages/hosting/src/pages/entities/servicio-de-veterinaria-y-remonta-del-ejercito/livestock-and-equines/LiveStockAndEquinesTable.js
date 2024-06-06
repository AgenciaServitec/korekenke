import React from "react";
import { Space, Table } from "antd";
import { Acl, IconAction } from "../../../../components";
import {
  faEdit,
  faIdCard,
  faListCheck,
  faNotesMedical,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { capitalize, orderBy } from "lodash";
import moment from "moment";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";

export const LiveStockAndEquinesTable = ({
  livestockAndEquines,
  onEditLiveStockAndEquine,
  onConfirmRemoveLiveStockAndEquine,
  onNavigateGoToPdfEquineLivestockRegistrationCard,
  onNavigateGoToEquineMagazineProfiles,
  onNavigateGoToClinicHistory,
}) => {
  const columns = [
    {
      title: "Fecha creación",
      dataIndex: "createAt",
      key: "createAt",
      render: (_, livestockAndEquine) =>
        moment(livestockAndEquine.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (_, livestockAndEquine) =>
        capitalize(livestockAndEquine?.name || ""),
    },
    {
      title: "N° Matrícula",
      dataIndex: "registrationNumber",
      key: "registrationNumber",
    },
    {
      title: "N° Chip",
      dataIndex: "chipNumber",
      key: "chipNumber",
    },
    {
      title: "Sexo",
      dataIndex: "gender",
      key: "gender",
      render: (_, livestockAndEquine) =>
        livestockAndEquine.gender === "male" ? "Macho" : "Hembra",
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (_, livestockAndEquine) =>
        moment(livestockAndEquine.birthdate, DATE_FORMAT_TO_FIRESTORE).format(
          "DD/MM/YYYY"
        ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, livestockAndEquine) => (
        <Space>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="clinicHistory"
            name="/livestock-and-equines/:livestockAndEquineId/clinic-history/:clinicHistoryId"
          >
            <IconAction
              tooltipTitle="Historial clinico"
              icon={faNotesMedical}
              onClick={() => onNavigateGoToClinicHistory(livestockAndEquine.id)}
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="equineMagazineProfiles"
            name="/livestock-and-equines/:livestockAndEquineId/equine-magazine-profiles/:equineMagazineProfileId"
          >
            <IconAction
              tooltipTitle="Ficha revista equina"
              icon={faListCheck}
              onClick={() =>
                onNavigateGoToEquineMagazineProfiles(livestockAndEquine.id)
              }
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="livestockAndEquines"
            name="/livestock-and-equines/:livestockAndEquineId/pdf-equine-livestock-registration-card"
          >
            <IconAction
              tooltipTitle="Ver tarjeta"
              icon={faIdCard}
              onClick={() =>
                onNavigateGoToPdfEquineLivestockRegistrationCard(
                  livestockAndEquine.id
                )
              }
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="livestockAndEquines"
            name="/livestock-and-equines/:livestockAndEquineId"
          >
            <IconAction
              tooltipTitle="Editar"
              icon={faEdit}
              onClick={() => onEditLiveStockAndEquine(livestockAndEquine)}
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="livestockAndEquines"
            name="/livestock-and-equines#delete"
          >
            <IconAction
              tooltipTitle="Eliminar"
              styled={{ color: (theme) => theme.colors.error }}
              icon={faTrash}
              onClick={() =>
                onConfirmRemoveLiveStockAndEquine(livestockAndEquine)
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
      dataSource={orderBy(livestockAndEquines, "createAt", "desc")}
      scroll={{ x: "max-content" }}
    />
  );
};
