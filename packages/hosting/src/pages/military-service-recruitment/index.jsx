import React, { useEffect } from "react";
import {
  militaryRecruitmentRef,
  updateMilitaryRecruitment,
} from "../../firebase/collections";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  Acl,
  Button,
  Col,
  modalConfirm,
  notification,
  Row,
  Title,
} from "../../components";
import { useNavigate } from "react-router-dom";
import { useDefaultFirestoreProps } from "../../hooks";
import { MilitaryRecruitmentTable } from "./militaryRecruitmentTable";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";

export const MilitaryRecruitmentServicesIntegration = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const [
    militaryRecruitment,
    militaryRecruitmentLoading,
    militaryRecruitmentError,
  ] = useCollectionData(militaryRecruitmentRef.where("isDeleted", "==", false));

  useEffect(() => {
    militaryRecruitmentError && notification({ type: "error" });
  }, [militaryRecruitmentError]);

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
      militaryRecruitmentLoading={militaryRecruitmentLoading}
      militaryRecruitment={militaryRecruitment}
      onEditMilitaryRecruitment={onEditMilitaryRecruitment}
      onConfirmDeleteMilitaryRecruitment={onConfirmDeleteMilitaryRecruitment}
    />
  );
};

const MilitaryRecruitmentServiceList = ({
  militaryRecruitmentLoading,
  militaryRecruitment,
  onEditMilitaryRecruitment,
  onConfirmDeleteMilitaryRecruitment,
}) => {
  const onGoToStatistics = () =>
    window.open("https://lookerstudio.google.com/s/laniAI0kxnA", "_blank");

  return (
    <Acl
      category="public"
      subCategory="militaryServiceRecruitment"
      name="/military-service-recruitment"
      redirect
    >
      <Container>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="header-content">
              <Title level={3}>Lista de Registrados</Title>
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faChartPie} />}
                onClick={() => onGoToStatistics()}
              >
                {" "}
                Ver estadísticas
              </Button>
            </div>
          </Col>
          <Col span={24}>
            <MilitaryRecruitmentTable
              loading={militaryRecruitmentLoading}
              militaryRecruitment={militaryRecruitment}
              onEditMilitaryRecruitment={onEditMilitaryRecruitment}
              onConfirmDeleteMilitaryRecruitment={
                onConfirmDeleteMilitaryRecruitment
              }
            />
          </Col>
        </Row>
      </Container>
    </Acl>
  );
};

const Container = styled.div`
  .header-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1em;
  }
`;
