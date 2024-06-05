import React from "react";
import { Space, Table } from "antd";
import { Acl, IconAction } from "../../../../components";
import { faEdit, faIdCard, faTrash } from "@fortawesome/free-solid-svg-icons";
import { capitalize } from "lodash";

export const LiveStockAndEquinesTable = ({
  livestockAndEquines,
  onEditLiveStockAndEquine,
  onConfirmRemoveLiveStockAndEquine,
  onNavigateGoToPdfEquineLivestockRegistrationCard,
}) => {
  const columns = [
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
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "birthdate",
      key: "birthdate",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, livestockAndEquine) => (
        <Space>
          <IconAction
            tooltipTitle="Ver tarjeta"
            icon={faIdCard}
            onClick={() =>
              onNavigateGoToPdfEquineLivestockRegistrationCard(
                livestockAndEquine.id
              )
            }
          />
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
      dataSource={livestockAndEquines}
      scroll={{ x: "max-content" }}
    />
  );
};
