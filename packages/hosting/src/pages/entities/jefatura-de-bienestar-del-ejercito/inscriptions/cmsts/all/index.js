import React, { useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { cmstsEnrollmentsRef } from "../../../../../../firebase/collections";
import {
  Acl,
  Col,
  notification,
  Row,
  Table,
  Title,
} from "../../../../../../components";
import { useGlobalData } from "../../../../../../providers";
import { Tag } from "antd";

export const AllRegistered = () => {
  const { users } = useGlobalData();
  const [
    cmstsEnrollments = [],
    cmstsEnrollmentsLoading,
    cmstsEnrollmentsError,
  ] = useCollectionData(cmstsEnrollmentsRef.where("isDeleted", "==", false));

  useEffect(() => {
    cmstsEnrollmentsError && notification({ type: "error" });
  }, [cmstsEnrollmentsError]);

  const columns = [
    {
      title: "Apellidos y Nombres",
      key: "paternalSurname",
      sorter: (a, b) => a.paternalSurname.length - b.paternalSurname.length,
      render: (_) => `${_.paternalSurname} ${_.maternalSurname} ${_.firstName}`,
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
      sorter: (a, b) =>
        a?.civilStatus
          ? a.civilStatus.length - b.civilStatus.length
          : undefined,
    },
    {
      title: "Género",
      dataIndex: "gender",
      key: "gender",
      sorter: (a, b) =>
        a?.gender ? a.gender.length - b.gender.length : undefined,
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
      sortDirections: ["descend", "ascend"],
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
      dataIndex: "emergencyCellPhone",
      key: "emergencyCellPhone",
      render: (emergencyCellPhone, _) => emergencyCellPhone?.number || "",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status, _) => (
        <Tag color="warning">{status === "pending" && "Pendiente"}</Tag>
      ),
    },
  ];

  const cmstsEnrollmentsView = cmstsEnrollments.map((cmstsEnrollment) => {
    const user = users.find((user) => user.id === cmstsEnrollment.userId);

    return { ...user, ...cmstsEnrollment };
  });

  return (
    <Acl
      category="jefatura-de-bienestar-del-ejercito"
      subCategory="inscriptions"
      name="/inscriptions/cmsts/all"
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>Inscritos en Circulo Militar</Title>
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={cmstsEnrollmentsView}
            loading={cmstsEnrollmentsLoading}
            virtual
            bordered
            size="small"
            scroll={{
              x: "max-content",
            }}
          />
        </Col>
      </Row>
    </Acl>
  );
};
