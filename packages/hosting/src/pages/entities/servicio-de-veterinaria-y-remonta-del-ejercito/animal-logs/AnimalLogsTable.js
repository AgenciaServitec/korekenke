import React from "react";
import { Acl, IconAction, Space, Table } from "../../../../components";
import { faIdCard } from "@fortawesome/free-solid-svg-icons";
import { capitalize, orderBy } from "lodash";
import dayjs from "dayjs";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../firebase/firestore";

export const AnimalLogsTable = ({
  animals,
  onNavigateGoToPdfAnimalRegistrationCard,
  loading,
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
            subCategory="animalLogs"
            name="/animal-logs/:animalId/pdf-animal-log-card"
          >
            <IconAction
              tooltipTitle="Ver tarjeta"
              icon={faIdCard}
              onClick={() => onNavigateGoToPdfAnimalRegistrationCard(animal.id)}
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
      loading={loading}
    />
  );
};
