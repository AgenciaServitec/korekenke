import React from "react";
import { Acl, IconAction, Space, Table } from "../../../../components";
import {
  faEdit,
  faIdCard,
  faListCheck,
  faNotesMedical,
  faTrash,
  faTree,
} from "@fortawesome/free-solid-svg-icons";
import { capitalize, orderBy } from "lodash";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";
import { useAuthentication } from "../../../../providers";

export const AnimalsTable = ({
  animals,
  onEditAnimal,
  onConfirmRemoveAnimal,
  onNavigateGoToPdfAnimalRegistrationCard,
  onNavigateGoToAnimalMagazineProfiles,
  onNavigateGoToClinicHistory,
  onNavigateGoToFamilyTree,
}) => {
  const { authUser } = useAuthentication();

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
      render: (_, animal) => animal.registrationNumber || "S/N",
    },
    {
      title: "N° Chip",
      dataIndex: "chipNumber",
      key: "chipNumber",
      render: (_, animal) => animal.chipNumber || "S/N",
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
              tooltipTitle="Árbol genealógico"
              icon={faTree}
              onClick={() => onNavigateGoToFamilyTree(animal.id)}
            />
          </Acl>
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
            subCategory="animalMagazineProfiles"
            name="/animals/:animalId/animal-magazine-profiles"
          >
            <IconAction
              tooltipTitle="Ficha revista Animal"
              icon={faListCheck}
              onClick={() => onNavigateGoToAnimalMagazineProfiles(animal.id)}
            />
          </Acl>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="animals"
            name="/animals/:animalId/pdf-animal-card"
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

  const animalsView = animals.filter((animal) =>
    ["super_admin", "manager"].includes(authUser.roleCode)
      ? true
      : animal.userId === authUser.id
  );

  return (
    <Table
      columns={columns}
      dataSource={orderBy(animalsView, "createAt", "desc")}
      scroll={{ x: "max-content" }}
    />
  );
};
