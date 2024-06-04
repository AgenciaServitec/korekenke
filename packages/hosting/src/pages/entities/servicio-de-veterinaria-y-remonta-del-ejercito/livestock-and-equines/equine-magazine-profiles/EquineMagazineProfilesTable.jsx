import React from "react";
import { Space, Table } from "antd";
import { IconAction } from "../../../../../components";
import { faEdit, faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const EquineMagazineProfilesTable = ({ livestockOrEquineId }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: () => <div>_</div>,
    },
    {
      title: "Condición Corporal",
      key: "bodyContition",
      dataIndex: "bodyContition",
      render: () => <div>_</div>,
    },
    {
      title: "Toillete",
      dataIndex: "toillete",
      key: "toillete",
      render: () => <div>_</div>,
    },
    {
      title: "Herrado",
      key: "horseshoe",
      dataIndex: "horseshoe",
      render: () => <div>_</div>,
    },
    {
      title: "Acciones",
      key: "action",
      render: () => (
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
          <IconAction tooltipTitle="Editar" icon={faEdit} onClick={() => ""} />
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
      dataSource={[]}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};
