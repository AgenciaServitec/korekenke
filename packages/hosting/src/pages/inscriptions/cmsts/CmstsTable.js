import React from "react";
import { Table } from "antd";

export const CmstsTable = () => {
  const columns = [
    {
      title: "CIP",
      dataIndex: "cip",
      key: "cip",
    },
    {
      title: "Nombre",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Apellido Paterno",
      dataIndex: "paternalSurname",
      key: "paternalSurname",
    },
    {
      title: "Apellido Materno",
      dataIndex: "maternalSurname",
      key: "maternalSurname",
    },
  ];

  const data = [
    {
      key: "1",
      cip: "987654321",
      firstName: "Angel",
      paternalSurname: "Gala",
      maternalSurname: "Flores",
    },
    {
      key: "2",
      cip: "987654321",
      firstName: "Angel",
      paternalSurname: "Gala",
      maternalSurname: "Flores",
    },
    {
      key: "3",
      cip: "987654321",
      firstName: "Angel",
      paternalSurname: "Gala",
      maternalSurname: "Flores",
    },
    {
      key: "4",
      cip: "987654321",
      firstName: "Angel",
      paternalSurname: "Gala",
      maternalSurname: "Flores",
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};
