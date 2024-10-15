import React from "react";
import {
  militaryRecruitmentRef,
  updateMilitaryRecruitment,
} from "../../firebase/collections";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Col, modalConfirm, Row, Title } from "../../components";
import { useNavigate } from "react-router-dom";
import { useDefaultFirestoreProps } from "../../hooks";
import { MilitaryRecruitmentTable } from "./militaryRecruitmentTable";
import { Space } from "antd";

export const MilitaryRecruitmentServicesIntegration = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const [
    militaryRecruitment,
    militaryRecruitmentLoading,
    militaryRecruitmentError,
  ] = useCollectionData(militaryRecruitmentRef.where("isDeleted", "==", false));

  const navigateTo = (pathname = "new") => navigate(pathname);

  const onEditMilitaryRecruitment = (recruited) => navigateTo(recruited.id);

  const onConfirmDeleteMilitaryRecruitment = async (recruited) => {
    modalConfirm({
      title: "¿Estás seguro que quieres eliminar la solicitud?",
      onOk: async () => {
        await updateMilitaryRecruitment(
          recruited.id,
          assignDeleteProps({ isDeleted: true }),
        );
      },
    });
  };

  return (
    <MilitaryRecruitmentServiceList
      militaryRecruitment={militaryRecruitment}
      onEditMilitaryRecruitment={onEditMilitaryRecruitment}
      onConfirmDeleteMilitaryRecruitment={onConfirmDeleteMilitaryRecruitment}
    />
  );
};

const MilitaryRecruitmentServiceList = ({
  militaryRecruitment,
  onEditMilitaryRecruitment,
  onConfirmDeleteMilitaryRecruitment,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space>
          <Title level={3}>Lista de Registrados</Title>
        </Space>
      </Col>
      <Col span={24}>
        <MilitaryRecruitmentTable
          militaryRecruitment={militaryRecruitment}
          onEditMilitaryRecruitment={onEditMilitaryRecruitment}
          onConfirmDeleteMilitaryRecruitment={
            onConfirmDeleteMilitaryRecruitment
          }
        />
      </Col>
    </Row>
  );
};
