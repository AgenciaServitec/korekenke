import React from "react";
import { Table } from "../../../../components";

export const DasRequestsListTable = () => {
  const columns = [
    {
      title: "Fecha de Creación",
      dataIndex: "createAt",
      key: "createAt",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Opciones",
      dataIndex: "options",
      key: "options",
    },
  ];
  return <Table columns={columns} scroll={{ x: "max-content" }} />;
};

export default DasRequestsListTable;
