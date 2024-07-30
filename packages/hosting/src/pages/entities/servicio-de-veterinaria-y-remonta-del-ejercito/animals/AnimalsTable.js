import React from "react";
import { Acl, IconAction, Space, Table } from "../../../../components";
import {
  faEdit,
  faIdCard,
  faListCheck,
  faNotesMedical,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { capitalize, orderBy } from "lodash";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";

export const AnimalsTable = ({
  animals,
  onEditAnimal,
  onConfirmRemoveAnimal,
  onNavigateGoToPdfAnimalRegistrationCard,
  onNavigateGoToAnimalMagazineProfiles,
  onNavigateGoToClinicHistory,
}) => {
  const columns = [
    {
      title: "Fecha creación",
      dataIndex: "createAt",
      key: "createAt",
      render: (_, animal) =>
        dayjs(animal.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (_, animal) => capitalize(animal?.name || ""),
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
      render: (_, animal) => (animal.gender === "male" ? "Macho" : "Hembra"),
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (_, animal) =>
        dayjs(animal.birthdate, DATE_FORMAT_TO_FIRESTORE).format("DD/MM/YYYY"),
    },
    {
      title: "Acciones",
      align: "center",
      key: "actions",
      render: (_, animal) => (
        <Space>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="clinicHistory"
            name="/animals/:animalId/clinic-history"
          >
            <IconAction
              tooltipTitle="Historial clinico"
              icon={faNotesMedical}
              onClick={() => onNavigateGoToClinicHistory(animal.id)}
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="equineMagazineProfiles"
            name="/animals/:animalId/equine-magazine-profiles"
          >
            <IconAction
              tooltipTitle="Ficha revista equina"
              icon={faListCheck}
              onClick={() => onNavigateGoToAnimalMagazineProfiles(animal.id)}
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="animals"
            name="/animals/:animalId/pdf-equine-livestock-registration-card"
          >
            <IconAction
              tooltipTitle="Ver tarjeta"
              icon={faIdCard}
              onClick={() => onNavigateGoToPdfAnimalRegistrationCard(animal.id)}
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="animals"
            name="/animals/:animalId"
          >
            <IconAction
              tooltipTitle="Editar"
              icon={faEdit}
              onClick={() => onEditAnimal(animal)}
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="animals"
            name="/animals#delete"
          >
            <IconAction
              tooltipTitle="Eliminar"
              styled={{ color: (theme) => theme.colors.error }}
              icon={faTrash}
              onClick={() => onConfirmRemoveAnimal(animal)}
            />
          </Acl>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orderBy(animals, "createAt", "desc")}
      scroll={{ x: "max-content" }}
    />
  );
};
