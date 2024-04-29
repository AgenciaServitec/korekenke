import React from "react";
import { Row, Col } from "antd/lib";
import { Table } from "antd";
import Title from "antd/es/typography/Title";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { usersRef } from "../../../../firebase/collections/users";

export const AllRegistered = () => {
  const [inscribedUsers = [], inscribedUsersLoading, inscribedUsersError] =
    useCollectionData(usersRef.where("isDeleted", "==", false));

  console.log(inscribedUsers);

  const columns = [
    {
      title: "Nombres y Apellidos",
      key: "fullName",
      render: (_, value) =>
        `${_.firstName} ${_.paternalSurname} ${_.maternalSurname}`,
    },
    {
      title: "CIP",
      dataIndex: "cip",
      key: "cip",
    },
    {
      title: "DNI",
      dataIndex: "dni",
      key: "dni",
    },
    {
      title: "Estado Civil",
      dataIndex: "civilStatus",
      key: "civilStatus",
    },
    {
      title: "Género",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Ubigeo de Nacimiento",
      dataIndex: "placeBirth",
      key: "placeBirth",
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "birthdate",
      key: "birthdate",
    },
    {
      title: "Ubigeo de Vivienda",
      dataIndex: "houseLocation",
      key: "houseLocation",
    },
    {
      title: "Urbanización",
      dataIndex: "urbanization",
      key: "urbanization",
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Celular de Emergencia",
      key: "emergencyCellPhone",
      render: (_, value) => _.emergencyCellPhone?.number || "",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col>
        <Title level={2}>Inscritos en Circulo Militar</Title>
      </Col>
      <Col>
        <Table columns={columns} dataSource={inscribedUsers} />
      </Col>
    </Row>
  );
};
